import React from "react";
import { Item } from "../classes/Item";
import { ItemCategory } from "../types/enums";
import Card from "./Card";
import { defaultBuildGenerationConfig } from "../types/types";

export default function CardColumn(props: {
	items: Item[];
	reroll: ((c: ItemCategory, i: number | undefined) => void) | null;
	setNumItems: ((c: ItemCategory, numItems: number) => void) | null;
	isAIBuild: boolean;
}) {
	if (props.items.length === 0) return null;
	if (props.items[0].category === ItemCategory.Classes) return null;
	const [width, setWidth] = React.useState(window.innerWidth);
	const [selectNumItems, setSelectNumItems] = React.useState(
		defaultBuildGenerationConfig[props.items[0].category].buildNums
	);

	const handleChangeNumItems = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const numItems = parseInt(e.target.value);
		setSelectNumItems(numItems);
		props.setNumItems?.(props.items[0].category, numItems);
	};

	const readableItemCategory = new Map<ItemCategory, string>([
		[ItemCategory.Weapons, "Weapons"],
		[ItemCategory.Helm, "Armors"],
		[ItemCategory.Ashes, "Ashes Of War"],
		[ItemCategory.Incants, "Incantations"],
		[ItemCategory.Sorcs, "Sorceries"],
		[ItemCategory.Talismans, "Talismans"],
		[ItemCategory.Spirits, "Spirit Ashes"],
		[ItemCategory.Shields, "Shields"],
		[ItemCategory.Tears, "Crystal Tears"],
		[ItemCategory.Seals, "Sacred Seals"],
	]);

	React.useEffect(() => {
		setSelectNumItems(props.items.length);
	}, [props.items]);

	React.useEffect(() => {
		function handleResize() {
			setWidth(window.innerWidth);
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<>
			<div className="flex flex-col items-center">
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
								3 {readableItemCategory.get(props.items[0].category)}
							</option>
							<option className="text-xl" value={4}>
								4 {readableItemCategory.get(props.items[0].category)}
							</option>
						</select>
					) : width > 640 ? (
						<div className="h-12"></div>
					) : null
				) : null}
				<h1 className="text-center text-xl font-bold p-3">{readableItemCategory.get(props.items[0].category)}</h1>
				{props.items.map((item: Item, i: number) => (
					<div key={i}>
						<Card key={item.name} item={item} reroll={props.reroll} isAIBuild={props.isAIBuild} />
					</div>
				))}
			</div>
		</>
	);
}
