import { FaPlus } from "react-icons/fa";
import { readableItemCategory } from "../types/constants";
import { ItemCategory } from "@/types/enums";

export default function AddCategoryButton(props: {
	category: ItemCategory;
	regenerateCategory: (c: ItemCategory) => void;
}) {
	return (
		<div className="flex flex-col">
			<div className="h-28"></div>
			<div className="h-60 w-60">
				<button
					onClick={() => props.regenerateCategory(props.category)}
					className="btn btn-square h-full w-full flex justify-center items-center flex-col p-4"
				>
					<div>
						<FaPlus size={75} />
					</div>
					<h1 className="text-2xl">{readableItemCategory.get(props.category)}</h1>
				</button>
			</div>
		</div>
	);
}
