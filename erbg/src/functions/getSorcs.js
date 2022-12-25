import sorceries_data from '../data/sorceries_data.json'

function getSorcs() {
    // Find sorceries
    const sorcs = []
    const rand_sorc_idx_1 = Math.floor(Math.random() * sorceries_data.count)
    var rand_sorc_idx_2 = Math.floor(Math.random() * sorceries_data.count)

    while (rand_sorc_idx_1 === rand_sorc_idx_2) {
        rand_sorc_idx_2 = Math.floor(Math.random() * sorceries_data.count)
    }
    
    const sorc_1 = sorceries_data.data[rand_sorc_idx_1]
    const sorc_2 = sorceries_data.data[rand_sorc_idx_2]

    sorcs.push(sorc_1)
    sorcs.push(sorc_2)
    // End find sorceries

    return sorcs;
}

export default getSorcs;