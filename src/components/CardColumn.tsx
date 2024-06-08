import { Item } from "../classes/Item";
import { ItemCategory } from "../types/enums";
import Card from "./Card";

export default function CardColumn(props: { items: Item[]; reroll: (c: ItemCategory, i: number | undefined) => void }) {
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

	if (props.items.length === 0) return null;

	return (
		<>
			<div className="flex flex-col ">
				<h1 className="text-center text-xl font-bold">{readableItemCategory.get(props.items[0].category)}</h1>
				{props.items.map((item: Item) => (
					<>
						<Card key={item.name} item={item} reroll={props.reroll} />
					</>
				))}
			</div>
		</>
	);
}
