import React, { memo } from "react";
import { BuildItem } from "../types/ItemTypes";
import "../styles/chatGPTStyles.css";
import "../App.css";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

type ItemProps = {
    item: BuildItem;
    buildDispatch: any;
    color: string;
    size: string;
};

const BOX_THEME = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "10px",
    padding: "5px",
    height: "10rem",
    "@media (min-width:0px)": {
        width: "40vw",
    },
    "@media (min-width:900px)": {
        width: "100%",
    },
};

const Item = (props: ItemProps) => {
    /**
     * This is a generic component
     * Any styling on this component should remain generic
     * i.e. NOT specific to any layout or theme
     */

    return (
        // <div className="build-item">
        <Box sx={BOX_THEME}>
            <span className="item-name">{props.item.name}</span>
            <a
                href={`https://eldenring.wiki.fextralife.com/${props.item.name.replaceAll(
                    " ",
                    "+"
                )}`}
                rel="noreferrer"
                target="_blank"
            >
                <img className="item-img" src={props.item.image} alt={props.item.name + " img"} />
            </a>
            <Button
                sx={{
                    height: "2rem",
                    fontSize: "12px",
                    width: "6rem",
                    color: "#ef8b09",
                }}
                size="small"
                onClick={props.buildDispatch}
            >
                Reroll Item
            </Button>
        </Box>
    );
};

export default Item;
