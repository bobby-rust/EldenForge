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
		<div className="flex justify-center p-10 h-[80vh]">
			<div className="flex flex-col items-center justify-center gap-10">
				<h1 className="text-2xl 4xl:text-4xl">Asking Gideon for a build...</h1>
				<div className="loading loading-spinner h-12 w-12"></div>
			</div>
		</div>
	);
}
