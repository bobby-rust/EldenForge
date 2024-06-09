import React from "react";
import AIGenerator from "../classes/AIGenerator";
const aiGenerator = new AIGenerator();

console.log(aiGenerator);
export default function AIBuild() {
	aiGenerator.WHAT();
	React.useEffect(() => {
		const run = async () => {
			await aiGenerator.generateAIBuild();
		};

		run();
	}, []);
	return <div>AIBuild</div>;
}
