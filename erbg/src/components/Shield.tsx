import { v4 } from "uuid";
import { BuildItem, BuildProps } from "../types/ItemTypes";
import Item from "./Item";
import { memo } from "react";

const Shields = memo((props: BuildProps) => {
    return (
        <div>
            <h1>Shield</h1>
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
        </div>
    );
});

export default Shields;
