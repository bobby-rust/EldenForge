import talismans_data from "../data/talismans_data.json";

function getTalismans(numTalis: number, includePreviouslyRolled: any, rolledItems: any) {
    if (rolledItems.talis.length >= talismans_data.count) {
        return [];
    }

    let foundTalis = false;
    const talismans = [];

    while (!foundTalis) {
        if (talismans_data.count === rolledItems.talis.length + talismans.length) {
            break;
        }
        const rand_talis_idx = Math.floor(Math.random() * talismans_data.count);
        const randTalis = talismans_data.data[rand_talis_idx];
        if (!includePreviouslyRolled && rolledItems.talis.includes(randTalis.id)) {
            continue;
        }
        let valid_talis = true;

        for (let i = 0; i < talismans.length; i++) {
            if (randTalis.id === talismans[i].id) {
                valid_talis = false;
            }
        }

        if (valid_talis) {
            talismans.push(randTalis);
        }

        if (talismans.length === numTalis) {
            foundTalis = true;
        }
    }
    // End find talismans

    return talismans;
}

export default getTalismans;
