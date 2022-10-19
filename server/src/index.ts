import { WebSocketServer } from "ws";

const wss = new WebSocketServer({
  port: 8080,
  path: "/",
});

wss.on("connection", (ws) => {
  console.log("wss connection");
  ws.on("open", () => console.log("ws open"));
  ws.on("message", (data) => {
    console.log(data.toString("utf8"));
  });
});
