import React from "react";
import { useNavigate } from "react-router-dom";
import BuildGenerator from "../classes/BuildGenerator";

const generator = new BuildGenerator();

export default function AIApp() {
	const navigate = useNavigate();
	React.useEffect(() => {
		const queryAI = async () => {
			const url = await generator.generateAIUrl();
			navigate(`/ai/${url}`, { replace: true });
		};

		queryAI();
	}, []);

	return (
		<div className="flex flex-col items-center justify-center align-center p-10">
			{/* <h1 className="text-2xl">Asking Gideon for a build...</h1>
			<div className="loading loading-dots h-32 w-32"></div> */}
			<h1 className="text-2xl">Sorry! This isn't working right now. A fix is currently being investigated.</h1>
		</div>
	);
}
