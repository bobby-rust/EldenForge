import { Item } from "../classes/Item";
import { ItemCategory } from "../types/enums";
import { GiBroadsword, GiWeight } from "react-icons/gi";

export default function Card(props: { item: Item; reroll: (c: ItemCategory, i: number | undefined) => void }) {
	if (props.item.category === ItemCategory.Classes) return null;

	let name = props.item.name;
	const nameArr = props.item.name.split(" ");
	if (props.item.category === ItemCategory.Ashes && nameArr[0] !== "Lost" && nameArr[0] !== "Through") {
		name = props.item.name.split("Ash Of War: ")[1];
	}

	// TODO: compress / downscale images for better rendering performance
	return (
		<>
			<div className="flex flex-col w-60 h-60 bg-slate-100 shadow-xl m-3 rounded-lg">
				<div className="relative h-full p-3">
					<a href={`${props.item.wikiUrl}`} target="_blank" rel="noreferrer" className="flex">
						<figure className="w-[50%]">
							<img
								height={100}
								width={100}
								src={`${props.item.image}`}
								alt={`${props.item.name}`}
								className="rounded-xl h-[100px] w-[100px]"
							/>
						</figure>
						<div className="flex justify-center w-[50%]">
							<h6 className="text-[18px] font-semibold overflow-hidden whitespace-pre-wrap">{name}</h6>
						</div>
						<div className="absolute inset-0 rounded-x-lg rounded-t-lg bg-black bg-opacity-50 flex justify-center items-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
							<p className="text-center">Overlay Text Here</p>
						</div>
					</a>
					<div>
						<GiBroadsword size="20" />
					</div>
					<div>
						<GiWeight size="20" />
					</div>
				</div>
				<div className="flex flex-col justify-center items-center text-center w-full">
					<div className="align-bottom bg-slate-400 w-full h-12 flex justify-end align-center p-2 rounded-b-lg">
						<button
							onClick={() => props.reroll(props.item.category, props.item.index)}
							className="btn btn-primary btn-sm"
						>
							Reroll Item
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
