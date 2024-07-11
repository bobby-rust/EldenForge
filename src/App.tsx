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
import { ItemCategory, UICategoryToItemCategory, UIItemCategory } from "./types/enums";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { quotes } from "./types/constants";
import { defaultBuildGenerationConfig, ToastCategories } from "./types/types";
import { getIncludeDlcStorageValue } from "./lib/utils";

// A random quote is rendered on the landing page.
const quote = quotes[Math.floor(Math.random() * quotes.length)];

/**
 * The initial state of the `AnsweredToast` object.
 * This is used to determine if the user has already answered the "No <category> left to roll" toast for each category.
 * The toast is only rendered if the user has not answered "No" when asked if they would like to reset the previously rolled items for the category.
 */
const initialToastCategories: ToastCategories = {
	ashes: false,
	incants: false,
	seals: false,
	shields: false,
	sorcs: false,
	spirits: false,
	talismans: false,
	tears: false,
	staves: false,
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
	const [width, setWidth] = React.useState(window.innerWidth);
	const [buildUrl, _] = useSearchParams();
	const [build, setBuild] = React.useState<Map<UIItemCategory, Item[]>>(generator.generateBuildFromUrl("?" + buildUrl.toString().replaceAll("%2C", ",")));
	const [copied, setCopied] = React.useState(false);
	const [includeDlc, setincludeDlc] = React.useState(getIncludeDlcStorageValue());
	const [answeredToast, setAnsweredToast] = React.useState(initialToastCategories);
	const [showedHint, setShowedHint] = React.useState(false);

	// Helper functions
	/**
	 * The clear category toast buttons for a specified item category.
	 *
	 * @param {ItemCategory} props.c - The item category
	 * @return {JSX.Element} The clear category toast buttons.
	 */
	const ClearCategoryToastButtons = (props: { c: ItemCategory; readableName: string }): JSX.Element => {
		const { c, readableName } = props;

		return (
			<div className="flex p-3 gap-2">
				<button
					className="btn"
					onClick={() => {
						handleResetAvailableItems(c);
						toast.dismiss();
						handleRegenerateCategory(c);
						toast.success(`Previously rolled ${readableName} cleared!`);
					}}>
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

	const navigateToAi = () => {
		generator._buildGenerationConfig = structuredClone(defaultBuildGenerationConfig);
		generator._baseGameItems = generator.initBaseGameItems();
		generator._dlcItems = generator.initDlcItems();
		navigate("/ai");
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
		setBuild(newBuild);
		newBuild.forEach((i, c) => {
			const itemCategory = UICategoryToItemCategory.get(c);
			if (typeof itemCategory === "undefined") return;
			if (!showedHint && i.length === 0 && c !== UIItemCategory.Classes && generator._buildGenerationConfig.buildInfo.categoryConfigs.get(itemCategory)!.buildNums > 0) {
				toast(
					ToastMessage({
						title: "Hint",
						message: `No ${c} left. You can choose to include previously rolled items in the settings menu.`,
						buttons: (
							<Button className="" onClick={() => toast.dismiss()}>
								Okay
							</Button>
						),
					}),
					{ duration: 8000 }
				);
				setShowedHint(true);
			}
		});
	};

	/**
	 * Clears the set of previously rolled items for the specified category.
	 *
	 * @param {ItemCategory} c - The category for which to clear the set of previously rolled items.
	 * @return {void}
	 */
	const handleResetAvailableItems = (c: ItemCategory): void => {
		generator.resetAvailableItemsForCategory(c);
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
		let readableName = readableItemCategory.get(c);
		if (typeof readableName === "undefined") {
			switch (c) {
				case ItemCategory.Chest:
					readableName = "Chests";
					break;
				case ItemCategory.Gauntlets:
					readableName = "Gauntlets";
					break;
				case ItemCategory.Leg:
					readableName = "Legs";
					break;
			}
		}

		if (typeof readableName === "undefined") {
			return;
		}
		// rerollItem returns undefined if there are no items left to roll for the category
		if (typeof newBuildMap === "undefined") {
			toast.error(
				<ToastMessage
					title={`No ${readableName} left to roll`}
					message={`Would you like to reset ${readableName}?`}
					buttons={<ClearCategoryToastButtons c={c} readableName={readableName} />}
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
		console.log("Changeing num items", c, numItems);
		generator.setNumItems(c, numItems);
	};

	const regenerateArmors = () => {
		let newUrl;
		for (const c in ArmorCategories) {
			const newBuildMap = generator.generateItemsForCategory(c as ItemCategory);
			if (typeof newBuildMap === "undefined") continue;
			newUrl = generator.createUrlFromBuildMap(newBuildMap);
		}

		if (typeof newUrl === "undefined") return;
		const newBuild = generator.generateBuildFromUrl(newUrl);

		navigate(`../${newUrl}`);
		setBuild(newBuild);
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

		if (typeof newBuildMap === "undefined") return;
		const newUrl = generator.createUrlFromBuildMap(newBuildMap);

		if (typeof newUrl === "undefined") return;

		const newBuild = generator.generateBuildFromUrl(newUrl);
		if (typeof newBuild === "undefined") return;

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

	React.useEffect(() => {
		generator.setIncludeDlc(includeDlc);
	}, [includeDlc]);

	return (
		<ErrorBoundary fallback={<h1>Something went wrong</h1>}>
			<div className={`lg:px-14 pt-8 ${build?.size === 0 && "overflow-y-hidden h-[83vh]"} min-h-full`}>
				<div className={`flex ${build?.size === 0 && " h-full items-center flex-col gap-6 animate-landing-slide-up"} justify-center mb-10 p-3`}>
					{/* ----- Landing ----- */}
					{build?.size === 0 && (
						<div className="flex flex-col gap-3 md:gap-10">
							<h1 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-center tracking-wide">EldenForge</h1>
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
										<DialogDescription className="text-lg">You'll be able to toggle this setting later on the build page.</DialogDescription>
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
									onClick={localStorage.getItem("include-dlc") === null ? undefined : handleReroll}>
									<span className="lg:text-2xl">Randomizer</span>
								</button>
							)}
							{build?.size === 0 && (
								<button className={`btn btn-secondary hover:animate-wiggle ${build?.size === 0 && "btn-lg"}`} onClick={() => navigateToAi()}>
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
							[...build.keys()].map((c: UIItemCategory, i: number) => (
								<React.Fragment key={i}>
									{c !== UIItemCategory.Classes && (
										<CardColumn
											items={build.get(c) ?? []}
											reroll={handleRerollItem}
											setNumItems={handleChangeNumItems}
											isAIBuild={false}
											category={c}
											regenerateCategory={handleRegenerateCategory}
											regenerateArmors={regenerateArmors}
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
