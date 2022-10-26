import { useState } from "react";
import { FaArrowRight } from 'react-icons/fa';

export const ChatInput = ({ ws }: { ws: WebSocket }) => {
	const [message, setMessage] = useState("");

	const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
		evt.preventDefault();
		ws.send(message);
		setMessage("");
	}


	const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
		setMessage(evt.target.value);

	return (
		<form onSubmit={handleSubmit} className="bg-slate-700 justify-self-end flex">
			<input type="text" id="message" className="bg-slate-700 w-full" value={message} onChange={handleChange} />
			<button type="submit" id="send" value=""><SendIcon/></button>
		</form>
	);
}

const SendIcon: React.FC = () => {
	return (
	<div className="flex items-center justify-center p-1">
		<FaArrowRight className="h-8 w-8"/>
	</div>
	);
}