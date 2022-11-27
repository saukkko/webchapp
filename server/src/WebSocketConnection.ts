import type { IncomingMessage } from "http";
import type { WebSocket } from "ws";

import { Client } from "./Client.js";

const clientList: Client[] = [];

export const connectionListener = (ws: WebSocket, req: IncomingMessage) => {
  let client: Client | null = new Client(ws, req);
  clientList.push(client);
  client.beginListenHeartbeat();
  client.beginListenMessages();
  ws.on("close", () => (client = null));
};

if (process.env.NODE_ENV !== "production") {
  setInterval(() => {
    clientList.forEach((client, i) => {
      const [uuid, wsKey, readyState] = [
        client.uuid,
        client.headers["sec-websocket-key"],
        client.ws.readyState,
      ];
      if (readyState !== client.ws.OPEN) clientList.splice(i, 1);
      console.log(uuid, wsKey, readyState);
    });
  }, 5000);
}
