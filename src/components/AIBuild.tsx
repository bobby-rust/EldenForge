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
	console.log("build url: ", buildUrl);
	if (!buildUrl) {
		throw new Error("Invalid path");
	}

	const [build, setBuild] = React.useState<AIBuildType | null>(generator.parseAIBuildFromUrl(buildUrl));
	const [armors, setArmors] = React.useState<Item[]>([]);
	const [buildType, setBuildType] = React.useState("");

	const handleRegenerateAIBuild = async () => {
		return;
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
		<div className="flex flex-col justify-center items-center px-14 py-8">
			<div className="flex justify-evenly w-full items-center">
				<div className="flex justify-center items-center w-1/3">
					<select className="select select-bordered max-w-xs" onChange={handleChangeBuildType}>
						<option selected>Select a build type</option>
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
					<button className="btn btn-lg mr-2">View Description</button>
					<button className="btn btn-lg ml-2">View Stats</button>
				</div>
			</div>
			{build && (
				<div className="flex mt-10 mb-20 justify-evenly">
					<div className="flex flex-col items-center rounded-lg shadow-lg">
						<div className="w-full bg-gray-100 text-center p-2">
							<h1 className="font-bold text-2xl self-start">{build.name}</h1>
						</div>
						<div className="flex flex-col justify-center items-center w-full pb-6">
							<div className="flex">
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
					<div className="px-3">
						<table className="table table-auto table-zebra">
							<thead>
								<tr className="border-b">
									<th
										className="h-12 text-left rounded-t-lg align-middle font-semobold text-lg bg-gray-100 py-2 px-3"
										colSpan={2}
									>
										Stats
									</th>
								</tr>
							</thead>
							<tbody className="border-2 border-gray-100">
								{[...Object.keys(build)].map((key: string, i: number) => (
									<tr className="border-b">
										{!["name", "summary", "strengths", "weaknesses", "items"].includes(key) && (
											<>
												<td className="p-4 align-middle font-medium py-2 px-3 ">
													{key[0].toUpperCase() + key.slice(1)}
												</td>
												<td className="p-4 align-middle text-right py-2 px-3">{build[key]}</td>
											</>
										)}{" "}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
			<div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
				{build &&
					[...build.items.keys()].map((c: ItemCategory, i: number) => (
						<React.Fragment key={i}>
							{/* TODO: fix this garbage */}
							{!ArmorCategories.has(c) && <CardColumn key={i} items={build.items.get(c) ?? []} reroll={null} />}
							{c === ItemCategory.Helm && <CardColumn key={i} items={armors} reroll={null} />}
						</React.Fragment>
					))}{" "}
			</div>
		</div>
	);
}
