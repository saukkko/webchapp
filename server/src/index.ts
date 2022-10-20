import express from "express";
import { WebSocketServer } from "ws";
import { connectionListener } from "./WebSocketConnection.js";

const PORT = isNaN(Number(process.env.PORT)) ? 8080 : Number(process.env.PORT);
const app = express();

const server = app.listen(PORT, () =>
  console.log(`Express server ready, port: ${PORT}`)
);
const wss = new WebSocketServer({
  path: "/",
  clientTracking: true,
  server: server,
});

wss.once("listening", () => console.log(`WebSocket server ready`));
wss.on("connection", connectionListener);
