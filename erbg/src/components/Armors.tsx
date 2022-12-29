import Item from "./Item";
import { v4 } from "uuid";
import { BuildProps, BuildItem } from "../types/ItemTypes";
import { memo } from "react";

const Armors = memo((props: BuildProps) => {
    // TODO: get the first word of the build category from the category string

    return (
        <>
            {props.build["armor"].map((currArmor: BuildItem) => {
                const catTmp: string = currArmor.category;
                console.log(catTmp);
                // console.log(typeof category);
                const categoryArr = catTmp.split(" ");
                let catTmp2 = categoryArr[0].toUpperCase();
                if (catTmp2 === "GAUNTLET") {
                    catTmp2 = "GAUNTLETS";
                }

                const category = "ARMOR." + catTmp2;
                console.log(category);
                return (
                    <Item
                        key={v4()}
                        item={currArmor}
                        color={props.color}
                        size={props.size}
                        buildDispatch={() =>
                            props.buildDispatch({
                                id: currArmor.id,
                                type: category,
                            })
                        }
                    />
                );
            })}
        </>
    );
});

export default Armors;
