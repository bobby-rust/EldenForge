import React from "react";
import { useNavigate } from "react-router-dom";
import BuildGenerator from "../classes/BuildGenerator";

const generator = new BuildGenerator();

export default function AIApp() {
	const navigate = useNavigate();
	React.useEffect(() => {
		const queryAI = async () => {
			const url = await generator.generateAIUrl();
			// console.log(url);
			// navigate(`/ai/${url}`, { replace: true });
			navigate(`/ai/${url}`, { replace: true });
		};

		queryAI();
	}, []);

	return <div>AIApp</div>;
}
