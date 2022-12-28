import Item from "./Item";
import { v4 } from "uuid";
import { BuildProps, BuildItem } from "../types/ItemTypes";
import { memo } from "react";

const Armors = memo((props: BuildProps) => {
    return (
        <>
            {props.items.map((currArmor: BuildItem) => {
                return (
                    <Item
                        key={v4()}
                        item={currArmor}
                        color={props.color}
                        size={props.size}
                        buildDispatch={() =>
                            props.buildDispatch(
                                currArmor.id,
                                props.items,
                                "ARMOR"
                            )
                        }
                    />
                );
            })}
        </>
    );
});

export default Armors;
