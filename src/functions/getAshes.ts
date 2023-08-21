import ashes_data from "../data/ashes_data.json";
import { AshesDataObject } from "../types/ItemTypes";

function getAshes(numAshes: number, includePreviouslyRolled: any) {
    let foundAshes = false;
    const ashes: any[] = [];
    while (!foundAshes) {
        const rand_Ashes_idx = Math.floor(Math.random() * ashes_data.count);
        const randAshes: AshesDataObject = ashes_data.data[rand_Ashes_idx];

        let valid_Ashes = true;

        for (let i = 0; i < ashes.length; i++) {
            if (randAshes.id === ashes[i].id) {
                valid_Ashes = false;
            }
        }

        if (valid_Ashes) {
            ashes.push(randAshes);
        }

        if (ashes.length === numAshes) {
            foundAshes = true;
        }
    }
    // End find ashes

    return ashes;
}

export default getAshes;
