import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Build from "./components/Build.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/:buildUrl",
		element: <Build />,
	},
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
	// <React.StrictMode>
	<RouterProvider router={router} />
	// </React.StrictMode>
);
