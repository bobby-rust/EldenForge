import React from "react";
import { useNavigate } from "react-router-dom";

export default function AIApp() {
	const navigate = useNavigate();
	React.useEffect(() => {
		navigate("/ai/" + "abc123", { replace: true });
	}, []);
	return <div>AIApp</div>;
}
