import getArmor from './getArmor'
import getAshes from './getAshes'
import getIncants from './getIncants'
import getShields from './getShields'
import getSorcs from './getSorcs'
import getSpirits from './getSpirits'
import getTalismans from './getTalismans'
import getWeapons from './getWeapons'
import getClass from './getClass'

function generateRandomBuild() {
    // We can pass as parameter number of each item to generate.
    // default to 16 total
    const build = {
        weapons: getWeapons(4),
        armor: getArmor(),
        ashes: getAshes(4),
        incants: getIncants(4),
        shields: getShields(),
        sorcs: getSorcs(4),
        spirits: getSpirits(4),
        talismans: getTalismans(4),
        starting_class: getClass(),
    }

    return build
}

export default generateRandomBuild
