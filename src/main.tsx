import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Build from "./components/Build.tsx";
import AIBuild from "./components/AIBuild.tsx";
import AIApp from "./components/AIApp.tsx";
import Navbar from "./components/Navbar.tsx";
import { ThemeProvider } from "./components/ThemeProvider.tsx";

const Err = () => (
	<div className="flex justify-center items-center h-screen">
		<div className="text-6xl">404 Not Found - Put these foolish ambitions to rest.</div>
	</div>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
	// <React.StrictMode>
	// <RouterProvider router={router} />
	<BrowserRouter>
		<ThemeProvider>
			<Navbar />
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/ai" element={<AIApp />} />
				<Route path="/ai/:buildUrl" element={<AIBuild />} />
				<Route path="/:buildUrl" element={<Build />} />
				<Route path="/*" element={<Err />} />
			</Routes>
		</ThemeProvider>
	</BrowserRouter>
	// </React.StrictMode>
);
