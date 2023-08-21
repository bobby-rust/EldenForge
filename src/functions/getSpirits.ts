import spirits_data from "../data/spirits_data.json";

function getSpirits(numSpirits: number, includePreviouslyRolled: any) {
    // Retrieve the data from sessionStorage
    const storedPreviouslyRolledData = sessionStorage.getItem("rolledItems");
    const parsedPreviouslyRolledData: any = JSON.parse(storedPreviouslyRolledData!);

    if (parsedPreviouslyRolledData.spirits.length === spirits_data.data.length) {
        alert(
            'There are no more spirits left to roll. Please reset the rolled weapons by unchecking "Spirits" in the select menu.'
        );
        return;
    }

    let foundSpirits = false;
    const spirits = [];

    while (!foundSpirits) {
        const rand_spirit_idx = Math.floor(Math.random() * spirits_data.count);
        const randSpirit = spirits_data.data[rand_spirit_idx];

        let valid_spirit = true;

        for (let i = 0; i < spirits.length; i++) {
            if (randSpirit.id === spirits[i].id) {
                valid_spirit = false;
            }
        }

        // If they want to include previously rolled items, don't store them in sessionStorage
        console.log(parsedPreviouslyRolledData.weapons.indexOf(randSpirit.id));
        if (includePreviouslyRolled && valid_spirit) {
            spirits.push(randSpirit);
            // If they want to exclude previously rolled items, ensure that it does not already exist in sessionStorage and store it
        } else if (parsedPreviouslyRolledData.weapons.indexOf(randSpirit.id) === -1) {
            // p sure this is always returning false. because indexOf
            spirits.push(randSpirit);
            parsedPreviouslyRolledData.spirits.push(randSpirit.id);
            sessionStorage.setItem("rolledItems", JSON.stringify(parsedPreviouslyRolledData));
        }

        if (spirits.length === numSpirits) {
            foundSpirits = true;
        }
    }
    // End find talismans

    return spirits;
}

export default getSpirits;
