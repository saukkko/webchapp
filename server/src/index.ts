import { WebSocketServer } from "ws";

const wss = new WebSocketServer({
  port: 8080,
  path: "/",
});
