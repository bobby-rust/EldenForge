import weapons_data from "../data/weapons_data.json";

function getWeapons(
    numWeapons: number,
    includePreviouslyRolled: boolean
    // previouslyRolledItems: string[]
) {
    // Retrieve the data from sessionStorage
    const storedPreviouslyRolledData = sessionStorage.getItem("rolledItems");
    const parsedPreviouslyRolledData: any = JSON.parse(storedPreviouslyRolledData!);

    if (parsedPreviouslyRolledData.weapons.length === weapons_data.data.length) {
        alert(
            'There are no more weapons left to roll. Please reset the rolled weapons by unchecking "Weapons" in the select menu.'
        );
        return;
    }

    // Find weapon(s)
    let foundWeapons = false;
    const weapons = [];
    while (!foundWeapons) {
        const rand_weapon_idx = Math.floor(Math.random() * weapons_data.count);
        const randWeapon = weapons_data.data[rand_weapon_idx];

        // If they want to include previously rolled items, don't store them in sessionStorage
        if (includePreviouslyRolled) {
            weapons.push(randWeapon);
            // If they want to exclude previously rolled items, ensure that it does not already exist in sessionStorage and store it
        } else if (parsedPreviouslyRolledData.weapons.indexOf(randWeapon) === -1) {
            weapons.push(randWeapon);
            parsedPreviouslyRolledData.weapons.push(randWeapon);
        }

        if (weapons.length === numWeapons) {
            foundWeapons = true;
        }
    }
    // End find weapon(s)

    return weapons;
}

export default getWeapons;
