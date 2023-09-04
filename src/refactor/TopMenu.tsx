import { useEffect, useState } from "react";
import TopMenuLarge from "./TopMenuLarge";
import TopMenuSmall from "./TopMenuSmall";

const IMG_THEME = {
    height: "60px",
    width: "auto",
};

export default function TopMenu(props: any) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        // Function to update window width state
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Add event listener for window resize
        window.addEventListener("resize", handleResize);

        // Clean up event listener when component unmounts
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            {windowWidth > 900 ? (
                <TopMenuLarge
                    includePreviouslyRolled={props.includePreviouslyRolled}
                    setIncludePreviouslyRolled={props.setIncludePreviouslyRolled}
                    IMG_THEME={IMG_THEME}
                    buildDispatch={props.buildDispatch}
                />
            ) : (
                <TopMenuSmall
                    includePreviouslyRolled={props.includePreviouslyRolled}
                    setIncludePreviouslyRolled={props.setIncludePreviouslyRolled}
                    IMG_THEME={IMG_THEME}
                    buildDispatch={props.buildDispatch}
                />
            )}
        </>
    );
}
