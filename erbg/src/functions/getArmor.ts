import armors_data from '../data/armors_data.json'

function getArmor() {
    // Find armor
    var foundArmor = false
    const armor = []
    const categories_found: string[] = []

    while (!foundArmor) {
        const rand_armors_idx = Math.floor(Math.random() * armors_data.count)
        const randArmorPiece = armors_data.data[rand_armors_idx]
        const category = randArmorPiece.category

        // it just has to be four unique armor types. Easy way to tell if found a full set.
        if (!categories_found.includes(category)) {
            categories_found.push(category)
            armor.push(randArmorPiece)
        }

        if (categories_found.length === 4) {
            foundArmor = true
        }
    }
    // End find armor

    return armor
}

export default getArmor
