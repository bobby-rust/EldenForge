import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AIApp from "./components/AI";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import Footer from "./components/Footer";
import BuildGenerator from "./classes/BuildGenerator";
// import ItemDashboard from "./components/ItemDashboard";

const Err = () => (
	<div className="flex justify-center items-center h-screen">
		<div className="text-6xl">
			404 Not Found<br></br>
			<p className="text-4xl italic text-slate-700">
				"Put these foolish ambitions to rest."<br></br>- Margit, The Fell Omen
			</p>
		</div>
	</div>
);

const generator = new BuildGenerator();

ReactDOM.createRoot(document.getElementById("root")!).render(
	// <React.StrictMode>
	<BrowserRouter>
		<ThemeProvider>
			<Navbar generator={generator} />
			<Routes>
				<Route path="/ai/:buildUrl" element={<AIApp />} />
				<Route path="/ai" element={<AIApp />} />
				{/* <Route path="/item-dashboard" element={<ItemDashboard />} /> */}
				<Route path="/:buildUrl" element={<App generator={generator} />} />
				<Route path="/" element={<App generator={generator} />} />
				<Route path="*" element={<Err />} />
			</Routes>
			<Footer />
			<Toaster />
		</ThemeProvider>
	</BrowserRouter>
	// </React.StrictMode>
);
