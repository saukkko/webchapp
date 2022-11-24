import React, { useLayoutEffect } from "react";
import type {
  ChatMessageListProps,
  ChatMessageProps,
  ChatMessageUserProps,
} from "./types";

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ chat }) => {
  useLayoutEffect(() => {
    const cl = document.getElementById("message-list");
    if (cl) cl.scrollBy(0, 24);
  }, [chat.chatLog]);

  return (
    <ul id="message-list" className="grow-[2] overflow-y-scroll">
      {chat.chatLog.map((x, i) => (
        <ChatMessage key={i} data={{ username: x.nick, text: x.msg }} />
      ))}
    </ul>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ data, ...props }) => {
  return (
    <li {...props}>
      <ChatUser username={data.username} />
      {data.text}
    </li>
  );
};

const ChatUser: React.FC<ChatMessageUserProps> = ({ username, ...props }) => {
  return (
    <span className="text-secondary" {...props}>
      &lt;{username}&gt;&nbsp;
    </span>
  );
};
