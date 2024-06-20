import React from "react";
import { Item } from "../classes/Item";
import { ItemCategory } from "../types/enums";
import Card from "./Card";
import { defaultBuildGenerationConfig } from "../types/types";
import AddCategoryButton from "./AddCategoryButton";
import { readableItemCategory } from "../types/constants";

export default function CardColumn(props: {
	items: Item[];
	reroll: ((c: ItemCategory, i: number | undefined) => void) | null;
	setNumItems: ((c: ItemCategory, numItems: number) => void) | null;
	isAIBuild: boolean;
	category: ItemCategory;
	regenerateCategory: ((c: ItemCategory) => void) | null;
}) {
	const [selectNumItems, setSelectNumItems] = React.useState(
		typeof props.items[0] !== "undefined" ? defaultBuildGenerationConfig[props.items[0].category].buildNums : 0
	);

	const handleAddCategory = () => {
		props.regenerateCategory?.(props.category);
		setSelectNumItems(defaultBuildGenerationConfig[props.category].buildNums);
		props.setNumItems?.(props.category, defaultBuildGenerationConfig[props.category].buildNums);
	};

	const handleChangeNumItems = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const numItems = parseInt(e.target.value);
		setSelectNumItems(numItems);
		props.setNumItems?.(props.items[0].category, numItems);
	};

	React.useEffect(() => {
		setSelectNumItems(props.items.length);
	}, [props.items]);

	if (props.category === ItemCategory.Classes) return null;
	return (
		<div className="flex justify-center">
			{props.items.length === 0 && (
				<AddCategoryButton category={props.category} regenerateCategory={handleAddCategory} />
			)}
			{props.items.length > 0 && (
				<div className="flex flex-col">
					{!props.isAIBuild ? (
						props.items[0].category !== ItemCategory.Helm ? (
							<select
								value={selectNumItems}
								onChange={handleChangeNumItems}
								className="select text-lg select-bordered w-60 max-w-xs"
							>
								<option className="text-lg" disabled selected>
									Number of {readableItemCategory.get(props.items[0].category)}
								</option>
								<option className="text-xl" value={0}>
									None
								</option>
								<option className="text-xl" value={1}>
									1{" "}
									{props.items[0].category === ItemCategory.Ashes
										? "Ash Of War"
										: props.items[0].category === ItemCategory.Sorcs
										? "Sorcery"
										: props.items[0].category === ItemCategory.Spirits
										? "Spirit Ash"
										: readableItemCategory.get(props.items[0].category)?.slice(0, -1)}
								</option>
								<option className="text-xl" value={2}>
									2 {readableItemCategory.get(props.items[0].category)}
								</option>
								<option className="text-xl" value={3}>
									3 {readableItemCategory.get(props.items[0].category)}{" "}
								</option>
								<option className="text-xl" value={4}>
									4 {readableItemCategory.get(props.items[0].category)}
								</option>
							</select>
						) : (
							<div className="h-12"></div>
						)
					) : null}
					<h1 className="text-center text-xl font-bold p-3">{readableItemCategory.get(props.items[0].category)}</h1>
					{props.items.map((item: Item, i: number) => (
						<div key={i}>
							<Card key={item.name} item={item} reroll={props.reroll} isAIBuild={props.isAIBuild} />
						</div>
					))}
				</div>
			)}
		</div>
	);
}
