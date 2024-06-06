import { Item } from "../classes/Item";
import { ItemCategory } from "../types/enums";

export default function Card(props: { item: Item; reroll: (c: ItemCategory, i: number | undefined) => void }) {
	return (
		<div className="card card-compact w-96 bg-base-100 shadow-xl m-5">
			<figure>
				<img src={`${props.item.image}`} alt={`${props.item.name}`} />
			</figure>
			<div className="card-body">
				<h2 className="card-title">{props.item.name}</h2>
				<p>If a dog chews shoes whose shoes does he choose?</p>
				<div className="card-actions justify-end">
					<button onClick={() => props.reroll(props.item.category, props.item.index)} className="btn btn-primary">
						Reroll Item
					</button>
				</div>
			</div>
		</div>
	);
}
