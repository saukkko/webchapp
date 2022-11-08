import { ChatUserListProps } from "./types";

export const ChatUserList: React.FC<ChatUserListProps> = ({ users }) => {
	return (
		<div id="user-list" className="w-1/5 px-4 overflow-y-auto">
			<div className="text-xl">Users</div>
			<ul className="list-none">
				{users.map((u, i) => (
					<li key={i}>{u}</li>
				))}
			</ul>
		</div>
	);
}