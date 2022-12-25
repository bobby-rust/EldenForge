import shields_data from '../data/shields_data.json'

function getShields() {
    // Find shield
    const shields = []
    const rand_shield_idx = Math.floor(Math.random() * shields_data.count)
    const shield = shields_data.data[rand_shield_idx]

    shields.push(shield)
    // End find shield

    return shields;
}

export default getShields;