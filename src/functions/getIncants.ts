import incantations_data from "../data/incantations_data.json";

function getIncants(numIncants: number, includePreviouslyRolled: any, rolledItems: any) {
    if (rolledItems.incants.length >= incantations_data.count) {
        return [];
    }

    let foundIncants = false;
    const incants = [];

    while (!foundIncants) {
        if (incantations_data.count === rolledItems.incants.length + incants.length) {
            break;
        }
        const rand_incants_idx = Math.floor(Math.random() * incantations_data.count);
        const randIncant = incantations_data.data[rand_incants_idx];

        let valid_incant = true;

        for (let i = 0; i < incants.length; i++) {
            if (randIncant.id === incants[i].id) {
                valid_incant = false;
            }
        }

        if (!includePreviouslyRolled && rolledItems.incants.includes(randIncant.id)) {
            continue;
        }

        if (valid_incant) {
            incants.push(randIncant);
        }

        if (incants.length === numIncants) {
            foundIncants = true;
        }
    }
    // End find incants

    return incants;
}

export default getIncants;
