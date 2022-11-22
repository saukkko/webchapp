import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  LiHTMLAttributes,
} from "react";

declare type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

declare type ChatWindowProps = HTMLAttributes<HTMLDivElement>;

declare type ChatUsers = {
  nick: string;
};

declare type ChatUserListProps = HTMLAttributes<HTMLUListElement> & {
  users: ChatUsers[];
};

declare type ChatMessageListProps = HTMLAttributes<HTMLUListElement> & {
  chat: ChatSettings;
};
declare type ChatMessageProps = LiHTMLAttributes<HTMLLIElement> & {
  data: { username: string; text: string };
};
declare type ChatMessageUserProps = LiHTMLAttributes<HTMLLIElement> & {
  username: string;
};

declare type ChatProps = {
  chatWindowProps: ChatWindowProps;
  chatMessageListProps: ChatMessageListProps;
  chatUserListProps: ChatUserListProps;
};

declare type ChatAppProps = User & {
  ws: WebSocket;
};

declare type ChatSettings = {
  chatLog: WSMessageData[];
  nick: string;
  room: string;
  users: ChatUsers[];
};

declare type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

declare type WSMessageObject = {
  type: WSMessageType;
  token?: string;
  timestamp: number;
  users: ChatUsers[];
  data: WSMessageData;
};

declare type WSHeartbeatObject = {
  type: "heartbeat" | "ack";
  users?: ChatUsers[];
};

type WSMessageType = "message" | "token" | "update";
type WSData = WSMessageData;

declare type WSMessageData = {
  nick: string;
  msg: string;
};

declare type User = {
  room: string;
  nick: string;
};

export type {
  User,
  ButtonProps,
  ChatWindowProps,
  ChatUsers,
  ChatUserListProps,
  ChatMessageListProps,
  ChatMessageProps,
  ChatMessageUserProps,
  ChatProps,
  ChatAppProps,
  ChatSettings,
  WSMessageObject,
  WSHeartbeatObject,
  WSMessageData,
  InputProps,
};
