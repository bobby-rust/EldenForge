import * as React from "react";

export default function ItemDashboard() {
	const [value, setValue] = React.useState("");

	React.useEffect(() => {
		console.log("Value: ", value);
	}, [value]);

	return (
		<div className="flex flex-col items-center min-h-[83vh] px-14 pt-8">
			<div className="flex">
				<h1 className="flex justify-center items-center">Item Dashboard</h1>
				<section className="flex justify-center items-center">
					<label className="input input-bordered flex items-center gap-2">
						<input
							type="text"
							className="grow"
							placeholder="Search"
							value={value}
							onChange={(e) => setValue(e.target.value)}
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							className="h-4 w-4 opacity-70"
						>
							<path
								fillRule="evenodd"
								d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
								clipRule="evenodd"
							/>
						</svg>
					</label>
				</section>
			</div>
		</div>
	);
}
