import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  LiHTMLAttributes,
} from "react";

declare type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

declare type ChatWindowProps = HTMLAttributes<HTMLDivElement>;

declare type ChatUserListProps = HTMLAttributes<HTMLUListElement> & {
  users: string[];
};

declare type ChatMessageListProps = HTMLAttributes<HTMLUListElement> & {
  chatLog: string[];
};
declare type ChatMessageProps = LiHTMLAttributes<HTMLLIElement> & {
  msg: { username: string; text: string };
};
declare type ChatMessageUserProps = LiHTMLAttributes<HTMLLIElement> & {
  username: string;
};

declare type ChatProps = {
  chatWindowProps: ChatWindowProps;
  chatMessageListProps: ChatMessageListProps;
};

export {
  ChatWindowProps,
  ChatUserListProps,
  ChatMessageListProps,
  ChatMessageProps,
  ChatMessageUserProps,
  ChatProps,
};
