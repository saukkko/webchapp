import React, { useState } from "react";
import { ChatApp } from "./Chat";
import { ChatInput } from "./ChatInput";
import { Button } from "./Inputs";
import "./index.css";

// const ws = new WebSocket("ws://localhost:8080/");

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [webSocket, setWebSocket] = useState<WebSocket>();

  const handleConnect = (evt: React.PointerEvent<HTMLButtonElement>) => {
    setWebSocket(new WebSocket("ws://localhost:8080/"));
    setIsConnected(true);
  };

  return isConnected && webSocket ? (
    <div
      id="chat"
      className="h-screen max-h-screen flex flex-col font-mono bg-gray-800 text-white"
    >
      <ChatApp ws={webSocket} />
      <ChatInput ws={webSocket} />
    </div>
  ) : (
    <Button
      onClick={handleConnect}
      className="text-lg font-semibold px-2 m-1 rounded-lg bg-indigo-500 hover:bg-indigo-500/80"
    >
      Connect
    </Button>
  );
}

export default App;
