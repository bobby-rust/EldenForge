import weapons_data from '../data/weapons_data.json'

function getWeapons() {
    // Find weapon(s)
    const weapons = []
    const rand_weapon_idx_1 = Math.floor(Math.random() * weapons_data.count)
    const rand_weapon_idx_2 = Math.floor(Math.random() * weapons_data.count)
    const weapon_1 = weapons_data.data[rand_weapon_idx_1]
    const weapon_2 = weapons_data.data[rand_weapon_idx_2]

    weapons.push(weapon_1)
    weapons.push(weapon_2)
    // End find weapon(s)

    return weapons;
}

export default getWeapons;