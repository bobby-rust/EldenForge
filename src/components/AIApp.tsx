import React from "react";
import { useNavigate } from "react-router-dom";
import BuildGenerator from "../classes/BuildGenerator";

const generator = new BuildGenerator();

export default function AIApp() {
	const navigate = useNavigate();
	React.useEffect(() => {
		const queryAI = async () => {
			// console.log("Getting AI url...");
			// const url = await generator.generateAIUrl();
			// console.log("url: ", url);
			// navigate(`/ai/${url}`, { replace: true });
			navigate(
				"/ai/&classes=4&helms=29&chests=30&gauntlets=17&legs=16&weapons=249,117&ashes=12&shields=31&talismans=70,60,11,58&spirits=15&sorcs=7,8,10,38&name=Carian%20Knight&summary=Hmm,%20an%20intriguing%20build,%20reminiscent%20of%20the%20mages%20who%20serve%20the%20Carian%20Royal%20Family.%20This%20build%20seems%20to%20prioritize%20the%20art%20of%20sorcery,%20utilizing%20the%20potent%20Carian%20spells%20to%20unleash%20swift%20and%20devastating%20attacks.%20However,%20its%20reliance%20on%20magic%20and%20lighter%20armor%20may%20leave%20its%20wielder%20vulnerable%20to%20close-quarters%20combat%20and%20powerful%20foes.&strengths=This%20build%20has%20immense%20magical%20damage%20capabilities.%20This%20build%20has%20access%20to%20many%20useful%20sorceries%20to%20handle%20various%20situations.&weaknesses=This%20build%20may%20struggle%20with%20close-range%20combat.%20This%20build%20lacks%20the%20survivability%20of%20melee-focused%20builds.&vigor=40&mind=50&endurance=20&strength=16&dexterity=12&intelligence=70&faith=9&arcane=7",
				{ replace: true }
			);
		};

		queryAI();
	}, []);

	return <div>AIApp</div>;
}
