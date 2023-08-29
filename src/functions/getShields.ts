import shields_data from "../data/shields_data.json";

function getShields(numShields: number, includePreviouslyRolled: any, rolledItems: any) {
    if (rolledItems.shields.length >= shields_data.count) {
        return [];
    }

    // Find shields
    let foundShields = false;
    const shields = [];

    while (!foundShields) {
        if (shields_data.count === rolledItems.shields.length + shields.length) {
            break;
        }
        // Get random shield
        const rand_shield_idx = Math.floor(Math.random() * shields_data.count);
        const randShield = shields_data.data[rand_shield_idx];

        if (!includePreviouslyRolled && rolledItems.shields.includes(randShield.id)) {
            continue;
        }

        // Verify that its not a duplicate
        let valid_shield = true;

        for (let i = 0; i < shields.length; i++) {
            if (randShield.id === shields[i].id) {
                valid_shield = false;
            }
        }

        if (valid_shield) {
            shields.push(randShield);
        }

        if (shields.length === numShields) {
            foundShields = true;
        }
    }
    // End find shields

    return shields;
}

export default getShields;
