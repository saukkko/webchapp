import React, { useEffect, useRef, useState } from "react";
import { ChatMessageList } from "./ChatMessages";
import { ChatUserList } from "./ChatUserList";
import type {
  ChatAppProps,
  WSMessageObject,
  ChatProps,
  ChatSettings,
  ChatWindowProps,
  WSMessageData,
  WSHeartbeatObject,
} from "./types";

export const ChatApp = (props: ChatAppProps) => {
  const { ws, room, nick } = props;
  const [chat, setChat] = useState<ChatSettings>({
    chatLog: [],
    nick: nick,
    room: room,
    users: [{ nick: nick }],
  });

  const timer = useRef<{ t1: NodeJS.Timer; t2: NodeJS.Timer }>({
    t1: setTimeout(() => null),
    t2: setTimeout(() => null),
  });

  // useHeartbeat
  useEffect(() => {
    const doInterval = () =>
      setInterval(() => {
        const heartBeatObject: WSHeartbeatObject = {
          type: "heartbeat",
        };
        ws.send(JSON.stringify(heartBeatObject));
        console.log("sent heartbeat");
      }, 5000);

    timer.current.t1 = doInterval();
  }, [ws, timer]);

  const doTimeout = () =>
    setTimeout(() => {
      console.log("did not receive ack, stopping heartbeat");
      clearInterval(timer.current.t1);
      sessionStorage.removeItem("token");
    }, 10000);

  ws.onmessage = (evt: MessageEvent<string | ArrayBufferLike>) => {
    const payload: WSMessageObject | WSHeartbeatObject = JSON.parse(
      evt.data.toString()
    );
    if (payload.type === "message")
      setChat({
        ...chat,
        users: payload.users,
        chatLog: [...chat.chatLog, payload.data],
      });

    if (payload.type === "token" && payload.token)
      sessionStorage.setItem("token", payload.token);

    if (payload.type === "ack" && payload.users) {
      console.log("received ack");
      setChat({ ...chat, users: payload.users });
      clearTimeout(timer.current.t2);
      timer.current.t2 = doTimeout();
    }
  };

  /*
  // useSendAck


  useEffect(() => {
    if (!webSocket || !isConnected) return;
    webSocket.onmessage = (evt: MessageEvent<string | ArrayBufferLike>) => {
      const data: WSHeartbeatObject = JSON.parse(evt.data.toString());
      if (data.type === "ack") {
        
      }
    };
  }, [webSocket, isConnected]);

  */

  ws.onclose = (evt: CloseEvent) => {
    const err: WSMessageData = {
      msg: `Connection closed with code: ${evt.code}, reason: ${evt.reason}`,
      nick: "server",
    };
    setChat({
      ...chat,
      chatLog: [...chat.chatLog, err],
    });
    sessionStorage.clear();
  };
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
      chatMessageListProps={{ chat: chat }}
      chatUserListProps={{ users: chat.users }}
    />
  );
};

const Chat: React.FC<ChatProps> = ({ ...props }) => (
  <ChatWindow {...props.chatWindowProps}>
    <ChatMessageList {...props.chatMessageListProps} />
    <ChatUserList {...props.chatUserListProps} />
  </ChatWindow>
);

const ChatWindow: React.FC<ChatWindowProps> = ({ children, ...props }) => (
  <div
    id="chat-window"
    className="w-full p-4 h-full overflow-y-hidden break-words grow flex"
  >
    {children}
  </div>
);
