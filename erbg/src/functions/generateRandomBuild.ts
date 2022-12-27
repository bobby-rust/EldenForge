import getArmor from './getArmor'
import getAshes from './getAshes'
import getIncants from './getIncants'
import getShields from './getShields'
import getSorcs from './getSorcs'
import getSpirits from './getSpirits'
import getTalismans from './getTalismans'
import getWeapons from './getWeapons'
import getClass from './getClass'
import { getNewItem } from '../functions/getNewItem'

function generateRandomBuild(t_weapons: number, t_ashes: number, t_incants: number, t_sorcs: number, t_spirits: number, t_talismans: number) {
    // We can pass as parameter number of each item to generate.
    // default to 16 total
    const build = {
        weapons: getWeapons(t_weapons),
        armor: getArmor(),
        ashes: getAshes(t_ashes),
        incants: getIncants(t_incants),
        shields: getShields(),
        sorcs: getSorcs(t_sorcs),
        spirits: getSpirits(t_spirits),
        talismans: getTalismans(t_talismans),
        starting_class: getClass(),
        getNewItem: getNewItem,
    }

    return build
}

export default generateRandomBuild
