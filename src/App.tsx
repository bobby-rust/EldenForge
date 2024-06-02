import "./App.css";
import BuildGenerator from "./classes/BuildGenerator";

function App() {
	const generator = new BuildGenerator();

	const url = generator.generateUrl();
	console.log("Got url: ", url);

	const build = generator.generateBuildFromUrl(url);
	// console.log("Got build from URL: ", build);
	return <div></div>;
}

export default App;
