import React, { useLayoutEffect } from "react";
import { Temporal } from "@js-temporal/polyfill";
import type {
  ChatMessageListProps,
  ChatMessageProps,
  ChatMessageUserProps,
  ChatMessageTimeProps,
} from "./types";

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ chat }) => {
  useLayoutEffect(() => {
    const cl = document.getElementById("message-list");
    if (cl) cl.scrollBy(0, 24);
  }, [chat.chatLog]);

  return (
    <ul id="message-list" className="grow-[2] overflow-y-scroll">
      {chat.chatLog.map((x, i) => (
        <ChatMessage key={i} data={{ username: x.nick, text: x.msg, timestamp: x.timestamp }} />
      ))}
    </ul>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ data, ...props }) => {
  return (
    <li {...props}>
      <ChatTime timestamp={data.timestamp} />
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

const ChatTime: React.FC<ChatMessageTimeProps> = ({ timestamp, ...props }) => {
  const tz = Temporal.Now.timeZone();
  const t = Temporal.Instant.fromEpochSeconds(timestamp);
  const dateTime = t.toZonedDateTimeISO(tz);
  const timeString = dateTime.toPlainTime().toString({ smallestUnit: "minute" })
  return (
    <span className="text-xs
    text-slate-400" {...props}>
      {timeString}&nbsp;
    </span>
  )
}
