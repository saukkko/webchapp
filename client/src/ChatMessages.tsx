import React, { useLayoutEffect } from "react";
import { ChatMessageListProps, ChatMessageProps, ChatMessageUserProps } from "./types";

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  chatLog,
}) => {

  useLayoutEffect(() => {
    const cl = document.getElementById("message-list");
    if (cl) cl.scrollBy(0, 24);
  }, [chatLog]);

  return (
    <ul id="message-list" className="grow-[2] overflow-y-scroll">
      {chatLog.map((x, i) => (
        <ChatMessage key={i} msg={{username: "test", text: x}} />
      ))}
    </ul>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ msg, ...props }) => {
  return <li {...props}><ChatUser username={msg.username}/>{msg.text}</li>;
};

const ChatUser: React.FC<ChatMessageUserProps> = ({username, ...props}) => {
  return (
    <span className="text-orange-300">
      &lt;{username}&gt;&nbsp;
    </span>
  );
}