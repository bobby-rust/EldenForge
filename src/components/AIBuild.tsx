import React from "react";
import { useParams } from "react-router-dom";
import { ItemCategory } from "../types/enums";
import { Item } from "../classes/Item";
import { ArmorCategories } from "../types/constants";
import { AIBuildType, Stat } from "../types/types";
import CardColumn from "./CardColumn";
import BuildGenerator from "../classes/BuildGenerator";

const generator = new BuildGenerator();

export default function AIBuild() {
	const { buildUrl } = useParams();
	const [showDescription, setShowDescription] = React.useState(false);

	if (!buildUrl) {
		throw new Error("Invalid path");
	}

	const [build, setBuild] = React.useState<AIBuildType | null>(generator.parseAIBuildFromUrl(buildUrl));
	const [armors, setArmors] = React.useState<Item[]>([]);
	const [buildType, setBuildType] = React.useState("");

	const handleRegenerateAIBuild = async () => {
		const newUrl = (await generator.generateAIUrl()) ?? "";
		console.log("new url: ", newUrl);
		setBuild(generator.parseAIBuildFromUrl(newUrl));
	};

	const handleChangeBuildType = (e: React.ChangeEvent<HTMLSelectElement>) => {
		console.log("setting build type: ", e.target.value);
		setBuildType(e.target.value);
	};

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

		console.log(build);
	}, [build]);

	React.useEffect(() => {
		generator.buildType = buildType;
	}, [buildType]);

	React.useEffect(() => {}, [armors]);

	return (
		<div className="flex flex-col justify-center items-center xl:px-14 py-8">
			<div className="flex flex-col xl:flex-row justify-evenly w-full items-center mb-10">
				<div className="flex justify-center items-center w-1/3">
					<select className="select select-bordered max-w-xs" onChange={handleChangeBuildType}>
						<option selected value="">
							Select a build type
						</option>
						<option value="Intelligence">Intelligence</option>
						<option value="Faith">Faith</option>
						<option value="Strength">Strength</option>
						<option value="Dexterity">Dexterity</option>
						<option value="Arcane">Arcane</option>
					</select>
				</div>
				<div className="flex justify-center items-center w-1/3">
					<button className="btn btn-lg" onClick={handleRegenerateAIBuild}>
						Ask Sir Gideon Ofnir, The All-Knowing
					</button>
				</div>
				<div className="flex justify-center items-center w-1/3">
					<div className="dropdown">
						<div tabIndex={0} role="button" className="btn btn-lg m-1">
							Show Stats{" "}
						</div>
						<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
							<li>
								<table className="table table-auto table-zebra text-lg">
									<thead>
										<tr className="border-b">
											<th
												className="h-12 text-left relative rounded-t-lg align-middle font-semobold text-xl bg-gray-100 py-1 px-3"
												colSpan={2}
											>
												Stats
											</th>
										</tr>
									</thead>
									<tbody className="border-2 border-gray-100">
										{build &&
											[...Object.keys(build)].map((key: string, i: number) => (
												<tr className="border-b">
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
					<button className="btn btn-lg mr-2" onClick={() => setShowDescription(!showDescription)}>
						Toggle Description
					</button>
				</div>
			</div>
			{build && (
				<div className={`${showDescription ? "animate-fadeIn block" : "animate-fadeOut hidden"} max-w-4xl h-[360px]`}>
					<div className="w-full bg-gray-100 text-center p-2 relative">
						<h1 className="font-bold text-slate-800 text-2xl self-start">{build.name}</h1>
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
					<div className="flex flex-col rounded-lg shadow-lg p-8 h-full">
						<div className="flex flex-col w-full pb-6">
							<div className="flex leading-relaxed">
								<div className="self-start w-1/2 mr-2 text-center text-lg">
									<h1 className="font-semibold">Summary</h1>
									<p>{build.summary}</p>
								</div>
								<div className="self-start w-1/2 ml-2 text-center text-lg h-full">
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
			<div className="flex justify-center items-center">
				<div className={`${showDescription ? "animate-slideDown" : "animate-slideUp"} flex flex-wrap justify-center`}>
					{build &&
						[...build.items.keys()].map((c: ItemCategory, i: number) => (
							<React.Fragment key={i}>
								{/* TODO: fix this garbage ... actually is it garbage, or is it just practicing K.I.S.S.? */}
								{!ArmorCategories.has(c) && <CardColumn key={i} items={build.items.get(c) ?? []} reroll={null} />}
								{c === ItemCategory.Helm && <CardColumn key={i} items={armors} reroll={null} />}
							</React.Fragment>
						))}{" "}
				</div>
			</div>
		</div>
	);
}
