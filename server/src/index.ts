import dotenv from "dotenv";
import express from "express";
import { WebSocketServer } from "ws";
import helmet from "helmet";
import { connectionListener } from "./WebSocketConnection.js";
dotenv.config();

const PORT = isNaN(Number(process.env.PORT)) ? 8080 : Number(process.env.PORT);
const app = express();
app.use(helmet());

/* 
app.use("/", (req, res, next) => {
  res.setHeader("set-cookie", "testkey=testvalue");
  return next();
});
*/

process.env.NODE_ENV === "production"
  ? app.use("/", express.static("../build"))
  : app.use("/", express.static("../client/build"));

const server = app.listen(PORT, () =>
  console.log(`Express server ready, port: ${PORT}`)
);

const wss = new WebSocketServer({
  path: "/",
  clientTracking: true,
  server: server,
  maxPayload: 4096,
});

wss.once("listening", () => console.log(`WebSocket server ready`));
wss.on("connection", connectionListener);

wss.on("headers", (headers, req) => console.log(headers, req));

setInterval(() => console.log(wss.clients), 60 * 1000);
export const clients = wss.clients;
