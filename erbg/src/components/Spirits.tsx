import Item from "./Item";
import { v4 } from "uuid";
import { BuildItem, BuildProps } from "../types/ItemTypes";
import { memo } from "react";

const Spirits = memo((props: BuildProps) => {
    return (
        <>
            {/* <h2>Spirits</h2> */}
            {props.items.map((spirit: BuildItem) => {
                return (
                    <Item
                        item={spirit}
                        color={props.color}
                        key={v4()}
                        size={props.size}
                        buildDispatch={() =>
                            props.buildDispatch(
                                spirit.id,
                                props.items,
                                "SPIRITS"
                            )
                        }
                    />
                );
            })}
        </>
    );
});

export default Spirits;
