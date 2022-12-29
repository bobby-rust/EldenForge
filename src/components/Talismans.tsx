import Item from "./Item";
import { v4 } from "uuid";
import { BuildProps, BuildItem } from "../types/ItemTypes";
import { memo } from "react";

const Talismans = memo((props: BuildProps) => {
    return (
        <>
            <h6>Talismans</h6>
            {props.build["talis"].map((talisman: BuildItem) => {
                return (
                    <Item
                        item={talisman}
                        color={props.color}
                        key={v4()}
                        size={props.size}
                        buildDispatch={() =>
                            props.buildDispatch({
                                id: talisman.id,
                                type: "TALIS",
                            })
                        }
                    />
                );
            })}
        </>
    );
});

export default Talismans;
