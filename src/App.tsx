/**
 * Build Randomizer for Elden Ring.
 *
 * @author Bobby Rust
 * Date: Spring 2024 - Summer 2024
 *
 * This component includes the landing page when url is "/", and build page when search params are "/?<some_build_category>&<some_other_build_category>..."
 */

import React from "react";
import "./App.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Item } from "./classes/Item";
import { ItemCategory } from "./types/enums";
import CardColumn from "./components/CardColumn";
import { ErrorBoundary } from "react-error-boundary";
import { ArmorCategories, readableItemCategory } from "./types/constants";
import { ToastMessage } from "./components/ToastMessage";
import { toast } from "sonner";
import BuildGenerator from "@/classes/BuildGenerator";
import { LuCopyCheck } from "react-icons/lu";
import { IoCopyOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { quotes } from "./types/constants";
import { AnsweredToast } from "./types/types";
import { getIncludeDlcStorageValue } from "./lib/utils";

// A random quote is rendered on the landing page.
const quote = quotes[Math.floor(Math.random() * quotes.length)];

/**
 * The initial state of the `AnsweredToast` object.
 * This is used to determine if the user has already answered the "No <category> left to roll" toast for each category.
 * The toast is only rendered if the user has not answered "No" when asked if they would like to reset the previously rolled items for the category.
 */
const initialAnsweredToast: AnsweredToast = {
	ashes: false,
	incants: false,
	seals: false,
	shields: false,
	sorcs: false,
	spirits: false,
	talismans: false,
	tears: false,
	weapons: false,
};

/**
 * Renders the main application component.
 *
 * @param {BuildGenerator} props.generator - The build generator instance.
 * @return {JSX.Element} The rendered application component.
 */
export default function App(props: { generator: BuildGenerator }): JSX.Element {
	// Get the generator instance from props
	const { generator } = props;
	const navigate = useNavigate();

	// State initialization
	const [armors, setArmors] = React.useState<Item[]>([]); // A separate armors state is needed because it is passed separately to child components
	const [width, setWidth] = React.useState(window.innerWidth);
	const [buildUrl, _] = useSearchParams();
	const [build, setBuild] = React.useState<Map<ItemCategory, Item[]>>(
		generator.generateBuildFromUrl("?" + buildUrl.toString().replaceAll("%2C", ","))
	);
	const [copied, setCopied] = React.useState(false);
	const [includeDlc, setincludeDlc] = React.useState(getIncludeDlcStorageValue());
	const [answeredToast, setAnsweredToast] = React.useState(initialAnsweredToast);

	// Helper functions
	/**
	 * The clear category toast buttons for a specified item category.
	 *
	 * @param {ItemCategory} props.c - The item category
	 * @return {JSX.Element} The clear category toast buttons.
	 */
	const ClearCategoryToastButtons = (props: { c: ItemCategory }): JSX.Element => {
		const { c } = props;

		return (
			<div className="flex p-3 gap-2">
				<button
					className="btn"
					onClick={() => {
						handleClearPreviouslyRolled(c);
						toast.dismiss();
						handleRegenerateCategory(c);
						toast.success(`Previously rolled ${readableItemCategory.get(c)} cleared!`);
					}}
				>
					Yes
				</button>
				<button className="btn" onClick={() => handleSetAnsweredToast(c)}>
					No
				</button>
			</div>
		);
	};

	/**
	 * Determines whether the dialog should be open based on the current pathname and the value of "include-dlc" in localStorage.
	 *
	 * @return {boolean} True if the current pathname is "/" and the value of "include-dlc" in localStorage is null, otherwise false.
	 */
	const shouldDialogOpen = (): boolean => {
		return window.location.pathname === "/" && localStorage.getItem("include-dlc") === null;
	};

	/**
	 * Copies the current URL to the clipboard and displays a toast notification.
	 *
	 * @return {void}
	 */
	const copyUrl = (): void => {
		const textToCopy = window.location.href;
		navigator.clipboard.writeText(textToCopy);
		setCopied(true);
		toast(
			<ToastMessage
				title="Copied!"
				message="Link copied to clipboard"
				buttons={
					<Button className="" onClick={() => toast.dismiss()}>
						Okay
					</Button>
				}
			/>
		);
	};

	// Event handlers
	/**
	 * Handles the reroll button click event. Generates a new build URL and updates the build state.
	 *
	 * @return {void}
	 */
	const handleReroll = (): void => {
		// Get  new URL and navigate to it
		const newUrl = generator.generateUrl();
		navigate(`../${newUrl}`);

		// Get the new build from the URL
		const newBuild = generator.generateBuildFromUrl(newUrl);

		// Check if there are any items left to roll
		for (const c of newBuild) {
			const buildInfo = generator._buildGenerationConfig.buildInfo.categoryConfigs.get(c[0])!;

			const categoryName = c[0];
			const categoryItems = c[1];

			/**
			 * Only render the toast if:
			 * - The category is not Classes.
			 * - The category has no items left to roll.
			 * - The user has not answered "No" when asked if they would like to reset the previously rolled items for the category.
			 * - The user has not excluded previously rolled items.
			 */
			if (
				categoryName !== ItemCategory.Classes &&
				categoryItems.length === 0 &&
				buildInfo.buildNums > 0 &&
				!answeredToast[c[0]] &&
				buildInfo.excludePreviouslyRolled
			) {
				toast(
					<ToastMessage
						title={`No ${readableItemCategory.get(c[0])} left to roll`}
						message={`Would you like to reset ${readableItemCategory.get(c[0])}?`}
						buttons={<ClearCategoryToastButtons c={c[0]} />}
					/>
				);
			}
		}

		setBuild(newBuild);
	};

	/**
	 * Clears the set of previously rolled items for the specified category.
	 *
	 * @param {ItemCategory} c - The category for which to clear the set of previously rolled items.
	 * @return {void}
	 */
	const handleClearPreviouslyRolled = (c: ItemCategory): void => {
		generator._buildGenerationConfig.buildInfo.categoryConfigs.get(c)!.previouslyRolled.clear();
	};

	/**
	 * Handles setting the answered toast for a specific item category.
	 * This function is called when the user clicks the "No" button in the toast asking if they would like to reset the previously rolled items.
	 *
	 * @param {ItemCategory} c - The item category for which to set the answered toast.
	 * @return {void}
	 */
	const handleSetAnsweredToast = (c: ItemCategory): void => {
		const newAnsweredToast = answeredToast;
		newAnsweredToast[c as string] = true;
		setAnsweredToast(newAnsweredToast);
		toast.dismiss();
	};

	/**
	 * Handles the reroll of a specific item in the given category.
	 *
	 * @param {ItemCategory} c - The category of the item.
	 * @param {number} i - The index of the item to reroll.
	 * @return {void}
	 */
	const handleRerollItem = (c: ItemCategory, i: number): void => {
		const newBuildMap = generator.rerollItem(c, i);

		// rerollItem returns undefined if there are no items left to roll for the category
		if (typeof newBuildMap === "undefined") {
			toast.error(
				<ToastMessage
					title={`No ${readableItemCategory.get(c)} left to roll`}
					message={`Would you like to reset ${readableItemCategory.get(c)}?`}
					buttons={<ClearCategoryToastButtons c={c} />}
				/>
			);

			return;
		}

		const newUrl = generator.createUrlFromBuildMap(newBuildMap);
		const newBuild = generator.generateBuildFromUrl(newUrl);

		navigate(`../${newUrl}`);
		setBuild(newBuild);
	};

	/**
	 * Sets the number of items to generate for a specified category.
	 *
	 * @param {ItemCategory} c - The category of items to set the number for.
	 * @param {number} numItems - The number of items to set for the category.
	 */
	const handleChangeNumItems = (c: ItemCategory, numItems: number) => {
		generator.setNumItems(c, numItems);
	};

	/**
	 * Regenerates the items for a specified category and updates the build and URL.
	 * Only called when the current build has 0 items in the category passed.
	 *
	 * @param {ItemCategory} c - The category of items to regenerate.
	 * @return {void}
	 */
	const handleRegenerateCategory = (c: ItemCategory): void => {
		const newBuildMap = generator.generateItemsForCategory(c);
		const newUrl = generator.createUrlFromBuildMap(newBuildMap);
		const newBuild = generator.generateBuildFromUrl(newUrl);

		// Reset the answered toast for the category (should this be done?)
		const newAnsweredToast = answeredToast;
		newAnsweredToast[c] = false;
		setAnsweredToast(newAnsweredToast);

		navigate(`../${newUrl}`, { replace: true });
		setBuild(newBuild);
	};

	/**
	 * Toggles the includeDlc state, updates the generator includeDlc property, and stores the includeDlc value in localStorage.
	 *
	 * @return {void}
	 */
	const handleSetincludeDlc = (): void => {
		generator.setIncludeDlc(!includeDlc);
		setincludeDlc(!includeDlc);
		localStorage.setItem("include-dlc", (!includeDlc).toString());
	};

	/**
	 * The dialog choice handler for the dialog shown when users do not have an "include-dlc" value in localStorage and they attempt to randomize a build.
	 * Sets the includeDlc state, updates the generator includeDlc property, and stores the includeDlc value in localStorage.
	 *
	 * @param {boolean} choice - The choice to set includeDlc state
	 * @return {void} No return value
	 */
	const handleDialogChoice = (choice: boolean): void => {
		setincludeDlc(choice);
		generator.setIncludeDlc(choice);
		localStorage.setItem("include-dlc", choice.toString());
		handleReroll();
	};

	// Effects
	/**
	 * Updates the armors state when the build changes
	 */
	React.useEffect(() => {
		if (build) {
			const newArmors: Item[] = [];
			[...build.keys()].forEach((c: ItemCategory) => {
				if (ArmorCategories.has(c) && build.get(c)) {
					newArmors.push(...(build.get(c) ?? []));
				}
			});
			setArmors(newArmors);
		}
	}, [build]);

	/**
	 * Handles window resize events and updates the width state
	 */
	React.useEffect(() => {
		const handleResize = () => {
			setWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	/**
	 * Syncs the includeDlc state in the generator with the localStorage value
	 */
	React.useEffect(() => {
		generator.setIncludeDlc(localStorage.getItem("include-dlc") === "false" ? false : true);
	}, []);

	return (
		<ErrorBoundary fallback={<h1>Something went wrong</h1>}>
			<div className={`lg:px-14 pt-8 ${build?.size === 0 && "overflow-y-hidden h-[83vh]"}`}>
				<div
					className={`flex ${
						build?.size === 0 && " h-full items-center flex-col gap-6 animate-landing-slide-up"
					} justify-center mb-10 p-3`}
				>
					{/* ----- Landing ----- */}
					{build?.size === 0 && (
						<div className="flex flex-col gap-3 md:gap-10">
							<h1 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-center tracking-wide">
								EldenForge
							</h1>
							<blockquote className="md:text-xl 2xl:text-3xl italic text-gray-600 text-center w-[50vw] md:tracking-tight leading-loose  md:mb-10">
								"{quote[0]}" <br></br>- {quote[1]}
							</blockquote>
						</div>
					)}

					{/* ----- Include DLC dialog ----- */}
					<div className="flex gap-3 md:gap-6">
						{build?.size === 0 && shouldDialogOpen() && (
							<Dialog>
								<DialogTrigger>
									<button className="btn lg:btn-wide btn-primary hover:animate-wiggle btn-lg">
										<span className="lg:text-2xl">Randomizer</span>
									</button>
								</DialogTrigger>
								<DialogContent className="max-w-[90vw] sm:w-auto">
									<DialogHeader>
										<DialogTitle className="text-xl">Would you like to include DLC content?</DialogTitle>
										<DialogDescription className="text-lg">
											You'll be able to toggle this setting later on the build page.
										</DialogDescription>
									</DialogHeader>
									<DialogFooter className="justify-center items-center gap-3 flex-col sm:flex-row">
										<button className="btn w-36 sm:w-24 btn-primary" onClick={() => handleDialogChoice(true)}>
											Yes
										</button>
										<button className="btn w-36 sm:w-24 btn-secondary" onClick={() => handleDialogChoice(false)}>
											No
										</button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						)}

						{/* ----- Landing page buttons ----- */}
						<div className="flex gap-3 md:gap-6">
							{build?.size === 0 && !shouldDialogOpen() && (
								<button
									className={`btn lg:btn-wide btn-primary hover:animate-wiggle ${build?.size === 0 && "btn-lg"}`}
									onClick={localStorage.getItem("include-dlc") === null ? undefined : handleReroll}
								>
									<span className="lg:text-2xl">Randomizer</span>
								</button>
							)}
							{build?.size === 0 && (
								<button
									className={`btn btn-secondary hover:animate-wiggle ${build?.size === 0 && "btn-lg"}`}
									onClick={() => navigate("/ai")}
								>
									<h1 className="lg:text-2xl">Ask Gideon</h1>
								</button>
							)}
						</div>
					</div>

					{/* ----- Build page buttons ----- */}
					{build?.size !== 0 && (
						<div className="flex flex-col xl:flex-row w-full justify-evenly items-center gap-5 sm:p-10">
							<div className="xl:w-1/3 flex justify-center gap-2 items-center mt-3 lg:mt-0">
								<Switch checked={includeDlc} onCheckedChange={handleSetincludeDlc} />
								<h1 className="text-sm lg:text-md xl:text-lg w-full xl:w-auto text-center">
									{width < 334 ? "Include Shadow of the Erdtree" : "Include Shadow of the Erdree Items"}
								</h1>
							</div>
							<button className="btn btn-wide lg:btn-lg btn-primary hover:animate-wiggle" onClick={handleReroll}>
								<h1 className="lg:text-xl">Randomize Build</h1>
							</button>

							<div className="flex justify-center items-center w-1/3 mr-0 xl:mr-6">
								<button onClick={copyUrl} className="btn btn-wide text-sm lg:text-md xl:text-lg">
									{copied ? <LuCopyCheck /> : <IoCopyOutline />}
									Copy Build URL
								</button>
							</div>
						</div>
					)}
				</div>

				{/* ----- Item Grid ----- */}
				<div className="flex justify-center align-center max-w-full">
					<div className="grid grid-cols-1 sm:grid-cols-2 2lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 2.5xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 gap-4 auto-cols-auto">
						{build &&
							[...build.keys()].map((c: ItemCategory, i: number) => (
								<React.Fragment key={i}>
									{!ArmorCategories.has(c) && c !== ItemCategory.Classes && (
										<CardColumn
											items={build.get(c) ?? []}
											reroll={handleRerollItem}
											setNumItems={handleChangeNumItems}
											isAIBuild={false}
											category={c}
											regenerateCategory={handleRegenerateCategory}
										/>
									)}
									{c === ItemCategory.Helm && (
										<CardColumn
											items={armors}
											reroll={handleRerollItem}
											setNumItems={handleChangeNumItems}
											isAIBuild={false}
											category={c}
											regenerateCategory={handleRegenerateCategory}
										/>
									)}
								</React.Fragment>
							))}
					</div>
				</div>
			</div>
		</ErrorBoundary>
	);
}
