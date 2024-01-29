import tears_data from '../data/crystal_tears.json';

function getTears(numtears: number, includePreviouslyRolled: any, rolledItems: any) {
    console.log("in tears (literally bc debugging)")
    // Retrieve the data from sessionStorage
    // const storedPreviouslyRolledData = sessionStorage.getItem("rolledItems");
    // const parsedPreviouslyRolledData: any = JSON.parse(storedPreviouslyRolledData!);
    console.log("rolled items in getTears: ");
    console.log(rolledItems);
    if (rolledItems.tears.length === tears_data.data.length) {
        return [];
    }

    let foundTears = false;
    const tears = [];

    while (!foundTears) {
        if (tears_data.count === rolledItems.tears.length + tears.length) {
            break;
        }
        const randTearIdx = Math.floor(Math.random() * tears_data.count);

        const randTear = tears_data.data[randTearIdx];

        let validTear = true;
        if (!includePreviouslyRolled && rolledItems.tears.includes(randTear.id)) {
            continue;
        }

        for (let i = 0; i < tears.length; i++) {
            if (randTear.id === tears[i].id) {
                validTear = false;
            }
        }

        if (validTear) {
            tears.push(randTear);
        }

        if (tears.length === numtears) {
            foundTears = true;
        }
    }
    // End find tears 
    console.log("returning: ", tears);
    return tears;
}

export default getTears;
