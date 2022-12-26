import weapons_data from '../data/weapons_data.json'

function getWeapons(numWeapons: number) {
    // Find weapon(s)
    let foundWeapons = false
    const weapons = []
    while (!foundWeapons) {
        const rand_weapon_idx = Math.floor(Math.random() * weapons_data.count)
        const randWeapon = weapons_data.data[rand_weapon_idx]

        weapons.push(randWeapon)

        if (weapons.length === numWeapons) {
            foundWeapons = true
        }
    }
    // End find weapon(s)

    return weapons
}

export default getWeapons
