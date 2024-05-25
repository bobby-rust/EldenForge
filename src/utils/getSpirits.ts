import spirits_data from "../data/spirits_data.json";

function getSpirits(numSpirits: number, includePreviouslyRolled: any, rolledItems: any) {
    // Retrieve the data from sessionStorage
    // const storedPreviouslyRolledData = sessionStorage.getItem("rolledItems");
    // const parsedPreviouslyRolledData: any = JSON.parse(storedPreviouslyRolledData!);

    if (rolledItems.spirits.length === spirits_data.data.length) {
        return [];
    }

    let foundSpirits = false;
    const spirits = [];

    while (!foundSpirits) {
        if (spirits_data.count === rolledItems.spirits.length + spirits.length) {
            break;
        }
        const randSpiritIdx = Math.floor(Math.random() * spirits_data.count);

        const randSpirit = spirits_data.data[randSpiritIdx];

        let validSpirit = true;
        if (!includePreviouslyRolled && rolledItems.spirits.includes(randSpirit.id)) {
            continue;
        }

        for (let i = 0; i < spirits.length; i++) {
            if (randSpirit.id === spirits[i].id) {
                validSpirit = false;
            }
        }

        if (validSpirit) {
            spirits.push(randSpirit);
        }

        if (spirits.length === numSpirits) {
            foundSpirits = true;
        }
    }
    // End find talismans

    return spirits;
}

export default getSpirits;
