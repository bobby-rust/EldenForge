import ashes_data from "../data/ashes_data.json";
import { AshesDataObject } from "../types/ItemTypes";

function getAshes(numAshes: number, includePreviouslyRolled: any, rolledItems: any) {
    if (rolledItems.ashes.length === ashes_data.count) {
        return [];
    }
    let foundAshes = false;
    const ashes = [];

    while (!foundAshes) {
        if (ashes_data.count === rolledItems.ashes.length + ashes.length) {
            break;
        }
        const rand_Ashes_idx = Math.floor(Math.random() * ashes_data.count);
        const randAsh: AshesDataObject = ashes_data.data[rand_Ashes_idx];

        let isValidAsh = true;

        for (let i = 0; i < ashes.length; i++) {
            if (randAsh.id === ashes[i].id) {
                isValidAsh = false;
            }
        }

        if (!includePreviouslyRolled && rolledItems.ashes.includes(randAsh.id)) {
            continue;
        }

        if (isValidAsh) {
            ashes.push(randAsh);
        }

        if (ashes.length === numAshes) {
            foundAshes = true;
        }
    }
    // End find ashes

    return ashes;
}

export default getAshes;
