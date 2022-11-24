import React, { useEffect, useState } from "react";
import { compactVerify, createLocalJWKSet } from "jose";
import { ChatApp } from "./Chat";
import { ChatInput } from "./ChatInput";
import { Button, TextInput } from "./Inputs";
import type { User } from "./types";
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
      className="h-screen
      flex flex-col
      font-mono
      bg-primary text-white"
    >
      <ChatApp ws={webSocket} room={user.room} nick={user.nick} />
      <ChatInput ws={webSocket} nick={user.nick} />
    </div>
  ) : (
    <div id="join"
      className=" h-screen
      grid place-content-center
      font-mono
      bg-primary">
      <h1 className="place-self-center p-4
      text-4xl
      text-white">
        WebChApp</h1>
      <form
        className="flex flex-col
        rounded-lg
        bg-primary-light"
        action="#" method="POST" onSubmit={handleConnect}>
        <TextInput
          label="Nickname"
          id="nick"
          className="w-full
          rounded-md overflow-hidden
          bg-primary-highlight text-white"
          placeholder="Enter nickname"
          onChange={handleChange}
          value={user.nick}
          size={50}
          maxLength={50}
          required
        />
        <TextInput
          label="Room"
          id="room"
          className="w-full
          rounded-md overflow-hidden
          bg-primary-highlight text-white"
          placeholder="Enter room name (This value is currently ignored)"
          onChange={handleChange}
          value={user.room}
          size={50}
          maxLength={50}
        />
        <Button className="px-2 m-1 rounded-lg
        text-lg font-semibold
        text-primary bg-secondary hover:bg-secondary-light">
          Connect
        </Button>
      </form>
    </div>

  );
}

export default App;
