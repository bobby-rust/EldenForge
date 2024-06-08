import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Build from "./components/Build.tsx";

const Err = () => (
	<div className="flex justify-center items-center h-screen">
		<div className="text-6xl">404 Not Found - Put these foolish ambitions to rest.</div>
	</div>
);

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/:buildUrl",
		element: <Build />,
		errorElement: <Err />,
	},
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
	// <React.StrictMode>
	<RouterProvider router={router} />
	// </React.StrictMode>
);
