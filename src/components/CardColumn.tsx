/**
 * This component renders a column of item cards for a specified category.
 * It is used in both the random generator and the AI generator pages.
 */

import React from "react";
import { Item } from "../classes/Item";
import { ItemCategory } from "../types/enums";
import Card from "./Card";
import AddCategoryButton from "./AddCategoryButton";
import { readableItemCategory } from "../types/constants";

/**
 * Renders a column of cards for a specific item category.
 *
 * @param {Item[]} props.items - The items to render as cards.
 * @param {Function|null} props.reroll - A function to reroll an item.
 * @param {Function|null} props.setNumItems - A function to set the number of items.
 * @param {boolean} props.isAIBuild - Indicates if the build is generated by AI.
 * @param {ItemCategory} props.category - The category of items to render.
 * @param {Function|null} props.regenerateCategory - A function to regenerate the category.
 * @return {JSX.Element} The rendered card column.
 */
export default function CardColumn(props: {
	items: Item[];
	reroll: ((c: ItemCategory, i: number) => void) | null;
	setNumItems: ((c: ItemCategory, numItems: number) => void) | null;
	isAIBuild: boolean;
	category: ItemCategory;
	regenerateCategory: ((c: ItemCategory) => void) | null;
}) {
	// State initialization
	const [width, setWidth] = React.useState(window.innerWidth);
	// If there are any items passed, get the number of items from the generator's config, otherwise set it to 0
	const [selectNumItems, setSelectNumItems] = React.useState(props.items.length);

	/**
	 * Event handler for adding a category.
	 *
	 * It regenerates the category, sets the number of items to the default value,
	 * and updates the number of items in the build.
	 */
	// Event handlers
	const handleAddCategory = () => {
		/**
		 * Regenerate the category.
		 * This updates the build state in the parent component, triggering a rerender of this component with the updated items.
		 */
		props.regenerateCategory?.(props.category);

		// Set the number of items to the default value -- Is this necessary?
		// const defaultNumItems = defaultBuildGenerationConfig.buildInfo.categoryConfigs.get(props.category)!.buildNums;
		// setSelectNumItems(defaultNumItems);

		// Update the number of items in the build
		// props.setNumItems?.(props.category, defaultNumItems);
	};

	/**
	 * Handles the change event of the number of items select input.
	 * Updates the number of items state in the current component and the build generator with the selected value.
	 *
	 * @param {React.ChangeEvent<HTMLSelectElement>} e - The event object representing the change event.
	 * @return {void} This function does not return anything.
	 */
	const handleChangeNumItems = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const numItems = parseInt(e.target.value);
		setSelectNumItems(numItems);
		props.setNumItems?.(props.items[0].category, numItems);
	};

	// Effects
	/**
	 * Each time the items change, set the number of items to the length of the items array, otherwise the state will be out of sync.
	 * This effect may not be needed.
	 */
	// React.useEffect(() => {
	// 	setSelectNumItems(props.items.length);
	// }, [props.items]);

	/**
	 * Updates the width state based on the current window inner width.
	 *
	 * @return {void}
	 */
	React.useEffect(() => {
		function handleResize() {
			setWidth(window.innerWidth);
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	if (props.category === ItemCategory.Classes) return null; // Classes are not rendered in the card column
	return (
		<div className="flex justify-center">
			{/* ----- Add category button ----- */}
			{props.items.length === 0 && (
				<AddCategoryButton category={props.category} regenerateCategory={handleAddCategory} />
			)}

			{/* ----- Number of items select menu. Only rendered if it's not an AI build, there are items, the category is not armors. ----- */}
			{props.items.length > 0 && (
				<div className="flex flex-col items-center">
					{!props.isAIBuild && props.items[0].category !== ItemCategory.Helm && (
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
					)}

					{/**
					 * If it's not mobile and there are no items in the category, fill up the space where the select menu should go to keep the cards aligned
					 * If it is mobile, there isn't more than one card column, so they do not have to be aligned horizontally
					 */}
					{width > 640 && props.items.length === 0 && <div className="h-12"></div>}

					{/* ----- Category title and cards ----- */}
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
