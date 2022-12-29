import Item from "./Item";
import { v4 } from "uuid";
import { BuildItem, BuildProps } from "../types/ItemTypes";
import { memo } from "react";
const Incantations = memo((props: BuildProps) => {
    return (
        <>
            <h6>Incantations</h6>
            {props.build["incants"].map((incant: BuildItem) => {
                return (
                    <Item
                        item={incant}
                        color={props.color}
                        key={v4()}
                        size={props.size}
                        buildDispatch={() =>
                            props.buildDispatch({
                                id: incant.id,
                                type: "INCANTS",
                            })
                        }
                    />
                );
            })}
        </>
    );
});

export default Incantations;
