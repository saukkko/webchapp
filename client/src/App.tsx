import React, { useEffect, useRef, useState } from "react";
import { compactVerify, createLocalJWKSet } from "jose";
import { ChatApp } from "./Chat";
import { ChatInput } from "./ChatInput";
import { Button, TextInput } from "./Inputs";
import type { User, WSHeartbeatObject } from "./types";
import "./index.css";

const token = sessionStorage.getItem("token");
const pubKey = {
  kty: "EC",
  x: "PogwjDupX-K3RGX6WrXCknA62nJK_ns7gDewuB_SBV4",
  y: "saIQgj962I1WCrVRqMYdSIwbCt3ajB9ekfhxfgblFuY",
  crv: "P-256",
};

enum WSReadyState {
  "Not initialized" = -1,
  "CONNECTING" = WebSocket.CONNECTING,
  "OPEN" = WebSocket.OPEN,
  "CLOSED" = WebSocket.CLOSED,
  "CLOSING" = WebSocket.CLOSING,
}

function App() {
  const [webSocket, setWebSocket] = useState<WebSocket>();
  useEffect(() => {
    console.log("WebSocket: " + WSReadyState[webSocket?.readyState || -1]);
  }, [webSocket?.readyState]);
  const [readyState, setReadyState] = useState<number>(-1);
  const [user, setUser] = useState<User>({
    room: "",
    nick: "",
  });

  // useTokenConnect
  useEffect(() => {
    if (token) {
      const verify = async () => {
        const result = await compactVerify(
          token,
          createLocalJWKSet({ keys: [pubKey] })
        );
        const { room, nick } = JSON.parse(
          new TextDecoder().decode(result.payload)
        );
        setUser({ room: room, nick: nick });
      };
      setWebSocket(new WebSocket(`ws://localhost:8080/?token=${token}`));
      verify();
    }
  }, []);

  const isConnected = readyState === webSocket?.OPEN;

  const handleConnect = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (user.nick === "") return;
    else {
      const [room, nick] = [
        encodeURIComponent(user.room),
        encodeURIComponent(user.nick),
      ];
      setWebSocket(
        new WebSocket(`ws://localhost:8080/?room=${room}&nick=${nick}`)
      );
    }
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setUser({ ...user, [evt.target.id]: evt.target.value });

  if (webSocket && webSocket.readyState === webSocket.CONNECTING) {
    const t = setInterval(() => {
      setReadyState(webSocket.readyState);
      if (webSocket.readyState === webSocket.OPEN) {
        clearInterval(t);
      }
    });
  }

  return isConnected && webSocket ? (
    <div
      id="chat"
      className="h-screen max-h-screen flex flex-col font-mono bg-gray-800 text-white"
    >
      <ChatApp ws={webSocket} room={user.room} nick={user.nick} />
      <ChatInput ws={webSocket} nick={user.nick} />
    </div>
  ) : (
    <form action="#" method="POST" onSubmit={handleConnect}>
      <TextInput
        label="Nickname"
        id="nick"
        placeholder="Enter nickname"
        onChange={handleChange}
        value={user.nick}
        size={50}
        required
      />
      <TextInput
        label="Room"
        id="room"
        placeholder="Enter room name (This value is currently ignored)"
        onChange={handleChange}
        value={user.room}
        size={50}
      />
      <Button className="text-lg font-semibold px-2 m-1 rounded-lg bg-indigo-500 hover:bg-indigo-500/80">
        Connect
      </Button>
    </form>
  );
}

export default App;
