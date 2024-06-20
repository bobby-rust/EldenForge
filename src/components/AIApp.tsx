import React from "react";
import { useNavigate } from "react-router-dom";
import BuildGenerator from "../classes/BuildGenerator";
import { IoArrowBackSharp } from "react-icons/io5";
import { quotes } from "../types/constants";

const quote = quotes[Math.floor(Math.random() * quotes.length)];
console.log(quotes);
console.log(quote);
const generator = new BuildGenerator();

export default function AIApp() {
	const navigate = useNavigate();
	React.useEffect(() => {
		const queryAI = async () => {
			// const url = await generator.generateAIUrl();
			// navigate(`/ai/${url}`, { replace: true });
		};

		queryAI();
	}, []);

	return (
		<div className="overflow-y-hidden lg:px-14 py-8">
			<div className="flex flex-col items-center justify-center gap-6 h-[70vh] animate-landing-slide-up">
				<h1 className="md:text-2xl 2xl:text-5xl font-bold text-center">Asking Gideon for a build...</h1>
				<div className="loading loading-spinner xl:h-12 xl:w-12"></div>
				<blockquote className="md:text-xl 2xl:text-3xl italic text-gray-600 text-center w-[50vw]">
					"{quote[0]}"<br></br>- {quote[1]}{" "}
				</blockquote>
				<button className="btn lg:btn-lg btn-ghost" onClick={() => navigate("/")}>
					<IoArrowBackSharp />
					Random Builds
				</button>
			</div>
		</div>
	);
}
