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
			// navigate(
			// 	`/ai/&classes=9&helms=122&chests=199&gauntlets=50&legs=10&weapons=206,210&ashes=10,89&seals=3&incants=20,0&tears=5,14&spirits=9`,
			// 	{ replace: true }
			// );
		};

		queryAI();
	}, []);

	return <div>AIApp</div>;
}
