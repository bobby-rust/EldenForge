export const Footer = () => {
    enum TextAlign {
        Left = "left",
        Center = "center",
        Right = "right",
    }

    const pStyles = {
        marginLeft: "10px",
        marginRight: "10px",
        fontFamily: "Montserrat, Ubuntu, sans-serif",
        textAlign: TextAlign.Center, // ...not sure why typescript feels that this is necessary but ok
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };

    const mediaQueries = {
        "@media (max-width: 480px)": {
            fontSize: "1rem",
        },
        "@media (max-width: 768px)": {
            fontSize: "14px",
        },
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", maxWidth: "90vw", ...mediaQueries, borderTop: "1px solid rgba(0, 0, 0, 0.2)", boxShadow: "0px 4px 4px 2px rgba(0, 0, 0, 0.2)", }}>

                <p style={{ ...pStyles }}>
                    I would love to hear your feedback. You can submit an issue or feature request &nbsp;
                    <a href="https://github.com/bobby-rust/erbg/issues" target="_blank" rel="noreferrer">
                        here
                    </a>.
                </p>
            </div>
        </div>
    );
};
