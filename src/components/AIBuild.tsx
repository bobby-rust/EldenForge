import React from "react";
import { useParams } from "react-router-dom";
import { ItemCategory } from "../types/enums";
import { Item } from "../classes/Item";
import { ArmorCategories } from "../types/constants";
import { AIBuildType } from "../types/types";
import CardColumn from "./CardColumn";
import BuildGenerator from "../classes/BuildGenerator";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IoCopyOutline } from "react-icons/io5";
import { LuCopyCheck } from "react-icons/lu";

const generator = new BuildGenerator();

const ToastMessage = () => {
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

// TODO: Make a reusable build component.
export default function AIBuild() {
	const { buildUrl } = useParams();
	const [showDescription, setShowDescription] = React.useState(true);
	const [loading, setLoading] = React.useState(false);
	const [countdown, setCountdown] = React.useState(30);
	const [disabled, setDisabled] = React.useState(true);
	const [width, setWidth] = React.useState(window.innerWidth);
	const [copied, setCopied] = React.useState(false);
	const copyUrl = () => {
		const textToCopy = window.location.href;
		navigator.clipboard.writeText(textToCopy);
		setCopied(true);
		toast(<ToastMessage />);
	};

	React.useEffect(() => {
		const timer = setTimeout(() => {
			setCopied(false);
		}, 4000);

		return () => clearInterval(timer);
	}, [copied]);
	if (!buildUrl) {
		throw new Error("Invalid path");
	}

	const [build, setBuild] = React.useState<AIBuildType | null>(generator.parseAIBuildFromUrl(buildUrl));
	const [armors, setArmors] = React.useState<Item[]>([]);
	const [buildType, setBuildType] = React.useState("");

	const navigate = useNavigate();

	const handleRegenerateAIBuild = async () => {
		setLoading(true);
		const newUrl = (await generator.generateAIUrl()) ?? "";
		const newBuild = generator.parseAIBuildFromUrl(newUrl);
		newBuild.summary = decodeURIComponent(newBuild.summary);

		setBuild(newBuild);
		setLoading(false);
		setDisabled(true);
		setCountdown(30);
		navigate("/ai/" + newUrl);
	};

	const handleChangeBuildType = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setBuildType(e.target.value);
	};

	React.useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		} else {
			setDisabled(false);
		}
	}, [countdown]);

	React.useEffect(() => {
		if (build) {
			const newArmors: Item[] = [];
			[...build.items.keys()].forEach((c: ItemCategory) => {
				if (ArmorCategories.has(c) && build.items.get(c)) {
					newArmors.push(...(build.items.get(c) ?? []));
				}
			});
			setArmors(newArmors);
		}
	}, [build]);

	React.useEffect(() => {
		generator.buildType = buildType;
	}, [buildType]);

	React.useEffect(() => {
		function handleResize() {
			setWidth(window.innerWidth);
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="flex flex-col justify-center items-center xl:px-14 py-8 ">
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
						<option value="Strike Damage">Strike Damage</option>
						<option value="Slash Damage">Slash Damage</option>
						<option value="Pierce Damage">Pierce Damage</option>
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
						<div tabIndex={0} role="button" className="btn btn-lg w-64 sm:w-80 text-sm 3xl:text-md lg:w-40 xl:w-44 m-3">
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
					<div className="">
						<button
							className="btn btn-lg w-64 sm:w-80 lg:w-44 xl:w-44 text-sm 3xl:text-md"
							onClick={() => setShowDescription(!showDescription)}
						>
							Show Description
						</button>
					</div>
				</div>
			</div>
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
			<div className="grid grid-cols-1 sm:grid-cols-2 2lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 2.5xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 gap-4 auto-cols-auto">
				{build &&
					[...build.items.keys()].map((c: ItemCategory, i: number) => (
						<React.Fragment key={i}>
							{/* TODO: fix this garbage ... actually is it garbage, or is it just practicing K.I.S.S.? */}
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
