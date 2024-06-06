import "./App.css";
import React from "react";
import BuildGenerator from "./classes/BuildGenerator";
// tbh ngl idk not really sure how to do this without using a global (help)
const generator = new BuildGenerator();

import { useNavigate } from "react-router-dom";

const App = () => {
	const navigate = useNavigate();

	React.useEffect(() => {
		navigate("/" + generator.generateUrl(), { replace: true });
	}, []);

	return null;
};

export default App;
