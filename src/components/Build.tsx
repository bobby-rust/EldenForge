import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Item } from "../classes/Item";
import { ItemCategory } from "../types/enums";
import "../App.css";
import CardColumn from "./CardColumn";
import { ErrorBoundary } from "react-error-boundary";
import BuildGenerator from "../classes/BuildGenerator";
import { ArmorCategories } from "../types/constants";
import { toast } from "sonner";
import { IoCopyOutline } from "react-icons/io5";
import { LuCopyCheck } from "react-icons/lu";
import { Checkbox } from "@/components/ui/checkbox";

const ToastMessage = () => {
	return (
		<div className="flex justify-between w-full items-center">
			<div className="flex flex-col justify-center">
				<h1 className="font-semibold">Copied!</h1>
				<p>Link copied to clipboard</p>
			</div>
			<button className="btn" onClick={() => toast.dismiss()}>
				Okay
			</button>
		</div>
	);
};

const generator = new BuildGenerator();

// TODO: Make this a reusable component to use with AI builds.
export default function Build() {
	const [armors, setArmors] = React.useState<Item[]>([]);
	const [copied, setCopied] = React.useState(false);
	const [includeSote, setIncludeSote] = React.useState(true);

	const copyUrl = () => {
		const textToCopy = window.location.href;
		navigator.clipboard.writeText(textToCopy);
		setCopied(true);
		toast(<ToastMessage />);
	};
	React.useEffect(() => {
		const timer = setTimeout(() => {
			setCopied(false);
		}, 4000);

		return () => clearInterval(timer);
	}, [copied]);
	const { buildUrl } = useParams();

	if (!buildUrl) {
		throw new Error("Invalid path");
	}

	const navigate = useNavigate();

	const [build, setBuild] = React.useState<Map<ItemCategory, Item[]> | null>(generator.generateBuildFromUrl(buildUrl));
	const [width, setWidth] = React.useState(window.innerWidth);
	const handleReroll = () => {
		// if i keep track of the state of the build separately, i can avoid refreshing the page
		// every time the build changes.
		const newUrl = generator.generateUrl();

		navigate(`../${newUrl}`, { replace: true });
		setBuild(generator.generateBuildFromUrl(newUrl));
	};

	const handleRerollItem = (c: ItemCategory, i: number | undefined) => {
		if (typeof i === "undefined") return;

		const newBuildMap = generator.rerollItem(c, i);

		if (typeof newBuildMap === "undefined") {
			toast.error("Could not reroll item");
			return;
		}

		const newUrl = generator.createUrlFromBuildMap(newBuildMap);

		navigate(`../${newUrl}`, { replace: true });
		setBuild(generator.generateBuildFromUrl(newUrl));
	};

	const handleChangeNumItems = (c: ItemCategory, numItems: number) => {
		generator.setNumItems(c, numItems);
	};

	const handleSetIncludeSote = () => {
		setIncludeSote(!includeSote);
	};

	React.useEffect(() => {
		generator._buildGenerationConfig.includeDlc = includeSote;
	}, [includeSote]);

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
		function handleResize() {
			setWidth(window.innerWidth);
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<ErrorBoundary fallback={<h1>Something went wrong</h1>}>
			<div className="App px-14 pb-8">
				<div className="flex flex-col xl:flex-row w-full justify-evenly items-center gap-5 sm:p-10">
					<div className="xl:w-1/3 flex justify-center gap-2 items-center mt-3 lg:mt-0">
						<Checkbox checked={includeSote} onCheckedChange={handleSetIncludeSote} />
						<h1 className="text-sm lg:text-md xl:text-lg w-full xl:w-auto text-center">
							{width < 334 ? "Include Shadow of the Erdtree" : "Include Shadow of the Erdree Items"}
						</h1>
					</div>
					<div className="flex justify-center items-center w-1/3">
						<button className="btn btn-lg btn-primary" onClick={handleReroll}>
							<h1>Generate New Build</h1>
						</button>
					</div>
					<div className="flex justify-center items-center w-1/3 mr-0 xl:mr-6">
						<button onClick={copyUrl} className="btn btn-lg">
							{copied ? <LuCopyCheck /> : <IoCopyOutline />}
							Copy Build URL
						</button>
					</div>
				</div>
				<div className="flex justify-center items-center max-w-full">
					{/* <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 "> */}
					<div className="grid grid-cols-1 sm:grid-cols-2 2lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 2.5xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 gap-4 auto-cols-auto">
						{build &&
							[...build.keys()].map((c: ItemCategory, i: number) => (
								<>
									{/* TODO: fix this garbage */}
									{!ArmorCategories.has(c) && (
										<CardColumn
											key={i}
											items={build.get(c) ?? []}
											reroll={handleRerollItem}
											setNumItems={handleChangeNumItems}
											isAIBuild={false}
											category={c}
											regenerateCategory={generator.generateItemsForCategory}
										/>
									)}
									{c === ItemCategory.Helm && (
										<CardColumn
											key={i}
											items={armors}
											reroll={handleRerollItem}
											setNumItems={handleChangeNumItems}
											isAIBuild={false}
											category={c}
											regenerateCategory={generator.generateItemsForCategory}
										/>
									)}
								</>
							))}
					</div>
				</div>
			</div>
		</ErrorBoundary>
	);
}
