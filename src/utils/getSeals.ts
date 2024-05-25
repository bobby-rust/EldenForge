import seals_data from '../data/seals.json';

function getSeals(numSeals: number, includePreviouslyRolled: any, rolledItems: any) {
    if (rolledItems.seals.length === seals_data.data.length) {
        return [];
    }

    let foundSeals = false;
    const seals = [];

    while (!foundSeals) {
        if (seals_data.count === rolledItems.seals.length + seals.length) {
            break;
        }
        const randSealIdx = Math.floor(Math.random() * seals_data.count);

        const randSeal = seals_data.data[randSealIdx];

        let validSeal = true;
        if (!includePreviouslyRolled && rolledItems.seals.includes(randSeal.id)) {
            continue;
        }

        for (let i = 0; i < seals.length; i++) {
            if (randSeal.id === seals[i].id) {
                validSeal = false;
            }
        }

        if (validSeal) {
            seals.push(randSeal);
        }

        if (seals.length === numSeals) {
            foundSeals = true;
        }
    }
    // End find seals 
    return seals;
}

export default getSeals;
