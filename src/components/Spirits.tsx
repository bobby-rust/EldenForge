import Item from "./Item";
import { v4 } from "uuid";
import { BuildItem, BuildProps } from "../types/ItemTypes";
import { memo } from "react";

const Spirits = (props: BuildProps) => {
    return (
        <>
            <h6>Spirit Ashes</h6>
            {props.build["spirits"].map((spirit: BuildItem) => {
                return (
                    <Item
                        item={spirit}
                        color={props.color}
                        key={v4()}
                        size={props.size}
                        buildDispatch={() =>
                            props.buildDispatch({
                                id: spirit.id,
                                type: "SPIRITS",
                            })
                        }
                    />
                );
            })}
        </>
    );
};

export default Spirits;
