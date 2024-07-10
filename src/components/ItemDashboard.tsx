// import React from "react";
// import data from "../data/data.json";
// import Card from "./Card";

// const items = [
// 	data["weapons"]["items"][0],
// 	data["weapons"]["items"][1],
// 	data["weapons"]["items"][2],
// 	data["weapons"]["items"][3],
// 	data["weapons"]["items"][4],
// 	data["weapons"]["items"][5],
// 	data["weapons"]["items"][6],
// 	data["weapons"]["items"][7],
// 	data["weapons"]["items"][8],
// ];

// export default function ItemDashboard() {
// 	const [value, setValue] = React.useState("");

// 	React.useEffect(() => {
// 		console.log("Value: ", value);
// 	}, [value]);

// 	return (
// 		<div className="flex flex-col items-center min-h-[83vh] px-14 pt-3">
// 			<div className="flex flex-col w-fit">
// 				<div className="w-72 p-3">
// 					<label className="input input-bordered flex items-center gap-2">
// 						<input
// 							type="text"
// 							className="grow"
// 							placeholder="Search"
// 							value={value}
// 							onChange={(e) => setValue(e.target.value)}
// 						/>
// 						<svg
// 							xmlns="http://www.w3.org/2000/svg"
// 							viewBox="0 0 16 16"
// 							fill="currentColor"
// 							className="h-4 w-4 opacity-70"
// 						>
// 							<path
// 								fillRule="evenodd"
// 								d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
// 								clipRule="evenodd"
// 							/>
// 						</svg>
// 					</label>
// 				</div>
// 				<div className="flex justify-center items-center">
// 					<div className="grid col-span-1 grid-cols-1 sm:grid-cols-2 2lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 2.5xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 gap-0">
// 						{items.map((item: any) => (
// 							<Card key={item.index} item={item} reroll={null} isAIBuild={false} />
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
