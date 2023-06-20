import React, { memo } from "react";
import { BuildItem } from "../types/ItemTypes";
import "../styles/chatGPTStyles.css";
import "../App.css";
import Button from "@mui/material/Button";

type ItemProps = {
  item: BuildItem;
  buildDispatch: any;
  color: string;
  size: string;
};

const Item = memo((props: ItemProps) => {
  // const loadImage = (dataUrl: any) => {
  //     return new Promise<void>((resolve, reject) => {
  //         const imageElement = document.querySelector("img");
  //         if (!imageElement) {
  //             return;
  //         }
  //         imageElement.src = dataUrl;
  //         resolve();
  //     });
  // };

  // Declare a state variable for the loading state
  // const [isLoading, setIsLoading] = React.useState(false);

  // Declare a function to handle the button press
  // const handleButtonPress = (e: any) => {
  //     props.buildDispatch();
  //     // Set the loading state to true
  //     setIsLoading(true);
  //     // Perform the image loading operation
  //     loadImage(props.item.image).then(() => {
  //         // Set the loading state to false when the image is finished loading
  //         setIsLoading(false);
  //     });
  // };
  /**
   * This is a generic component
   * Any styling on this component should remain generic
   * i.e. NOT specific to any layout or theme
   */

  return (
    <div className="build-item">
      <span className="item-name">{props.item.name}</span>
      <a
        href={`https://eldenring.wiki.fextralife.com/${props.item.name.replaceAll(
          " ",
          "+"
        )}`}
        rel="noreferrer"
        target="_blank"
      >
        <img
          className="item-img"
          src={props.item.image}
          alt={props.item.name + " img"}
          // loading='lazy'
        />
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
      {/* <button className='card-button' onClick={handleButtonPress}>
                Respin
            </button> */}
      <div className="item-desc-container">
        <p className="item-desc">{props.item.description}</p>
      </div>
    </div>
  );
});

export default Item;
