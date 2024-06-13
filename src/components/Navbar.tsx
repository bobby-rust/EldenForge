import React, { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";
import { useNavigate } from "react-router-dom";
import NavbarMenu from "./NavbarMenu";

export default function Navbar() {
	const [isMobile, setIsMobile] = React.useState<boolean>(window.innerWidth < 768);

	const themeContext = useContext(ThemeContext);
	if (!themeContext) {
		throw new Error("ThemeContext is undefined");
	}
	const { theme, setTheme } = themeContext;

	React.useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const navigate = useNavigate();

	React.useEffect(() => {
		console.log("Mobile is: ", isMobile);
	}, [isMobile]);
	return (
		<div className="drawer z-10">
			<input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col">
				{/* Navbar */}
				<div className="w-full navbar bg-base-300">
					<div className="flex-none lg:hidden">
						<label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								className="inline-block w-6 h-6 stroke-current"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
							</svg>
						</label>
					</div>
					<div className="flex-1 px-2 mx-2 text-2xl font-semibold">EldenForge</div>
					<div className="flex-none hidden lg:block">
						<ul className="menu menu-horizontal">
							{/* Navbar menu content here */}
							<NavbarMenu theme={theme} setTheme={setTheme} />
						</ul>
					</div>
				</div>
			</div>
			<div className="drawer-side">
				<label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
				<ul className="menu p-4 w-80 min-h-full bg-base-200">
					{/* Sidebar content here */}
					<NavbarMenu theme={theme} setTheme={setTheme} />
				</ul>
			</div>
		</div>
	);
}
