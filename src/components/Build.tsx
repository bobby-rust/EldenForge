import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Item } from "../classes/Item";
import useGeneratorState from "../hooks/useGeneratorState";
import { ItemCategory } from "../types/enums";
import "../App.css";
import CardColumn from "./CardColumn";
import { ErrorBoundary } from "react-error-boundary";
import BuildGenerator from "../classes/BuildGenerator";
import { ArmorCategories } from "../types/constants";
const generator = new BuildGenerator();

export default function Build() {
	const [armors, setArmors] = React.useState<Item[]>([]);

	const { buildUrl } = useParams();

	if (!buildUrl) {
		throw new Error("Invalid path");
	}

	const navigate = useNavigate();

	const [build, setBuild] = React.useState<Map<ItemCategory, Item[]> | null>(generator.generateBuildFromUrl(buildUrl));
	const { generatorState, setBuildNumsState, setExcludePreviouslyRolledState } = useGeneratorState(generator);

	const handleIncrementBuildNumsForCategory = (c: ItemCategory) => {
		setBuildNumsState(c, generatorState[c].buildNums + 1);
	};

	const handleToggleExcludePreviouslyRolledForCategory = (c: ItemCategory) => {
		setExcludePreviouslyRolledState(c, !generatorState[c].excludePreviouslyRolled);
	};

	const handleReroll = () => {
		// if i keep track of the state of the build separately, i can avoid refreshing the page
		// every time the build changes.
		const newUrl = generator.generateUrl();

		navigate(`../${newUrl}`, { replace: true });
		setBuild(generator.generateBuildFromUrl(newUrl));
	};

	const handleRerollItem = (c: ItemCategory, i: number | undefined) => {
		if (typeof i === "undefined") return;

		const newBuildMap = generator.rerollItem(c, i);
		const newUrl = generator.createUrlFromBuildMap(newBuildMap);

		navigate(`../${newUrl}`, { replace: true });
		setBuild(generator.generateBuildFromUrl(newUrl));
	};

	React.useEffect(() => {
		if (build) {
			const newArmors: Item[] = [];
			[...build.keys()].forEach((c: ItemCategory) => {
				if (ArmorCategories.has(c) && build.get(c)) {
					newArmors.push(...(build.get(c) ?? []));
				}
			});
			setArmors(newArmors);
		}
	}, [build]);

	return (
		<ErrorBoundary fallback={<h1>Something went wrong</h1>}>
			<div className="App px-14">
				<div className="flex w-full justify-center align-center p-3">
					<button className="btn btn-lg btn-primary" onClick={handleReroll}>
						<h1>Generate New Build</h1>
					</button>
				</div>
				<div className="flex justify-center align-center">
					{/* <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 "> */}
					<div className="flex flex-wrap justify-center align-center">
						{build &&
							[...build.keys()].map((c: ItemCategory, i: number) => (
								<>
									{/* TODO: fix this garbage */}
									{!ArmorCategories.has(c) && (
										<CardColumn key={i} items={build.get(c) ?? []} reroll={handleRerollItem} />
									)}
									{c === ItemCategory.Helm && <CardColumn key={i} items={armors} reroll={handleRerollItem} />}
								</>
							))}{" "}
					</div>
				</div>
			</div>
		</ErrorBoundary>
	);
}
