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
        "weapons": getWeapons(),
        "armor": getArmor(),
        "ashes": getAshes(),
        "incants": getIncants(),
        "shields": getShields(),
        "sorcs": getSorcs(),
        "spirits": getSpirits(),
        "talismans": getTalismans(),
        "starting_class": getClass(),
    }

    return build;
}

export default generateRandomBuild;