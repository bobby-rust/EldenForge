import getArmor from "./getArmor";
import getAshes from "./getAshes";
import getIncants from "./getIncants";
import getShields from "./getShields";
import getSorcs from "./getSorcs";
import getSpirits from "./getSpirits";
import getTalismans from "./getTalismans";
import getWeapons from "./getWeapons";
import getClass from "./getClass";

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
        talismans: getTalismans(t_talismans),
        starting_class: getClass(),
        rerollItem: rerollItem,
    };

    return build;
}

const rerollItem = (id: string, build: any, category: string) => {
    /**
     * Creates a new build object given an id of one item to change
     * And updates the build state
     *
     * @param id the id to change
     * @param build the build object to search
     * @param category the type of object being searched for, i.e. "WEAPONS", "ARMOR", etc.
     * @return a new build object with the object that has
     *  the id given changed to a new item from the same category
     */
    console.log("You sent me id: ", id);
    console.log("You sent me build: ", build);
    console.log("You sent me category: ", category);
    console.log("returning a new build object :)");
};

export { generateRandomBuild, rerollItem };
