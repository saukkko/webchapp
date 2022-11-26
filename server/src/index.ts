import dotenv from "dotenv";
import express from "express";
import { WebSocketServer } from "ws";
import helmet from "helmet";
import { connectionListener } from "./WebSocketConnection.js";
import { db } from "./SQLite.js";
dotenv.config();

const PORT = isNaN(Number(process.env.NODE_PORT))
  ? 53000
  : Number(process.env.NODE_PORT);
const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: { "script-src": ["'self'", "webchapp.herokuapp.com"] },
    },
  })
);

// 3600000 ms = 1 hour, 1800000 = 30 min

let staticContent = express.static("client", {
  maxAge: 0.5 * 3600000,
});

if (process.env.NODE_ENV !== "production")
  staticContent = express.static("../client/build", {
    maxAge: 0.5 * 3600000,
  });

console.log("Node.JS environment: " + process.env.NODE_ENV);
app.use("/", staticContent);

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

wss.on("headers", (headers, req) =>
  console.log({
    host: req.headers.host,
    origin: req.headers.origin,
  })
);

setInterval(() => {
  console.log("Current client count:" + wss.clients.size);
  if (wss.clients.size < 1) db.exec(`DELETE FROM "connections";`); // delete any dangling connections possibly left and vacuum the db
}, 60 * 1000);

setInterval(
  () => (wss.clients.size < 1 ? db.exec(`VACUUM;`) : null),
  24 * 3600 * 1000
);

export const clients = wss.clients;
