import { v4 } from "uuid";
import { memo } from "react";
import Item from "./Item";
import { BuildProps, BuildItem } from "../types/ItemTypes";

const Sorceries = (props: BuildProps) => {
    return (
        <>
            <h6>Sorceries</h6>
            {props.build["sorceries"].map((sorc: BuildItem) => {
                return (
                    <Item
                        item={sorc}
                        color={props.color}
                        key={v4()}
                        size={props.size}
                        buildDispatch={() =>
                            props.buildDispatch({
                                id: sorc.id,
                                type: "SORCS",
                            })
                        }
                    />
                );
            })}
        </>
    );
};

export default Sorceries;
