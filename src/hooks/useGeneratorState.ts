import React from "react";
import BuildGenerator from "../classes/BuildGenerator";
import { ItemCategory } from "../types/enums";
import { BuildGenerationConfig } from "../types/types";

const useGeneratorState = (generator: BuildGenerator | null) => {
	if (!generator) {
		throw new Error("Generator is null.");
	}

	const [generatorState, setGeneratorState] = React.useState<BuildGenerationConfig>(generator._buildGenerationConfig);

	const setBuildNumsState = (category: ItemCategory, buildNums: number) => {
		setGeneratorState((prevState) => ({
			...prevState,
			[category]: { ...prevState[category], buildNums },
		}));

		generator.setBuildNumsForCategory(category, buildNums);
	};

	const setExcludePreviouslyRolledState = (category: ItemCategory, excludePreviouslyRolled: boolean) => {
		setGeneratorState((prevState) => ({
			...prevState,
			[category]: { ...prevState[category], excludePreviouslyRolled },
		}));

		generator.setExcludePreviouslyRolledForCategory(category, excludePreviouslyRolled);
	};

	return { generatorState, setBuildNumsState, setExcludePreviouslyRolledState };
};

export default useGeneratorState;
