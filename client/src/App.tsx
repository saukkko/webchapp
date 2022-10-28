import React from "react";
import { ChatApp } from "./Chat";
import { ChatInput } from "./ChatInput";
import "./index.css";

// viedäänkö huone ja nick tieto esim. kekseissä?
document.cookie = "room=testihuone";
document.cookie = "nick=testinick";

const ws = new WebSocket("ws://localhost:8080/");

function App() {
  return (
    <div
      id="chat"
      className="h-screen max-h-screen flex flex-col font-mono bg-gray-800 text-white"
    >
      <ChatApp ws={ws} />
      <ChatInput ws={ws} />
    </div>
  );
}

export default App;
