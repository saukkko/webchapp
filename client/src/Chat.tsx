import React, {  useState } from "react";
import { ChatMessageList } from "./ChatMessages";
import { ChatUserList } from "./ChatUserList";
import type { ChatProps, ChatWindowProps } from "./types";

export const ChatApp = ({ ws }: { ws: WebSocket }) => {
  const [chat, setChat] = useState<{ log: string[] }>({ log: [] });

  ws.onmessage = (evt: MessageEvent<string | ArrayBufferLike>) =>
    setChat({ log: [...chat.log, evt.data.toString()] });

  return (
    <Chat
      chatWindowProps={{
        // TODO: replace inline styles with style library
        style: {
          width: "800px",
          height: "240px",
          overflow: "scroll",
          overflowX: "hidden",
          fontFamily: "monospace",
          border: "1px solid black",
        },
      }}
      chatMessageListProps={{ chatLog: chat.log }}
    />
  );
};

const Chat: React.FC<ChatProps> = ({ ...props }) => (
	<ChatWindow {...props.chatWindowProps}>
		<ChatMessageList {...props.chatMessageListProps} />
		<ChatUserList users={["testi", "testi2"]} />
	</ChatWindow>
);

const ChatWindow: React.FC<ChatWindowProps> = ({ children, ...props }) => (
	<div id="chat-window" className="w-full p-4 h-full overflow-y-hidden break-words grow flex">{children}</div>

);
