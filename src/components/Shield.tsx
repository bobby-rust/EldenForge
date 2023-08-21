import { v4 } from "uuid";
import { BuildItem, BuildProps } from "../types/ItemTypes";
import Item from "./Item";
import { memo } from "react";

const Shields = (props: BuildProps) => {
    return (
        <>
            <h6>Shields</h6>
            {props.build["shields"].map((shield: BuildItem) => {
                return (
                    <Item
                        item={shield}
                        color={props.color}
                        key={v4()}
                        size={props.size}
                        buildDispatch={() =>
                            props.buildDispatch({
                                id: shield.id,
                                type: "SHIELDS",
                            })
                        }
                    />
                );
            })}
        </>
    );
};

export default Shields;
