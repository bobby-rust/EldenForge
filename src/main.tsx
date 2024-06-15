import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Build from "./components/Build";
import AIBuild from "./components/AIBuild";
import AIApp from "./components/AIApp";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/ThemeProvider";

const Err = () => (
	<div className="flex justify-center items-center h-screen">
		<div className="text-6xl">404 Not Found - Put these foolish ambitions to rest.</div>
	</div>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
	// <React.StrictMode>
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
