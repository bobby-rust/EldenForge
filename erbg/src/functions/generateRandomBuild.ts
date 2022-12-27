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

function generateRandomBuild() {
    // We can pass as parameter number of each item to generate.
    // default to 16 total
    const build = {
        weapons: getWeapons(1),
        armor: getArmor(),
        ashes: getAshes(1),
        incants: getIncants(1),
        shields: getShields(),
        sorcs: getSorcs(1),
        spirits: getSpirits(1),
        talismans: getTalismans(1),
        starting_class: getClass(),
        getNewItem: getNewItem,
    }

    return build
}

export default generateRandomBuild
