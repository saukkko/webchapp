import type { IncomingHttpHeaders, IncomingMessage } from "http";
import type { RawData, WebSocket } from "ws";
import type { CompactVerifyResult, CompactJWSHeaderParameters } from "jose";
import { createPrivateKey, createPublicKey, randomUUID } from "crypto";

import { validate as validateUUID, version as versionUUID } from "uuid";
import { readFile } from "fs/promises";
import { CompactSign, compactVerify } from "jose";
import { Temporal } from "@js-temporal/polyfill";
import { db } from "./SQLite.js";
import { WSCloseEvent } from "./Enums.js";
import { clients } from "./index.js";

const isValidUUIDv4 = (uuid: string) =>
  validateUUID(uuid) && versionUUID(uuid) === 4;
/*
const parseCookies = (cookieHeader?: string) => {
  if (!cookieHeader) return;
  const cookieArr = cookieHeader
    .split(";")
    .map((x) => x.trim())
    .filter((x) => x);

  const cookies = cookieArr
    .map((x) => {
      const [key, value] = x.split("=");
      if (!key || !value) return [];
      return [decodeURIComponent(key).trim(), decodeURIComponent(value).trim()];
    })
    .filter((x) => x);

  const a = cookies
    .map((x) => (x.length < 2 ? [] : x))
    .filter((y) => y.length > 0);
  return Object.fromEntries(a);
};
*/
const privateKeyFile = await readFile("private.key").then((data) => data);
const secret = createPrivateKey(privateKeyFile);
const pubKey = createPublicKey(secret);

console.log(secret.export({ format: "pem", type: "sec1" }));
console.log(pubKey.export({ format: "pem", type: "spki" }));
console.log(pubKey.export({ format: "jwk" }));

export const connectionListener = (ws: WebSocket, req: IncomingMessage) => {
  let client: Client | null = new Client(ws, req);
  client.beginListenHeartbeat();
  client.beginListenMessages();
  ws.on("close", () => (client = null));
};

export class Client {
  private readonly _ws: WebSocket;
  public get ws(): WebSocket {
    return this._ws;
  }
  private readonly _headers: IncomingHttpHeaders;
  public get headers(): IncomingHttpHeaders {
    return this._headers;
  }
  private readonly _id = randomUUID();
  public get id() {
    return this._id;
  }
  public timeout = 10000;
  private readonly url: URL;
  private heartbeatTimer?: NodeJS.Timer;
  private isListeningMessages = false;

  constructor(ws: WebSocket, req: IncomingMessage) {
    this._ws = ws;
    this._headers = req.headers;
    this.url = new URL("ws://localhost:8080/" + req.url);
    this.saveConnection();
  }

  private doTimeout(timeout: number) {
    return setTimeout(() => {
      this.terminate(WSCloseEvent["Timed out"]);
    }, timeout);
  }

  public beginListenHeartbeat() {
    this.heartbeatTimer = this.doTimeout(this.timeout);
  }

  private terminate(code = WSCloseEvent["Abnormal Closure"]) {
    this.deleteConnection();
    this.ws.close(code, WSCloseEvent[code]);
    this.ws.terminate();
  }

  public beginListenMessages() {
    if (this.isListeningMessages)
      return console.error("Already listening 'message' events");
    this.isListeningMessages = true;

    this.ws.on("message", (data: RawData, isBinary: boolean) => {
      if (isBinary) console.error("Binary data handling not yet implemented");
      const messageObject: MessageObject = JSON.parse(data.toString());

      switch (messageObject.type) {
        case "message":
          db.all('SELECT nick FROM "connections";', (err, rows) => {
            if (err) return console.error(err);
            const users = rows as Record<string, string>[];

            clients.forEach((ws) => {
              ws.send(
                JSON.stringify({
                  type: "message",
                  timestamp: Temporal.Now.instant().epochSeconds,
                  users: users,
                  data: messageObject.data,
                })
              );
            });
          });
          break;

        case "heartbeat":
          this.send({ type: "ack" }, false);
          clearTimeout(this.heartbeatTimer);
          this.heartbeatTimer = this.doTimeout(this.timeout);
          break;

        default:
          break;
      }
    });
  }

  public send(data: MessageObject, echoToAll = true) {
    db.all('SELECT nick FROM "connections";', (err, rows) => {
      const users = rows as Record<string, string>[];
      data.users = users;
      echoToAll
        ? clients.forEach((ws) => {
            ws.send(JSON.stringify(data));
          })
        : this.ws.send(JSON.stringify(data));
    });
  }

  private async saveConnection() {
    const now = Temporal.Now.instant();

    // parse room, nick, token and wskey from the connection
    const wsKey = this.headers["sec-websocket-key"];
    const { room, nick, token } = Object.fromEntries(
      this.url.searchParams.entries()
    );

    // build jws payload
    const jwsPayload: JWSPayload = {
      room: room,
      nick: nick,
      key: wsKey,
      uuid: this.id,
    };

    // issue the token
    const jws = await new CompactSign(
      new TextEncoder().encode(JSON.stringify(jwsPayload))
    )
      .setProtectedHeader({
        alg: "ES256",
        nbf: now.epochSeconds - 300,
        exp: now.epochSeconds + 3600,
        iat: now.epochSeconds,
      })
      .sign(secret);

    // send the token to the client
    this.send(
      {
        type: "token",
        token: jws,
      },
      false
    );

    // finally save the connection
    if (token) {
      // verify token headers
      const verifyResult: VerifyResult = await compactVerify(token, secret);
      const { nbf, iat, exp } = verifyResult.protectedHeader;
      if (!iat || !nbf || !exp) return; // invalid header
      if (iat > now.epochSeconds) return; // invalid iat: (in the future)
      if (nbf >= now.epochSeconds) return; // token not yet valid
      if (exp <= now.epochSeconds) return; // token seems to be valid but expired => issue new one

      // parse the payload
      const payload: JWSPayload = JSON.parse(
        new TextDecoder().decode(verifyResult.payload).toString()
      );

      if (
        !payload.nick ||
        payload.nick.length < 1 ||
        !isValidUUIDv4(payload.uuid)
      )
        return this.terminate(WSCloseEvent["Invalid payload"]);
      db.serialize(() => {
        db.get(
          'SELECT id FROM "connections" WHERE uuid = ?',
          payload.uuid,
          (err, row) =>
            row
              ? db.run(
                  'UPDATE "connections" SET uuid=?, room=?, nick=?, key=?, timestamp=? WHERE uuid = ?',
                  [
                    this.id,
                    payload.room,
                    payload.nick,
                    wsKey,
                    now.epochSeconds,
                    payload.uuid,
                  ]
                )
              : db.run(
                  'INSERT OR REPLACE INTO "connections" (uuid, room, nick, key, timestamp) VALUES (?,?,?,?,?)',
                  [
                    payload.uuid,
                    payload.room,
                    payload.nick,
                    wsKey,
                    now.epochSeconds,
                  ]
                )
        );
      });
    } else {
      db.run(
        'INSERT INTO "connections" (uuid, room, nick, key, timestamp) VALUES (?,?,?,?,?)',
        [this.id, room, nick, wsKey, now.epochSeconds]
      );
    }
  }

  private deleteConnection() {
    db.run('DELETE FROM "connections" WHERE uuid=?', this.id);
  }
}

type MessageObject = {
  type: "message" | "heartbeat" | "token" | "ack";
  data?: MessageData;
  timestamp?: number;
  token?: string;
  users?: Record<string, string>[];
};

type MessageData = {
  nick: string;
  msg: string;
};

type CompactJWSHeaderExtraParameters = CompactJWSHeaderParameters & {
  nbf?: number;
  exp?: number;
  iat?: number;
};

type VerifyResult = CompactVerifyResult & {
  protectedHeader: CompactJWSHeaderExtraParameters;
};

type JWSPayload = {
  room: string;
  nick: string;
  key?: string;
  uuid: string;
};
