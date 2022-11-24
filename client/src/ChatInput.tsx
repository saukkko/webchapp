import { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { TextInput } from "./Inputs";
import { InputUserProps } from "./types";

export const ChatInput = ({ ws, nick }: { ws: WebSocket; nick: string }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (message.trim().length > 0) {
      ws.send(
        JSON.stringify({ type: "message", data: { nick: nick, msg: message } })
      );
      setMessage("");
    }
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(evt.target.value);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex border-2 rounded-lg
      bg-secondary border-primary-highlight"
    >
      <ChatUser nick={nick} />
      <TextInput
        id="message"
        className="w-full
        border-none rounded-md
        md:placeholder-opacity-0
        focus:outline-none focus:ring-0
        bg-primary-light focus:bg-primary-highlight placeholder-primary-highlight"
        placeholder={nick}
        value={message}
        onChange={handleChange}
      />
      <button type="submit" id="send" value="">
        <div className="flex items-center justify-center p-1">
          <AiOutlineRight className="h-8 w-8 text-primary" />
        </div>
      </button>
    </form>
  );
};

const ChatUser: React.FC<InputUserProps> = ({ nick, ...props }) => {
  return (
    <div className="items-center justify-center p-2 hidden md:block">
      <div className="text-primary font-bold">
        &lt;{nick}&gt;
      </div>
    </div>

  );
};
