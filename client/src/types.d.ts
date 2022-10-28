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
  msg: string;
};
declare type ChatProps = {
  chatWindowProps: ChatWindowProps;
  chatMessageListProps: ChatMessageListProps;
};

declare type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export {
  ButtonProps,
  ChatWindowProps,
  ChatUserListProps,
  ChatMessageListProps,
  ChatMessageProps,
  ChatProps,
  InputProps,
};
