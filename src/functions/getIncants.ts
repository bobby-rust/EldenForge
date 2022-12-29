import incantations_data from "../data/incantations_data.json";

function getIncants(numIncants: number) {
    let foundIncants = false;
    const incants = [];

    while (!foundIncants) {
        const rand_incants_idx = Math.floor(
            Math.random() * incantations_data.count
        );
        const randIncant = incantations_data.data[rand_incants_idx];

        let valid_incant = true;

        for (let i = 0; i < incants.length; i++) {
            if (randIncant.id === incants[i].id) {
                valid_incant = false;
            }
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
