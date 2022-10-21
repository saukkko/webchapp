import type { HTMLAttributes, LiHTMLAttributes } from "react";

declare type ChatWindowProps = HTMLAttributes<HTMLDivElement>;

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

export { ChatWindowProps, ChatMessageListProps, ChatMessageProps, ChatProps };
