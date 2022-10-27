import type { IncomingMessage } from "http";
import type { WebSocket } from "ws";
import {
  handleWsClose,
  handleWsMessage,
  handleWsError,
} from "./WebSocketHandlers.js";

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

export const connectionListener = (ws: WebSocket, req: IncomingMessage) => {
  ws.send("welcome");
  console.log(`New connection
  IP: ${req.socket.remoteAddress}
  Host: ${req.headers.host}
  User-Agent: ${req.headers["user-agent"]}
  Cookies: ${req.headers.cookie}`);

  console.log(parseCookies(req.headers.cookie));

  ws.on("message", (data, isBinary) => handleWsMessage(ws, data, isBinary));
  ws.on("close", handleWsClose);
  ws.on("error", handleWsError);

  // ws.on("ping", handleWsPing);
  // ws.on("pong", handleWsPong);
  // ws.on("unexpected-response", handleWsUnexpectedResponse);
  // ws.on("upgrade", handleWsUpgrade);
  // ws.on("open", handleWsOpen);
};
