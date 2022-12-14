import type { ChatUserListProps } from "./types";

export const ChatUserList: React.FC<ChatUserListProps> = ({ users }) => {
  return users ? (
    <div
      id="user-list"
      className="hidden md:block md:w-1/5 px-4 overflow-y-auto"
    >
      <div className="text-xl">Users</div>
      <ul className="list-none">
        {users.map((u, i) => (
          <li key={i}>{u.nick}</li>
        ))}
      </ul>
    </div>
  ) : (
    <></>
  );
};
