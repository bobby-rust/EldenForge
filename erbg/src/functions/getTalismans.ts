import talismans_data from '../data/talismans_data.json'

function getTalismans(numTalis: number) {
    let foundTalis = false
    const talismans = []

    while (!foundTalis) {
        const rand_talis_idx = Math.floor(Math.random() * talismans_data.count)
        const randTalis = talismans_data.data[rand_talis_idx]

        let valid_talis = true

        for (let i = 0; i < talismans.length; i++) {
            if (randTalis.id === talismans[i].id) {
                valid_talis = false
            }
        }

        if (valid_talis) {
            talismans.push(randTalis)
        }

        if (talismans.length === numTalis) {
            foundTalis = true
        }
    }
    // End find talismans

    return talismans
}

export default getTalismans
