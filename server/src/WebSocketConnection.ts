import type { IncomingMessage } from "http";
import type { WebSocket } from "ws";
import {
  handleWsClose,
  handleWsMessage,
  handleWsError,
} from "./WebSocketHandlers.js";

export const connectionListener = (ws: WebSocket, req: IncomingMessage) => {
  console.log(`New connection
  IP: ${req.socket.remoteAddress}
  Host: ${req.headers.host}
  User-Agent: ${req.headers["user-agent"]}
  Cookies: ${req.headers.cookie}`);

  ws.on("message", handleWsMessage);
  ws.on("close", handleWsClose);
  ws.on("error", handleWsError);
  // ws.on("ping", handleWsPing);
  // ws.on("pong", handleWsPong);
  // ws.on("unexpected-response", handleWsUnexpectedResponse);
  // ws.on("upgrade", handleWsUpgrade);
  // ws.on("open", handleWsOpen);
};
