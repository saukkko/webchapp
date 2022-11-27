import type { WebSocket, RawData } from "ws";
import type { IncomingHttpHeaders, IncomingMessage } from "http";
import type { CompactVerifyResult, CompactJWSHeaderParameters } from "jose";
import {
  validate as validateUUID,
  version as versionUUID,
  v4 as randomUUID,
} from "uuid";
import { CompactSign, compactVerify } from "jose";
import { Temporal } from "@js-temporal/polyfill";
import { db } from "./SQLite.js";
import { WSCloseEvent } from "./Enums.js";
import { clients } from "./index.js";
import { secret } from "./Secret.js";

const isValidUUIDv4 = (uuid: string) =>
  validateUUID(uuid) && versionUUID(uuid) === 4;

export class Client {
  private readonly _ws: WebSocket;
  public get ws(): WebSocket {
    return this._ws;
  }
  private readonly _headers: IncomingHttpHeaders;
  public get headers(): IncomingHttpHeaders {
    return this._headers;
  }
  public uuid = randomUUID();
  public timeout = 10000;
  private readonly url: URL;
  private heartbeatTimer?: NodeJS.Timer;
  private isListeningMessages = false;

  constructor(ws: WebSocket, req: IncomingMessage) {
    this._ws = ws;
    this._headers = req.headers;
    this.url = new URL(`ws://${req.headers.host}/${req.url}`);
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

  public terminate(code = WSCloseEvent["Abnormal Closure"]) {
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
          this.send({ type: "ack" }, { broadcast: false });
          clearTimeout(this.heartbeatTimer);
          this.heartbeatTimer = this.doTimeout(this.timeout);
          break;

        default:
          break;
      }
    });
  }

  public send(data: MessageObject, options = { broadcast: true }) {
    db.all('SELECT nick FROM "connections";', (err, rows) => {
      const users = rows as Record<string, string>[];
      data.users = users;
      options.broadcast
        ? clients.forEach((ws) => {
            ws.send(JSON.stringify(data));
          })
        : this.ws.send(JSON.stringify(data));
    });
  }

  private async verifyToken(
    token: string,
    now: Temporal.Instant
  ): Promise<JWSPayload> {
    return new Promise((resolve, reject: (reason: WSCloseEvent) => void) => {
      compactVerify(token, secret).then((verifyResult: VerifyResult) => {
        const { nbf, iat, exp } = verifyResult.protectedHeader;
        if (!iat || !nbf || !exp) {
          return reject(WSCloseEvent["Invalid header"]);
        }
        if (iat > now.epochSeconds) {
          return reject(WSCloseEvent["Token issued in the future"]);
        }
        if (nbf >= now.epochSeconds) {
          return reject(WSCloseEvent["Token not yet valid"]);
        }
        if (exp <= now.epochSeconds) {
          return reject(WSCloseEvent["Token expired"]); // TODO: should issue new token instead dropping the connection
        }
        // parse the payload
        const tokenPayload: JWSPayload = JSON.parse(
          new TextDecoder().decode(verifyResult.payload).toString()
        );

        if (
          !tokenPayload.nick ||
          tokenPayload.nick.length < 0 ||
          !isValidUUIDv4(tokenPayload.uuid)
        ) {
          return reject(WSCloseEvent["Invalid payload"]);
        }
        return resolve(tokenPayload);
      });
    });
  }

  private async saveConnection() {
    const now = Temporal.Now.instant();

    // parse room, nick, token and wskey from the connection
    const wsKey = this.headers["sec-websocket-key"];
    let { room, nick, token } = Object.fromEntries(
      this.url.searchParams.entries()
    );

    // save the connection

    if (token) {
      // verify token headers
      /*
      compactVerify(token, secret)
        .then((verifyResult: VerifyResult) => {
          const { nbf, iat, exp } = verifyResult.protectedHeader;
          if (!iat || !nbf || !exp)
            return this.terminate(WSCloseEvent["Invalid header"]);
          if (iat > now.epochSeconds)
            return this.terminate(WSCloseEvent["Token issued in the future"]);
          if (nbf >= now.epochSeconds)
            return this.terminate(WSCloseEvent["Token not yet valid"]);
          if (exp <= now.epochSeconds)
            return this.terminate(WSCloseEvent["Token expired"]); // TODO: should issue new token instead dropping the connection

          // parse the payload
          const tokenPayload: JWSPayload = JSON.parse(
            new TextDecoder().decode(verifyResult.payload).toString()
          );

          if (
            !tokenPayload.nick ||
            tokenPayload.nick.length < 0 ||
            !isValidUUIDv4(tokenPayload.uuid)
          )
            return this.terminate(WSCloseEvent["Invalid payload"]);

          // update the new token with values from old token
          jwsPayload.nick = tokenPayload.nick;
          jwsPayload.uuid = tokenPayload.uuid;
          jwsPayload.room = tokenPayload.room;
          */
      const tokenPayload = await this.verifyToken(token, now).catch(
        (code: WSCloseEvent) => {
          this.terminate(code);
          console.error(WSCloseEvent[code]);
        }
      );
      if (!tokenPayload) return;
      room = tokenPayload.room;
      nick = tokenPayload.nick;

      // update or insert the data
      db.serialize(() => {
        db.get(
          'SELECT * FROM "connections" WHERE uuid = ?',
          tokenPayload.uuid,
          (err, row) => {
            if (err) {
              console.error(err);
              this.terminate(WSCloseEvent["Server error"]);
            }
            row
              ? db.run(
                  'UPDATE "connections" SET room=?, nick=?, key=?, timestamp=? WHERE uuid = ?',
                  [
                    tokenPayload.room,
                    tokenPayload.nick,
                    wsKey,
                    now.epochSeconds,
                    tokenPayload.uuid,
                  ]
                )
              : db.run(
                  'INSERT OR REPLACE INTO "connections" (uuid, room, nick, key, timestamp) VALUES (?,?,?,?,?)',
                  [
                    tokenPayload.uuid,
                    tokenPayload.room,
                    tokenPayload.nick,
                    wsKey,
                    now.epochSeconds,
                  ]
                );
          }
        );
      });

      this.uuid = tokenPayload.uuid;
    }

    // if the user doesn't supply token, then we just insert the new data
    else {
      db.run(
        'INSERT INTO "connections" (uuid, room, nick, key, timestamp) VALUES (?,?,?,?,?)',
        [this.uuid, room, nick, wsKey, now.epochSeconds],
        (err) => {
          if (err) {
            console.error(err);
            this.terminate(WSCloseEvent["Server error"]);
          }
        }
      );
    }

    // issue the token and send it to client
    try {
      // build jws payload
      const jwsPayload: JWSPayload = {
        room: room,
        nick: nick,
        key: wsKey,
        uuid: this.uuid,
      };
      token = await new CompactSign(
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
          token: token,
        },
        { broadcast: false }
      );
    } catch (err) {
      console.error(err);
      return this.terminate(WSCloseEvent["Server error"]);
    }
  }

  private deleteConnection() {
    db.run('DELETE FROM "connections" WHERE uuid=?', this.uuid);
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
