import getArmor from "./getArmor";
import getAshes from "./getAshes";
import getIncants from "./getIncants";
import getShields from "./getShields";
import getSorcs from "./getSorcs";
import getSpirits from "./getSpirits";
import getTalismans from "./getTalismans";
import getWeapons from "./getWeapons";
import getClass from "./getClass";
import { BuildItem } from "../types/ItemTypes";

function generateRandomBuild(
    t_weapons: number,
    t_ashes: number,
    t_incants: number,
    t_sorcs: number,
    t_spirits: number,
    t_talismans: number,
    t_shields: number,
    includePreviouslyRolled: any
) {
    /**
     * To include previously rolled, clear sessionStorage and do not save the rolled items to sessionStorage,
     * T exclude previously rolled, save each rolled item in sessionStorage and compare the items in sessionStorage with
     * the items rolled, and reroll if any of them are the same
     *
     * Defaults to false, so sessionStorage state gets set with the build generated.
     * A new build is rolled, and that build is compared to the one in sessionStorage for any duplicates
     * If there is duplicates, reroll that item.
     *
     */

    // So, let's grab sessionStorage here, and pass it as parameter to each get item function,
    // SO we need to pass includePreviouslyRolled boolean for each category to its respective getter function,
    // and if we want to include previously rolled for that function, set sessionStorage to empty array.
    // we only need to save the ids in sessionStorage.

    // We can pass as parameter number of each item to generate.
    // default to 16 total
    const build = {
        weapons: getWeapons(
            t_weapons,
            includePreviouslyRolled.weapons
            // parsedPreviouslyRolledData.weapons
        ),
        armor: getArmor(includePreviouslyRolled.armors),
        ashes: getAshes(t_ashes, includePreviouslyRolled.ashes),
        incants: getIncants(t_incants, includePreviouslyRolled.incantations),
        shields: getShields(t_shields, includePreviouslyRolled.shields),
        sorcs: getSorcs(t_sorcs, includePreviouslyRolled.sorceries),
        spirits: getSpirits(t_spirits, includePreviouslyRolled.spirits),
        talis: getTalismans(t_talismans, includePreviouslyRolled.talismans),
        starting_class: getClass(),
        // rerollItem: rerollItem,
    };

    // Down here, we should update sessionStorage by adding all new items to the sessionStorage object

    return build;
}

function createNewBuild(oldState: any, id: string, newItem: BuildItem, category: string) {
    const newState = structuredClone(oldState);
    let cat: string[] = category.split(".");
    let type = cat[0];
    newState[type] = [];
    let replacedItem = false;
    for (let i = 0; i < oldState[type].length; i++) {
        if (oldState[type][i].id === id) {
            if (!replacedItem) {
                newState[type].push(newItem);
                replacedItem = true;
            } else {
                newState[type].push(oldState[type][i]);
            }
        } else {
            newState[type].push(oldState[type][i]);
        }
    }
    return newState;
}

function getNewItem(t_id: string, state: any, type: string, includePreviouslyRolled: any) {
    switch (type) {
        case "ARMOR.HELM":
            const newHead = getArmor("HELM");
            const newHeadBuild = createNewBuild(state, t_id, newHead[0], type.toLowerCase());
            return newHeadBuild;
        case "ARMOR.CHEST":
            const newChest = getArmor("CHEST");
            const newChestBuild = createNewBuild(state, t_id, newChest[0], type.toLowerCase());
            return newChestBuild;
        case "ARMOR.GAUNTLETS":
            const newGauntlets = getArmor("GAUNTLETS");
            const newGauntletsBuild = createNewBuild(
                state,
                t_id,
                newGauntlets[0],
                type.toLowerCase()
            );
            return newGauntletsBuild;
        case "ARMOR.LEG":
            const newLegs = getArmor("LEG");
            const newLegsBuild = createNewBuild(state, t_id, newLegs[0], type.toLowerCase());
            return newLegsBuild;
        case "WEAPONS":
            const newWeapon = getWeapons(
                1,
                includePreviouslyRolled.weapons
                // parsedPreviouslyRolledData.weapons
            );
            if (newWeapon) {
                const newStateWep = createNewBuild(state, t_id, newWeapon[0], type.toLowerCase());
                return newStateWep;
            } else {
                return;
            }
        case "ASHES":
            const newAsh = getAshes(1, includePreviouslyRolled.ashes);
            const newStateAsh = createNewBuild(state, t_id, newAsh[0], type.toLowerCase());
            return newStateAsh;
        case "INCANTS":
            const newIncant = getIncants(1, includePreviouslyRolled.incantations);
            const newStateInc = createNewBuild(state, t_id, newIncant[0], type.toLowerCase());
            return newStateInc;
        case "SORCS":
            const newSorc = getSorcs(1, includePreviouslyRolled.sorceries);
            const newStateSorc = createNewBuild(state, t_id, newSorc[0], type.toLowerCase());
            return newStateSorc;
        case "SPIRITS":
            const newSpirit = getSpirits(1, includePreviouslyRolled.spirits);
            if (newSpirit) {
                const newStateSp = createNewBuild(state, t_id, newSpirit[0], type.toLowerCase());
                return newStateSp;
            } else {
                return;
            }
        case "TALIS":
            const newTalis = getTalismans(1, includePreviouslyRolled.talismans);
            const newStateTalis = createNewBuild(state, t_id, newTalis[0], type.toLowerCase());
            return newStateTalis;
        case "SHIELDS":
            const newShield = getShields(1, includePreviouslyRolled.shields);
            const newStateSh = createNewBuild(state, t_id, newShield[0], type.toLowerCase());
            return newStateSh;
        default:
            return state;
    }
}

export { generateRandomBuild, getNewItem };
