import { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { Button, TextInput } from "./Inputs";

export const ChatInput = ({ ws, nick }: { ws: WebSocket; nick: string }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    ws.send(
      JSON.stringify({ type: "message", data: { nick: nick, msg: message } })
    );
    setMessage("");
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(evt.target.value);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-700 flex"
    >
      <TextInput
        id="message"
        className="bg-slate-700 w-full input-form"
        value={message}
        onChange={handleChange}
      />
      <button type="submit" id="send" value="">
        <div className="flex items-center justify-center p-1">
          <AiOutlineRight className="h-8 w-8" />
        </div>
      </button>
    </form>
  );
};
