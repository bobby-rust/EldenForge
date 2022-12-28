import Item from "./Item";
import { v4 } from "uuid";
import { BuildProps, BuildItem } from "../types/ItemTypes";
import { memo } from "react";

const Weapons = memo((props: BuildProps) => {
    return (
        <>
            {props.build["weapons"].map((weapon: BuildItem) => {
                return (
                    <Item
                        item={weapon}
                        color={props.color}
                        key={v4()}
                        size={props.size}
                        buildDispatch={() =>
                            props.buildDispatch({
                                id: weapon.id,
                                type: "WEAPONS",
                            })
                        }
                    />
                );
            })}
        </>
    );
});

export default Weapons;
