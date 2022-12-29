import armors_data from "../data/armors_data.json";
import { ArmorDataObject, BuildItem } from "../types/ItemTypes";

function SortArmor(armor: ArmorDataObject[]): ArmorDataObject[] {
    const sortedArmor: ArmorDataObject[] = [];

    var helm_idx = -1;
    var chest_idx = -1;
    var gauntlets_idx = -1;
    var leg_idx = -1;

    for (let i = 0; i < armor.length; i++) {
        if (armor[i].category.includes("Helm")) {
            helm_idx = i;
        }
        if (armor[i].category.includes("Chest")) {
            chest_idx = i;
        }
        if (armor[i].category.includes("Gauntlet")) {
            gauntlets_idx = i;
        }
        if (armor[i].category.includes("Leg")) {
            leg_idx = i;
        }
    }

    if (
        helm_idx === -1 ||
        chest_idx === -1 ||
        gauntlets_idx === -1 ||
        leg_idx === -1
    ) {
        console.log("Unable to sort armor.");
        return armor;
    }

    sortedArmor.push(armor[helm_idx]);
    sortedArmor.push(armor[chest_idx]);
    sortedArmor.push(armor[gauntlets_idx]);
    sortedArmor.push(armor[leg_idx]);

    return sortedArmor;
}

function CleanArmorData(armor: ArmorDataObject[]): BuildItem[] {
    const cleanArmor: BuildItem[] = [];
    armor.forEach(piece => {
        const currCleanArmor: BuildItem = {
            id: piece.id,
            name: piece.name,
            image: piece.image as string,
            description: piece.description,
            category: piece.category,
        };
        cleanArmor.push(currCleanArmor);
    });

    return cleanArmor;
}

function getArmor(type?: string) {
    /**
     * This component needs to:
     *      Restructure the data into BuildItem
     *      sort the armor into head->chest->gauntlet->leg
     */
    // Find armor
    var foundArmor = false;
    const armor: ArmorDataObject[] = [];
    const categories: string[] = [];
    console.log("type in getArmor:", type);
    while (!foundArmor) {
        const rand_armors_idx: number = Math.floor(
            Math.random() * armors_data.count
        );
        const randArmorPiece: ArmorDataObject =
            armors_data.data[rand_armors_idx];

        let currCategory: string = randArmorPiece.category;

        if (currCategory === "Gauntlet") {
            currCategory = "Gauntlets";
        }
        let valid_armor = false;
        if (!categories.includes(currCategory)) {
            valid_armor = true;
        }
        let catTmp = currCategory;
        let currCategoryArr = currCategory.split(" ");
        let catTmp2 = currCategoryArr[0].toUpperCase();
        let category = "ARMOR." + catTmp2;
        if (valid_armor) {
            console.log("armor is valid");
            if (type) {
                console.log("type is not null");
                if (category === type) {
                    console.log("category is type");
                    armor.push(randArmorPiece);
                    console.log(armor);
                    return armor;
                }
            } else {
                armor.push(randArmorPiece);
                categories.push(currCategory);
            }
        }

        if (armor.length === 4) {
            foundArmor = true;
        }
    }
    // End find armor
    const sortedArmor = SortArmor(armor);
    const cleanedArmor = CleanArmorData(sortedArmor);
    return cleanedArmor;
}

export default getArmor;
