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
    // ei toimi chromium selaimilla tämä scrollbar, pitäiskö se tyylittää vaan ite?
    <ul id="message-list" className="w-4/5 overflow-y-scroll scrollbar-thin">
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
    <span className="text-orange-300" {...props}>
      &lt;{username}&gt;&nbsp;
    </span>
  );
};
