import spirits_data from '../data/spirits_data.json'

function getSpirits() {
    // Find spirits
    const spirits = []
    const rand_spirits_idx = Math.floor(Math.random() * spirits_data.count)
    const spirit = spirits_data.data[rand_spirits_idx]

    spirits.push(spirit)
    // End find spirits

    return spirits;
}

export default getSpirits;