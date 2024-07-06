/**
 * AI build generator page.
 *
 * This page utilizes Google Gemini to generate an AI build.
 * It uses the `BuildGenerator` class to generate a build based on the
 * parameters entered by the user or randomly selected parameters if the user does not specify.
 *
 * @todo Patch AI spam exploit
 */

import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BuildGenerator from "../classes/BuildGenerator";
import { IoArrowBackSharp } from "react-icons/io5";
import { quotes } from "../types/constants";
import { ItemCategory } from "../types/enums";
import { Item } from "../classes/Item";
import { ArmorCategories } from "../types/constants";
import { AIBuildType } from "../types/types";
import CardColumn from "./CardColumn";
import { toast } from "sonner";
import { IoCopyOutline } from "react-icons/io5";
import { LuCopyCheck } from "react-icons/lu";
import { ToastMessage } from "./ToastMessage";
import { Button } from "./ui/button";

const generator = new BuildGenerator();

const AI_COOLDOWN = 30; // The number of seconds a user has to wait between AI generations.

/**
 * A random quote is rendered when there is no current build while the AI request is made.
 */
const quote = quotes[Math.floor(Math.random() * quotes.length)];

/**
 * A function that renders a message when the link is copied.
 *
 * @return {JSX.Element} The message to be rendered.
 */
const CopiedMessage = (): JSX.Element => {
	return (
		<div className="flex justify-between w-full items-center">
			<div className="flex flex-col justify-center">
				<h1 className="font-semibold">Copied!</h1>
				<p>Link copied to clipboard</p>
			</div>
			<button className="btn" onClick={() => toast.dismiss()}>
				Okay
			</button>
		</div>
	);
};

/**
 * Renders the AI component, which generates and displays an AI build.
 *
 * @return {JSX.Element} The rendered AIApp component.
 */
export default function AI(): JSX.Element {
	// State initialization
	const [buildUrl, _] = useSearchParams();
	const [showDescription, setShowDescription] = React.useState<boolean>(false); // TODO: animate this
	const [loading, setLoading] = React.useState<boolean>(false);
	const [countdown, setCountdown] = React.useState<number>(AI_COOLDOWN); // Prevents the AI from being spammed
	const [disabled, setDisabled] = React.useState<boolean>(true); // The AI request button is disabled until the countdown reaches 0
	const [width, setWidth] = React.useState<number>(window.innerWidth);
	const [copied, setCopied] = React.useState<boolean>(false);
	const [hintShowed, setHintShowed] = React.useState<boolean>(false);
	const [build, setBuild] = React.useState<AIBuildType | null>(
		generator.parseAIBuildFromUrl(decodeURIComponent(buildUrl.toString().replaceAll("+", " ")))
	);
	const [armors, setArmors] = React.useState<Item[]>([]);
	const [buildType, setBuildType] = React.useState<string>("");

	// Helper functions
	const navigate = useNavigate();

	/**
	 * Copies the link to the current build to the clipboard.
	 */
	const copyUrl = () => {
		navigator.clipboard.writeText(window.location.href);
		setCopied(true);
		toast(<CopiedMessage />);
	};

	/**
	 * Acknowledges that the user has seen the hint message.
	 */
	const handleAcknowledgeHint = () => {
		toast.dismiss();
		localStorage.setItem("acknowledged-hint", "true");
	};

	/**
	 * Shows the hint message if the user has not seen it before.
	 */
	const showHint = () => {
		if (localStorage.getItem("acknowledged-hint") === "true" || hintShowed) {
			return;
		}
		toast(
			<ToastMessage
				title="Hint"
				message="Try selecting a build type at the top for a better result."
				buttons={
					<Button className="" onClick={handleAcknowledgeHint}>
						Got it
					</Button>
				}
			/>
		);
		setHintShowed(true);
	};

	/**
	 * Generates a new AI build.
	 */
	const handleRegenerateAIBuild = async () => {
		setLoading(true);

		// The abort controller cancels async requests that are not complete via a signal
		// TODO: finish implementing cancellation
		const abortController = new AbortController();
		const signal = abortController.signal;

		const newUrl = (await generator.generateAIUrl(signal)) ?? "";

		// If the user leaves the AI page before the request completes, return so they are not navigated to the build
		const regex = /\/ai\/(.*)/;
		if (!regex.test(window.location.pathname)) {
			return;
		}

		// The generateAIUrl function returns an empty string if there was an error. We assume it's because the server is busy.
		if (newUrl === "") {
			toast.error("The server is busy. Wait 60 seconds and try again.");
			setCountdown(60);
			setLoading(false);
			return;
		}

		/**
		 * Parse the build from the new URL and update the build state.
		 */
		const newBuild = generator.parseAIBuildFromUrl(newUrl);
		newBuild.summary = decodeURIComponent(newBuild.summary);

		setBuild(newBuild);

		// Reset the countdown and disable the button, then update the url to reflect the new build
		setLoading(false);
		setDisabled(true);
		setCountdown(30);
		navigate("/ai/" + newUrl);
	};

	/**
	 * Handles the change event of the build type select element.
	 * Updates the build type state with the selected value.
	 *
	 * @param {React.ChangeEvent<HTMLSelectElement>} e - The event object.
	 * @return {void}
	 */
	const handleChangeBuildType = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		setBuildType(e.target.value);
	};

	// Effects

	/**
	 * Updates the countdown state each second and sets the disabled state to false when the countdown reaches 0.
	 * Clears the timeout when the component unmounts.
	 *
	 * @return {void}
	 */
	React.useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		} else {
			setDisabled(false);
		}
	}, [countdown]);

	/**
	 * Updates the armors state with the items in the build that are part of the armor categories.
	 *
	 * @return {void}
	 */
	React.useEffect(() => {
		if (build) {
			const newArmors: Item[] = [];
			[...build.items.keys()].forEach((c: ItemCategory) => {
				if (ArmorCategories.has(c)) {
					newArmors.push(...(build.items.get(c) ?? []));
				}
			});
			setArmors(newArmors);
		}
	}, [build]);

	/**
	 * Updates the build state whenever the buildUrl changes.
	 *
	 * @return {void}
	 */
	React.useEffect(() => {
		setBuild(generator.parseAIBuildFromUrl(decodeURIComponent(buildUrl.toString().replaceAll("+", " "))));
	}, [buildUrl]);

	/**
	 * Syncs the generator's buildType state with the component's buildType state changes.
	 */
	React.useEffect(() => {
		generator.buildType = buildType;
	}, [buildType]);

	/**
	 * Updates the width state whenever the window is resized and cleans up the event listener when the component unmounts.
	 *
	 * @return {void}
	 */
	React.useEffect(() => {
		function handleResize() {
			setWidth(window.innerWidth);
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	/**
	 * Clears the copied state after a delay of 4 seconds.
	 *
	 * @return {void}
	 */
	React.useEffect(() => {
		const timer = setTimeout(() => {
			setCopied(false);
		}, 4000);

		return () => clearInterval(timer);
	}, [copied]);

	/**
	 * Queries the AI and navigates to the generated AI URL if the current pathname is "/ai".
	 *
	 * @return {Promise<void>} A Promise that resolves when the navigation is complete.
	 */
	React.useEffect(() => {
		const queryAI = async () => {
			// See the handleRegenerateBuild comment for why this is here
			const abortController = new AbortController();
			const signal = abortController.signal;

			const newUrl = await generator.generateAIUrl(signal);

			// Cancel the navigation if the user leaves the page before the request completes
			if (window.location.pathname !== "/ai") {
				return;
			}

			navigate(`/ai/${newUrl}`);
			showHint();
			setShowDescription(true);
		};

		// if (window.location.search === "") queryAI();
	}, []);

	return (
		<div className="flex flex-col justify-center items-center xl:px-14 py-8">
			{/* ----- Loading state ----- */}
			{window.location.search === "" && (
				<div className="overflow-y-hidden lg:px-14 pt-8">
					<div className="flex flex-col items-center justify-center gap-10 animate-landing-slide-up h-[72vh]">
						<h1 className="md:text-2xl 2xl:text-5xl font-bold text-center">Asking Gideon for a build...</h1>
						<div className="loading loading-spinner xl:h-12 xl:w-12"></div>
						<blockquote className="md:text-xl 2xl:text-3xl italic text-gray-600 text-center w-[50vw] tracking-wide">
							"{quote[0]}"<br />- {quote[1]}{" "}
						</blockquote>
						<button className="btn lg:btn-lg btn-ghost" onClick={() => navigate("/")}>
							<IoArrowBackSharp />
							Random Builds
						</button>
					</div>
				</div>
			)}

			{/* ----- Top menu buttons and AI build stats ----- */}
			{!(window.location.search === "") && (
				<div className="flex flex-col items-center 2xl:flex-row justify-evenly w-full mb-10">
					<div className="flex justify-center items-center w-64 sm:w-80 2xl:w-1/3">
						<select className="select select-bordered max-w-xs w-full" onChange={handleChangeBuildType}>
							<option selected value="">
								Select a build type
							</option>
							<option value="Intelligence">Intelligence</option>
							<option value="Faith">Faith</option>
							<option value="Strength">Strength</option>
							<option value="Dexterity">Dexterity</option>
							<option value="Arcane">Arcane</option>
							<option value="Physical Damage">Physical Damage</option>
							<option value="Magic Damage">Magic Damage</option>
							<option value="Holy Damage">Holy Damage</option>
							<option value="Fire Damage">Fire Damage</option>
							<option value="Lightning Damage">Lightning Damage</option>
						</select>
					</div>
					<div className="flex justify-center items-center lg:w-1/3 p-6 lg:p-3">
						<button
							className={`btn btn-lg btn-primary ${loading && "loading loading-dots"} w-72 sm:w-80 xl:w-auto`}
							disabled={disabled}
							onClick={handleRegenerateAIBuild}
							aria-disabled={disabled}
							tabIndex={disabled ? -1 : 0}
						>
							<span className="text-sm xl:text-lg">
								{disabled
									? `Wait ${countdown}s...`
									: width < 400
									? "Ask Gideon"
									: "Ask Sir Gideon Ofnir, The All-Knowing"}
							</span>
						</button>
					</div>
					<div className="flex flex-col lg:flex-row justify-center items-center w-80 2xl:w-1/3 gap-5">
						<div>
							<button onClick={copyUrl} className="btn btn-lg w-72 sm:w-80 lg:w-44 xl:w-44 text-sm 3xl:text-md">
								{copied ? <LuCopyCheck /> : <IoCopyOutline />}
								Copy Build URL
							</button>
						</div>
						<div className="dropdown">
							<div
								tabIndex={0}
								role="button"
								className="btn btn-lg w-64 sm:w-80 text-sm 3xl:text-md lg:w-40 xl:w-44 m-3"
							>
								Show Stats{" "}
							</div>
							<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
								<li>
									<table className="table table-auto table-zebra text-lg">
										<thead>
											<tr className="border-b">
												<th
													className="h-12 text-left relative rounded-t-lg align-middle text-sm lg:text-lg xl:text-xl bg-gray-100 py-1 px-3"
													colSpan={2}
												>
													Stats
												</th>
											</tr>
										</thead>
										<tbody className="border-2 border-gray-100">
											{build &&
												[...Object.keys(build)].map((key: string, i: number) => (
													<tr className="border-b" key={i}>
														{!["name", "summary", "strengths", "weaknesses", "items"].includes(key) && (
															<>
																<td className="p-4 align-middle font-medium py-2 px-3 ">
																	{key[0].toUpperCase() + key.slice(1)}
																</td>
																<td className="p-4 align-middle text-right py-2 px-3">{build[key]}</td>
															</>
														)}
													</tr>
												))}
										</tbody>
									</table>
								</li>
							</ul>
						</div>
						<div>
							<button
								className="btn btn-lg w-64 sm:w-80 lg:w-44 xl:w-44 text-sm 3xl:text-md"
								onClick={() => setShowDescription(!showDescription)}
							>
								Show Description
							</button>
						</div>
					</div>
				</div>
			)}

			{/* ----- The AI's build name and description ----- */}
			{build && (
				<div className={`max-w-[85vw] 2xl:max-w-[60vw] mb-20 ${showDescription ? "" : "hidden"}`}>
					<div className="w-full bg-gray-100 text-center p-2 relative">
						<h1 className="font-bold text-slate-800 sm:text-2xl self-start px-8">{build.name}</h1>
						<button
							className="btn btn-sm btn-square absolute right-1.5 top-1.5"
							onClick={() => setShowDescription(false)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					<div className="flex justify-center items-center rounded-lg shadow-lg p-8 h-full">
						<div className="flex w-full justify-center items-center pb-6">
							<div className="flex flex-col sm:flex-row leading-relaxed justify-center items-center">
								<div className="sm:w-1/2 mr-2 text-center sm:text-lg">
									<h1 className="font-semibold">Summary</h1>
									<p>{build.summary}</p>
								</div>
								<div className="sm:w-1/2 ml-2 text-center sm:text-lg h-full">
									<div className="w-full">
										<h1 className="font-semibold">Strengths</h1>
										<p>{build.strengths}</p>
									</div>
									<div className="w-full">
										<h1 className="font-semibold">Weaknesses</h1>
										<p>{build.weaknesses}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* ----- item grid ----- */}
			<div className="grid grid-cols-1 sm:grid-cols-2 2lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 2.5xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 gap-4 auto-cols-auto">
				{build &&
					[...build.items.keys()].map((c: ItemCategory, i: number) => (
						<React.Fragment key={i}>
							{!ArmorCategories.has(c) && (
								<CardColumn
									key={i}
									items={build.items.get(c) ?? []}
									reroll={null}
									setNumItems={null}
									isAIBuild={true}
									category={c}
									regenerateCategory={null}
								/>
							)}
							{c === ItemCategory.Helm && (
								<CardColumn
									key={i}
									items={armors}
									reroll={null}
									setNumItems={null}
									isAIBuild={true}
									category={c}
									regenerateCategory={null}
								/>
							)}
						</React.Fragment>
					))}{" "}
			</div>
		</div>
	);
}
