import getArmor from "./getArmor";
import getAshes from "./getAshes";
import getIncants from "./getIncants";
import getShields from "./getShields";
import getSorcs from "./getSorcs";
import getSpirits from "./getSpirits";
import getTalismans from "./getTalismans";
import getWeapons from "./getWeapons";
import getClass from "./getClass";
import { BuildItem, VALID_BUILD_ITEM_CATEGORIES } from "../types/ItemTypes";

function generateRandomBuild(
    t_weapons: number,
    t_ashes: number,
    t_incants: number,
    t_sorcs: number,
    t_spirits: number,
    t_talismans: number,
    t_shields: number
) {
    // We can pass as parameter number of each item to generate.
    // default to 16 total
    const build = {
        weapons: getWeapons(t_weapons),
        armor: getArmor(),
        ashes: getAshes(t_ashes),
        incants: getIncants(t_incants),
        shields: getShields(t_shields),
        sorcs: getSorcs(t_sorcs),
        spirits: getSpirits(t_spirits),
        talis: getTalismans(t_talismans),
        starting_class: getClass(),
        // rerollItem: rerollItem,
    };

    return build;
}

function createNewBuild(
    oldState: any,
    id: string,
    newItem: BuildItem,
    category: string
) {
    const newState = structuredClone(oldState);
    // var newState = Object.assign({}, oldState);
    newState[category] = [];
    oldState[category].map((item: BuildItem) => {
        if (item.id === id) {
            newState[category].push(newItem);
        } else {
            newState[category].push(item);
        }
    });
    return newState;
}

function getNewItem(t_id: string, state: any, type: string) {
    switch (type) {
        case "WEAPONS":
            const newWeapon = getWeapons(1);
            const newStateWep = createNewBuild(
                state,
                t_id,
                newWeapon[0],
                type.toLowerCase()
            );
            return newStateWep;
        // TODO: Implement armor reroll.
        case "ASHES":
            const newAsh = getAshes(1);
            const newStateAsh = createNewBuild(
                state,
                t_id,
                newAsh[0],
                type.toLowerCase()
            );
            return newStateAsh;
        case "INCANTS":
            const newIncant = getIncants(1);
            const newStateInc = createNewBuild(
                state,
                t_id,
                newIncant[0],
                type.toLowerCase()
            );
            return newStateInc;
        case "SORCS":
            const newSorc = getSorcs(1);
            const newStateSorc = createNewBuild(
                state,
                t_id,
                newSorc[0],
                type.toLowerCase()
            );
            return newStateSorc;
        case "SPIRITS":
            const newSpirit = getSpirits(1);
            const newStateSp = createNewBuild(
                state,
                t_id,
                newSpirit[0],
                type.toLowerCase()
            );
            return newStateSp;
        case "TALIS":
            const newTalis = getTalismans(1);
            const newStateTalis = createNewBuild(
                state,
                t_id,
                newTalis[0],
                type.toLowerCase()
            );
            return newStateTalis;
        case "SHIELDS":
            const newShield = getShields(1);
            const newStateSh = createNewBuild(
                state,
                t_id,
                newShield[0],
                type.toLowerCase()
            );
            return newStateSh;
        default:
            return state;
    }
}

export { generateRandomBuild, getNewItem };
