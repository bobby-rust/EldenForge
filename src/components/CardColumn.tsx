import React from "react";
import { Item } from "../classes/Item";
import { ArmorCategories } from "../types/constants";
import { ItemCategory } from "../types/enums";
import Card from "./Card";

export default function CardColumn(props: {
	items: Item[];
	reroll: ((c: ItemCategory, i: number | undefined) => void) | null;
}) {
	if (props.items.length === 0) return null;
	if (props.items[0].category === ItemCategory.Classes) return null;

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

	return (
		<>
			<div className="flex flex-col flex-grow-0 ">
				<h1 className="text-center text-xl font-bold">{readableItemCategory.get(props.items[0].category)}</h1>
				{props.items.map((item: Item, i: number) => (
					<React.Fragment key={i}>
						<Card key={item.name} item={item} reroll={props.reroll} />
					</React.Fragment>
				))}
			</div>
		</>
	);
}
