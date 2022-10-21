import React from "react";
import { ChatMessageListProps, ChatMessageProps } from "./types";

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  chatLog,
}) => {
  return (
    <ul style={{ display: "inline" }}>
      {chatLog.map((x, i) => (
        <ChatMessage key={i} msg={x} />
      ))}
    </ul>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ msg, ...props }) => {
  return <li {...props}>{msg}</li>;
};
