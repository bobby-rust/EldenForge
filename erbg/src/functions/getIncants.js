import incantations_data from '../data/incantations_data.json'

function getIncants() {
    // Find incantations
    const incants = []

    const rand_incant_idx_1 = Math.floor(
        Math.random() * incantations_data.count
    )
    var rand_incant_idx_2 = Math.floor(Math.random() * incantations_data.count)

    while (rand_incant_idx_1 === rand_incant_idx_2) {
        rand_incant_idx_2 = Math.floor(Math.random() * incantations_data.count)
    }

    const incant_1 = incantations_data.data[rand_incant_idx_1]
    const incant_2 = incantations_data.data[rand_incant_idx_2]
    incants.push(incant_1)
    incants.push(incant_2)
    // End find incantations

    return incants;
}

export default getIncants;