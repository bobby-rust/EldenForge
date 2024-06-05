import React from "react";
import BuildGenerator from "../classes/BuildGenerator";
import { ItemCategory } from "../types/enums";
import { BuildGenerationConfig } from "../types/types";

const useGeneratorState = (initial: BuildGenerationConfig, generator: BuildGenerator) => {
	const [generatorState, setGeneratorState] = React.useState<BuildGenerationConfig>(initial);

	const setBuildNumsForCategory = (category: ItemCategory, buildNums: number) => {
		setGeneratorState((prevState) => ({
			...prevState,
			[category]: { ...prevState[category], buildNums },
		}));
		generator.setBuildNumsForCategory(category, buildNums);
	};

	const setExcludePreviouslyRolledForCategory = (category: ItemCategory, excludePreviouslyRolled: boolean) => {
		setGeneratorState((prevState) => ({
			...prevState,
			[category]: { ...prevState[category], excludePreviouslyRolled },
		}));
		generator.setExcludePreviouslyRolledForCategory(category, excludePreviouslyRolled);
	};

	return { generatorState, setBuildNumsForCategory, setExcludePreviouslyRolledForCategory };
};

export default useGeneratorState;
