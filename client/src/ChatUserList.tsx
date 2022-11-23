import { ChatUserListProps } from "./types";

export const ChatUserList: React.FC<ChatUserListProps> = ({ users }) => {
	return (
		<div id="user-list" className="hidden md:block md:w-1/5 px-4 overflow-y-auto">
			<div className="flex justify-between">
				<div className="text-xl">Users</div>
			</div>

			<ul className="list-none">
				{users.map((u, i) => (
					<li key={i}>{u}</li>
				))}
			</ul>
		</div>
	);
}

