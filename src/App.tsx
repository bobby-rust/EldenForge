import React from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Item } from "./classes/Item";
import { ItemCategory } from "./types/enums";
import "./App.css";
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

const generator = new BuildGenerator();
const quote = quotes[Math.floor(Math.random() * quotes.length)];

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

// TODO: Make this a reusable component to use with AI builds.
export default function App() {
	const [armors, setArmors] = React.useState<Item[]>([]);
	const [width, setWidth] = React.useState(window.innerWidth);
	const [buildUrl, _] = useSearchParams();
	const [copied, setCopied] = React.useState(false);
	const [includeSote, setIncludeSote] = React.useState(true);
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [answeredToast, setAnsweredToast] = React.useState(initialAnsweredToast);

	const copyUrl = () => {
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

	const location = useLocation();
	const { state } = location;

	const navigate = useNavigate();

	const [build, setBuild] = React.useState<Map<ItemCategory, Item[]> | null>(
		state
			? null
			: generator.generateBuildFromUrl("?" + buildUrl.toString().replaceAll("%2C", ","))
	);

	const handleReroll = () => {
		if (localStorage.getItem("include-dlc") === null) {
			setDialogOpen(true);
		} else {
			setDialogOpen(false);
		}

		const newUrl = generator.generateUrl();

		navigate(`../${newUrl}`);
		const newBuild = generator.generateBuildFromUrl(newUrl);
		for (const c of newBuild) {
			if (
				c[0] !== ItemCategory.Classes &&
				c[1].length === 0 &&
				generator._buildGenerationConfig[c[0]].buildNums > 0 &&
				!answeredToast[c[0]]
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

	React.useEffect(() => {}, [dialogOpen]);

	const handleClearPreviouslyRolled = (c: ItemCategory) => {
		generator._buildGenerationConfig[c].previouslyRolled.clear();
	};

	const handleSetAnsweredToast = (c: ItemCategory) => {
		const newAnsweredToast = answeredToast;
		newAnsweredToast[c as string] = true;
		setAnsweredToast(newAnsweredToast);
		toast.dismiss();
	};

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
	const handleRerollItem = (c: ItemCategory, i: number | undefined) => {
		if (typeof i === "undefined") {
			return;
		}

		const newBuildMap = generator.rerollItem(c, i);
		const newUrl = generator.createUrlFromBuildMap(newBuildMap);

		if (newUrl === "?" + buildUrl.toString()) {
			toast(
				<ToastMessage
					title={`No ${readableItemCategory.get(c)} left to roll`}
					message={`Would you like to reset ${readableItemCategory.get(c)}?`}
					buttons={<ClearCategoryToastButtons c={c} />}
				/>
			);
		}

		navigate(`../${newUrl}`, { replace: true });
		setBuild(generator.generateBuildFromUrl(newUrl));
	};

	const handleChangeNumItems = (c: ItemCategory, numItems: number) => {
		generator.setNumItems(c, numItems);
	};

	const handleRegenerateCategory = (c: ItemCategory) => {
		const newBuildMap = generator.generateItemsForCategory(c);
		const newUrl = generator.createUrlFromBuildMap(newBuildMap);

		const newAnsweredToast = answeredToast;
		newAnsweredToast[c] = false;
		setAnsweredToast(newAnsweredToast);

		navigate(`../${newUrl}`, { replace: true });
		setBuild(generator.generateBuildFromUrl(newUrl));
	};

	const handleSetIncludeSote = () => {
		generator.setIncludeDlc(!includeSote);
		setIncludeSote(!includeSote);
		localStorage.setItem("include-dlc", (!includeSote).toString());
	};

	const handleDialogChoice = (choice: boolean) => {
		setIncludeSote(choice);
		generator.setIncludeDlc(choice);
		localStorage.setItem("include-dlc", choice.toString());
		setDialogOpen(false);
		handleReroll();
	};

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

	React.useEffect(() => {
		const handleResize = () => {
			setWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const shouldDialogOpen = () => {
		return window.location.pathname === "/" && localStorage.getItem("include-dlc") === null;
	};

	return (
		<ErrorBoundary fallback={<h1>Something went wrong</h1>}>
			<div className={`lg:px-14 pt-8 ${build?.size === 0 && "overflow-y-hidden h-[83vh]"}`}>
				<div
					className={`flex ${
						build?.size === 0 &&
						" h-full items-center flex-col gap-6 animate-landing-slide-up"
					} justify-center mb-10 p-3`}
				>
					{build?.size === 0 && (
						<div className="flex flex-col gap-6 md:gap-10">
							<h1 className="md:text-2xl 2xl:text-5xl font-bold text-center tracking-wide">
								EldenForge
							</h1>
							<blockquote className="md:text-xl 2xl:text-3xl italic text-gray-600 text-center w-[50vw] md:tracking-tight leading-loose  md:mb-10">
								"{quote[0]}" <br></br>- {quote[1]}
							</blockquote>
						</div>
					)}
					<div className="flex gap-3 md:gap-6">
						{window.location.pathname === "/" &&
						window.location.search === "" &&
						shouldDialogOpen() ? (
							<Dialog>
								<DialogTrigger>
									<button
										className={`btn lg:btn-wide lg:btn-lg btn-primary hover:animate-wiggle ${
											build?.size === 0 && " "
										}`}
									>
										<span className="lg:text-xl">Randomizer</span>
									</button>
								</DialogTrigger>
								<DialogContent className="max-w-[90vw] sm:w-auto">
									<DialogHeader>
										<DialogTitle className="text-xl">
											Would you like to include DLC content?
										</DialogTitle>
										<DialogDescription className="text-lg">
											You'll be able to toggle this setting later on the build
											page.
										</DialogDescription>
									</DialogHeader>
									<DialogFooter className="justify-center items-center gap-3 flex-col sm:flex-row">
										<button
											className="btn w-36 sm:w-24 btn-primary"
											onClick={() => handleDialogChoice(true)}
										>
											Yes
										</button>
										<button
											className="btn w-36 sm:w-24 btn-secondary"
											onClick={() => handleDialogChoice(false)}
										>
											No
										</button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						) : (
							window.location.search === "" &&
							window.location.pathname === "/" && (
								<button
									className={`btn lg:btn-wide lg:btn-lg btn-primary hover:animate-wiggle ${
										build?.size === 0 && " "
									}`}
									onClick={handleReroll}
								>
									<span className="lg:text-xl">Randomizer</span>
								</button>
							)
						)}
						{build?.size === 0 && (
							<button
								className={`btn lg:btn-lg btn-secondary hover:animate-wiggle ${
									build?.size === 0 && " "
								}`}
								onClick={() => navigate("/ai")}
							>
								<h1>Ask Gideon</h1>
							</button>
						)}
					</div>
					{!(window.location.search === "") && (
						<div className="flex flex-col xl:flex-row w-full justify-evenly items-center gap-5 sm:p-10">
							<div className="xl:w-1/3 flex justify-center gap-2 items-center mt-3 lg:mt-0">
								<Switch
									checked={includeSote}
									onCheckedChange={handleSetIncludeSote}
								/>
								<h1 className="text-sm lg:text-md xl:text-lg w-full xl:w-auto text-center">
									{width < 334
										? "Include Shadow of the Erdtree"
										: "Include Shadow of the Erdree Items"}
								</h1>
							</div>
							<button
								className={`btn lg:btn-wide lg:btn-lg btn-primary hover:animate-wiggle ${
									build?.size === 0 && " "
								}`}
								onClick={handleReroll}
							>
								<h1 className="lg:text-xl">Randomize Build</h1>
							</button>

							<div className="flex justify-center items-center w-1/3 mr-0 xl:mr-6">
								<button onClick={copyUrl} className="btn btn-wide">
									{copied ? <LuCopyCheck /> : <IoCopyOutline />}
									Copy Build URL
								</button>
							</div>
						</div>
					)}
				</div>
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
