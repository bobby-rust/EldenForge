import spirits_data from '../data/spirits_data.json'

function getSpirits(numSpirits: number) {
    let foundSpirits = false
    const spirits = []

    while (!foundSpirits) {
        const rand_spirit_idx = Math.floor(Math.random() * spirits_data.count)
        const randSpirit = spirits_data.data[rand_spirit_idx]

        let valid_spirit = true

        for (let i = 0; i < spirits.length; i++) {
            if (randSpirit.id === spirits[i].id) {
                valid_spirit = false
            }
        }

        if (valid_spirit) {
            spirits.push(randSpirit)
        }

        if (spirits.length === numSpirits) {
            foundSpirits = true
        }
    }
    // End find talismans

    return spirits
}

export default getSpirits
