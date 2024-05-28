import "./App.css";
import BuildGenerator from "./classes/Item";
import { Build } from "./classes/Item";
function App() {
	const generator = new BuildGenerator();
	generator._includePreviouslyRolled = true;
	const url = generator.generateUrl();
	const build = new Build();
	build.createBuildFromUrl(url);

	return <div></div>;
}

export default App;
