import ashes_data from '../data/ashes_data.json'

function getAshes() {
    // Find ashes
    const ashes = []
    const rand_ashes_idx = Math.floor(Math.random() * ashes_data.count)
    const ash_1 = ashes_data.data[rand_ashes_idx]

    ashes.push(ash_1)
    // End find ashes


    return ashes;
}

export default getAshes;