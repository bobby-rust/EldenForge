import talismans_data from '../data/talismans_data.json'

function getTalismans() {
    // Find talismans
    const talismans = []

    const rand_talisman_idx_1 = Math.floor(Math.random() * talismans_data.count)
    var rand_talisman_idx_2 = Math.floor(Math.random() * talismans_data.count)

    while (rand_talisman_idx_1 === rand_talisman_idx_2) {
        rand_talisman_idx_2 = Math.floor(Math.random() * talismans_data.count)
    }

    const talisman_1 = talismans_data.data[rand_talisman_idx_1]
    const talisman_2 = talismans_data.data[rand_talisman_idx_2]

    talismans.push(talisman_1)
    talismans.push(talisman_2)
    // End find talismans

    return talismans;
}

export default getTalismans;