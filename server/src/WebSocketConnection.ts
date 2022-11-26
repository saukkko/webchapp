import type { IncomingMessage } from "http";
import type { WebSocket } from "ws";

import { Client } from "./Client.js";


export const connectionListener = (ws: WebSocket, req: IncomingMessage) => {
  let client: Client | null = new Client(ws, req);
  client.beginListenHeartbeat();
  client.beginListenMessages();
  ws.on("close", () => (client = null));
};
