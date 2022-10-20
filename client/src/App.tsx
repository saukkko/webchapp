import React, { useState } from "react";

// viedäänkö huone ja nick tieto esim. kekseissä?
document.cookie = "room=testihuone";
document.cookie = "nick=testinick";

const ws = new WebSocket("ws://localhost:8080/");

function App() {
  const [message, setMessage] = useState("");

  const handleSend = (evt: React.MouseEvent<HTMLInputElement>) =>
    ws.send(message);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(evt.target.value);

  return (
    <div>
      <input type="text" id="message" value={message} onChange={handleChange} />
      <input type="button" id="send" value="send" onClick={handleSend} />
    </div>
  );
}

export default App;
