import getArmor from "./getArmor";
import getAshes from "./getAshes";
import getIncants from "./getIncants";
import getShields from "./getShields";
import getSorcs from "./getSorcs";
import getSpirits from "./getSpirits";
import getTalismans from "./getTalismans";
import getWeapons from "./getWeapons";
import getClass from "./getClass";
import {
    ArmorDataObject,
    AshesDataObject,
    BuildItem,
    ClassDataObject,
    IncludePreviouslyRolled,
    RolledItems,
    SorcsIncantsDataObject,
    SpiritsDataObject,
    TalismansDataObject,
    WeaponsShieldsDataObject,
} from "../types/ItemTypes";

function generateRandomBuild(
    numWeapons: number,
    numAshes: number,
    numIncants: number,
    numSorcs: number,
    numSpirits: number,
    numTalismans: number,
    numShields: number,
    includePreviouslyRolled: IncludePreviouslyRolled
) {
    const rolledItemsString: string | null = sessionStorage.getItem("rolledItems");
    let rolledItems: RolledItems;
    if (rolledItemsString) {
        rolledItems = JSON.parse(rolledItemsString);
    } else {
        rolledItems = {
            weapons: [],
            // armor: [],
            ashes: [],
            incantations: [],
            shields: [],
            sorceries: [],
            spirits: [],
            talismans: [],
        };
    }

    type Build = {
        weapons: WeaponsShieldsDataObject[];
        armor: ArmorDataObject[];
        ashes: AshesDataObject[];
        incantations: SorcsIncantsDataObject[];
        shields: WeaponsShieldsDataObject[];
        sorceries: SorcsIncantsDataObject[];
        spirits: SpiritsDataObject[];
        talismans: TalismansDataObject[];
        starting_class: ClassDataObject;
        [key: string]: any;
    };

    // We can pass as parameter number of each item to generate.
    // default to 16 total
    const build: Build = {
        weapons: getWeapons(numWeapons, includePreviouslyRolled.weapons, rolledItems),
        armor: getArmor(includePreviouslyRolled.weapons, rolledItems), // Dummy value here for now `.weapons`
        ashes: getAshes(numAshes, includePreviouslyRolled.ashes, rolledItems),
        incantations: getIncants(numIncants, includePreviouslyRolled.incantations, rolledItems),
        shields: getShields(numShields, includePreviouslyRolled.shields, rolledItems),
        sorceries: getSorcs(numSorcs, includePreviouslyRolled.sorceries, rolledItems),
        spirits: getSpirits(numSpirits, includePreviouslyRolled.spirits, rolledItems),
        talismans: getTalismans(numTalismans, includePreviouslyRolled.talismans, rolledItems),
        starting_class: getClass(),
    };

    // Down here, we should update sessionStorage by adding all new items to the sessionStorage object
    let newSessionStorage: any = structuredClone(rolledItems);

    const entries = Object.entries(newSessionStorage);
    for (let i = 0; i < entries.length; ++i) {
        let key = entries[i][0];

        let value = entries[i][1];

        const currBuildValues = build[key];
        if (!currBuildValues) {
            console.log(key);
            console.log(currBuildValues);
        }
        if (Array.isArray(value)) {
            if (!includePreviouslyRolled[key]) {
                value = [...value, ...currBuildValues.map((obj: any) => obj.id)];
            }
        }

        entries[i][1] = value;
    }

    newSessionStorage = Object.fromEntries(entries);
    sessionStorage.setItem("rolledItems", JSON.stringify(newSessionStorage));
    return build;
}

function createNewBuild(oldState: any, id: string, newItem: BuildItem, category: string) {
    const newState = structuredClone(oldState);
    let cat: string[] = category.split(".");
    let type = cat[0];
    console.log(type);
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

function getNewItem(
    t_id: string,
    state: any,
    type: string,
    includePreviouslyRolled: boolean,
    rolledItems: object
) {
    switch (type) {
        case "ARMOR.HELM":
            const newHead = getArmor(includePreviouslyRolled, rolledItems, "HELM");
            const newHeadBuild = createNewBuild(state, t_id, newHead[0], type.toLowerCase());
            return newHeadBuild;
        case "ARMOR.CHEST":
            const newChest = getArmor(includePreviouslyRolled, rolledItems, "CHEST");
            const newChestBuild = createNewBuild(state, t_id, newChest[0], type.toLowerCase());
            return newChestBuild;
        case "ARMOR.GAUNTLETS":
            const newGauntlets = getArmor(includePreviouslyRolled, rolledItems, "GAUNTLETS");
            const newGauntletsBuild = createNewBuild(
                state,
                t_id,
                newGauntlets[0],
                type.toLowerCase()
            );
            return newGauntletsBuild;
        case "ARMOR.LEG":
            const newLegs = getArmor(includePreviouslyRolled, rolledItems, "LEG");
            const newLegsBuild = createNewBuild(state, t_id, newLegs[0], type.toLowerCase());
            return newLegsBuild;
        case "WEAPONS":
            const newWeapon = getWeapons(
                1,
                includePreviouslyRolled,
                rolledItems
                // parsedPreviouslyRolledData.weapons
            );
            if (newWeapon) {
                const newStateWep = createNewBuild(state, t_id, newWeapon[0], type.toLowerCase());
                return newStateWep;
            } else {
                return;
            }
        case "ASHES":
            const newAsh = getAshes(1, includePreviouslyRolled, rolledItems);
            const newStateAsh = createNewBuild(state, t_id, newAsh[0], type.toLowerCase());
            return newStateAsh;
        case "INCANTATIONS":
            const newIncant = getIncants(1, includePreviouslyRolled, rolledItems);
            const newStateInc = createNewBuild(state, t_id, newIncant[0], type.toLowerCase());
            return newStateInc;
        case "SORCERIES":
            const newSorc = getSorcs(1, includePreviouslyRolled, rolledItems);
            const newStateSorc = createNewBuild(state, t_id, newSorc[0], type.toLowerCase());
            return newStateSorc;
        case "SPIRITS":
            const newSpirit = getSpirits(1, includePreviouslyRolled, rolledItems);
            if (newSpirit) {
                const newStateSp = createNewBuild(state, t_id, newSpirit[0], type.toLowerCase());
                return newStateSp;
            } else {
                return;
            }
        case "TALISMANS":
            const newTalis = getTalismans(1, includePreviouslyRolled, rolledItems);
            const newStateTalis = createNewBuild(state, t_id, newTalis[0], type.toLowerCase());
            return newStateTalis;
        case "SHIELDS":
            const newShield = getShields(1, includePreviouslyRolled, rolledItems);
            const newStateSh = createNewBuild(state, t_id, newShield[0], type.toLowerCase());
            return newStateSh;
        default:
            return state;
    }
}

export { generateRandomBuild, getNewItem };
