import React from "react";
import { useNavigate } from "react-router-dom";
import BuildGenerator from "../classes/BuildGenerator";
import { IoArrowBackSharp } from "react-icons/io5";
import { quotes } from "../types/constants";

const generator = new BuildGenerator();
const quote = quotes[Math.floor(Math.random() * quotes.length)];

export default function AIApp() {
	const navigate = useNavigate();
	React.useEffect(() => {
		const queryAI = async () => {
			// const url = await generator.generateAIUrl();
			// navigate(`/ai/${url}`, { replace: true });
			// window.location.reload();
		};

		queryAI();
	}, []);

	return (
		<div className="overflow-y-hidden lg:px-14 pt-8">
			<div className="flex flex-col items-center justify-center gap-10 h-[80vh] animate-landing-slide-up">
				<h1 className="md:text-2xl 2xl:text-5xl font-bold text-center">
					Asking Gideon for a build...
				</h1>
				<div className="loading loading-spinner xl:h-12 xl:w-12"></div>
				<blockquote className="md:text-xl 2xl:text-3xl italic text-gray-600 text-center w-[50vw] tracking-wide">
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
