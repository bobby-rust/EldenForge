import React from "react";
import { Item } from "../classes/Item";
import { ItemCategory } from "../types/enums";
import { GiBroadsword, GiWeight } from "react-icons/gi";
import { TbDropletDown } from "react-icons/tb";

/**
 * Renders a Card component based on the item data passed as props.
 *
 * @param {Item} item - The item object containing information for the card.
 * @param {Function | null} reroll - A function to reroll the item or null if not available.
 * @param {boolean} isAIBuild - Boolean flag indicating if it's an AI build.
 * @return {JSX.Element} The Card component JSX to be rendered.
 */
export default function Card(props: {
    item: Item;
    reroll: ((c: ItemCategory, i: number) => void) | null;
    isAIBuild: boolean;
}) {
    const [loading, setLoading] = React.useState(true);
    if (props.item.category === ItemCategory.Classes) return null;

    /**
     * The name of every ash of war starts with 'Ash Of War: ' except for 'Lost Ashes' and 'Through and Through'
     */
    let name = props.item.name;
    const nameArr = props.item.name.split(" ");
    if (
        props.item.category === ItemCategory.Ashes &&
        nameArr[0] !== "Lost" &&
        nameArr[0] !== "Through"
    ) {
        name = props.item.name.split("Ash Of War: ")[1];
        if (!name) name = props.item.name.split("Ash of War: ")[1]; // There are a couple inconsistencies where the 'o' is not capitalized
    }

    // TODO: compress / downscale images for better rendering performance
    return (
        <>
            <div className="flex text-sm flex-col w-60 h-60 shadow-xl m-3 rounded-lg bg-black bg-opacity-5">
                <div className="relative h-full p-3">
                    <a
                        href={`${props.item.wikiUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex hover:underline"
                    >
                        {/* ----- Image ----- */}
                        <figure
                            className={`${loading ? "flex justify-center align-center h-[100px] w-[100px]" : ""} w-[50%]`}
                        >
                            <img
                                height={100}
                                width={100}
                                src={`${props.item.image}`}
                                alt={`${props.item.name}`}
                                onLoad={() => setLoading(false)}
                                className={`${loading ? "loading loading-spinner loading-lg" : ""} rounded-xl`}
                            />
                        </figure>

                        {/* ----- Card title ----- */}
                        <div className="flex justify-center w-[50%]">
                            <h6 className="text-[18px] font-semibold overflow-hidden whitespace-pre-wrap">
                                {name}
                            </h6>
                        </div>

                        {/* ----- Armor ----- */}
                        {(props.item.dmgNegation || props.item.resistance) && (
                            <div className="absolute inset-0 rounded-x-lg rounded-t-lg bg-black bg-opacity-80 flex justify-center items-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <div className="flex">
                                    <div className="flex flex-col p-2">
                                        {props.item.dmgNegation && (
                                            <h1>Damage Negation</h1>
                                        )}
                                        {props.item.dmgNegation &&
                                            props.item.dmgNegation.map(
                                                (obj: any, i: number) => {
                                                    return (
                                                        <div key={i}>
                                                            <div className="tracking-wide">
                                                                {obj.name}:{" "}
                                                                {obj.amount}
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )}
                                    </div>
                                    <div className="flex flex-col p-2">
                                        {props.item.resistance && (
                                            <h1>Resistance</h1>
                                        )}
                                        {props.item.resistance &&
                                            props.item.resistance.map(
                                                (obj: any, i: number) => {
                                                    return (
                                                        <div
                                                            className="tracking-wide"
                                                            key={i}
                                                        >
                                                            {obj.name}:{" "}
                                                            {obj.amount}
                                                        </div>
                                                    );
                                                },
                                            )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </a>

                    {/* ----- Sorceries / Incantations ----- */}
                    <div className="flex overflow-hidden">
                        {(props.item.category === ItemCategory.Sorcs ||
                            props.item.category === ItemCategory.Incants) && (
                                <div className="flex flex-col [&>div]:mt-1">
                                    <div className="flex">
                                        <TbDropletDown size="20" className="mr-1" />
                                        <span>Cost: {props.item.spellCost}</span>
                                    </div>
                                    <div className="flex">
                                        <div className="h-[20px] w-[20px]">
                                            <GiBroadsword
                                                size={20}
                                                className="mr-1"
                                            />
                                        </div>
                                        <span className="line-clamp-2">
                                            Effects: {props.item.effects}
                                        </span>
                                    </div>
                                </div>
                            )}

                        {/* ----- Talismans ----- */}
                        {props.item.category === ItemCategory.Talismans && (
                            <div className="flex mt-1">
                                <GiBroadsword size={20} className="mr-1" />
                                <span className="line-clamp-2">
                                    Effects: {props.item.effects}
                                </span>
                            </div>
                        )}

                        {/* ----- Weapons ----- */}
                        {props.item.category === ItemCategory.Weapons && (
                            <div className="flex m-1">
                                <GiBroadsword size="20" className="mr-1" />
                                <span>{props.item.weaponCategory}</span>
                            </div>
                        )}

                        {/* ----- Ashes ----- */}
                        {props.item.category === ItemCategory.Ashes && (
                            <div>
                                <div className="flex m-1">
                                    <GiBroadsword size="20" className="mr-1" />
                                    <span>{props.item.affinity}</span>
                                </div>
                            </div>
                        )}

                        {/* ----- Tears ----- */}
                        {props.item.category === ItemCategory.Tears && (
                            <div>
                                <div className="flex m-1">
                                    <GiBroadsword size="20" className="mr-1" />
                                    <span>{props.item.description}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ----- Weight ----- */}
                    {typeof props.item.weight !== "undefined" && (
                        <div className="flex m-1">
                            <GiWeight size="20" />
                            Weight: {props.item.weight}
                        </div>
                    )}
                </div>

                {/* ----- Card footer ----- */}
                <div className="flex flex-col justify-center items-center text-center w-full bg-secondary rounded-b-lg">
                    <div className="w-full h-10 flex justify-end items-center p-2">
                        {!props.isAIBuild && (
                            <button
                                onClick={() =>
                                    props.reroll?.(
                                        props.item.category,
                                        props.item.index,
                                    )
                                }
                                className="btn btn-primary btn-sm h-6 min-h-6"
                            >
                                Reroll Item
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
