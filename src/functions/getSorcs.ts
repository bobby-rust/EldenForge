import sorceries_data from "../data/sorceries_data.json";

function getSorcs(numSorcs: number, includePreviouslyRolled: any, rolledItems: any) {
    if (rolledItems.sorcs.length >= sorceries_data.count) {
        return [];
    }

    let foundSorcs = false;
    const sorcs = [];

    while (!foundSorcs) {
        if (sorceries_data.count === rolledItems.sorcs.length + sorcs.length) {
            break;
        }
        const rand_sorcs_idx = Math.floor(Math.random() * sorceries_data.count);
        const randSorc = sorceries_data.data[rand_sorcs_idx];

        if (!includePreviouslyRolled && rolledItems.sorcs.includes(randSorc.id)) {
            continue;
        }

        let valid_sorcs = true;

        for (let i = 0; i < sorcs.length; i++) {
            if (randSorc.id === sorcs[i].id) {
                valid_sorcs = false;
            }
        }

        if (valid_sorcs) {
            sorcs.push(randSorc);
        }

        if (sorcs.length === numSorcs) {
            foundSorcs = true;
        }
    }
    // End find sorcs

    return sorcs;
}

export default getSorcs;
