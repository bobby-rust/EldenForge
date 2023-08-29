import weapons_data from "../data/weapons_data.json";

function getWeapons(
    numWeapons: number,
    includePreviouslyRolled: boolean,
    rolledItems: any
    // previouslyRolledItems: string[]
) {
    if (rolledItems.weapons.length === weapons_data.data.length) {
        return [];
    }

    // Find weapon(s)
    let foundWeapons = false;
    const weapons = [];
    while (!foundWeapons) {
        if (weapons_data.count === rolledItems.weapons.length + weapons.length) {
            break;
        }
        const rand_weapon_idx = Math.floor(Math.random() * weapons_data.count);
        const randWeapon = weapons_data.data[rand_weapon_idx];
        if (!includePreviouslyRolled && rolledItems.weapons.includes(randWeapon.id)) {
            continue;
        }

        weapons.push(randWeapon);

        if (weapons.length === numWeapons) {
            foundWeapons = true;
        }
    }
    // End find weapon(s)

    return weapons;
}

export default getWeapons;
