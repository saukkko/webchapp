import React, { useState } from "react";
const ws = new WebSocket("ws://localhost:8080/");

function App() {
  const [text, setText] = useState("");

  const handleSend = (evt: React.MouseEvent<HTMLInputElement>) => ws.send(text);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setText(evt.target.value);

  return (
    <div>
      <input type="text" id="message" value={text} onChange={handleChange} />
      <input type="button" id="send" value="send" onClick={handleSend} />
    </div>
  );
}

export default App;
