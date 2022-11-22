import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
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
      className="bg-slate-700 justify-self-end flex"
    >
      <TextInput
        id="message"
        className="bg-slate-700 w-full"
        value={message}
        onChange={handleChange}
      />
      <Button className="" type="submit" id="send">
        <SendIcon />
      </Button>
    </form>
  );
};

const SendIcon: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-1">
      <FaArrowRight className="h-8 w-8" />
    </div>
  );
};
