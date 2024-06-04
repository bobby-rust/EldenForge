from json import load, dump
from os import path, getcwd
from enum import Enum
cwd = getcwd()

class ArmorType(Enum):
    HELM ="Helm" 
    CHEST = "Chest Armor" 
    GAUNTLETS = "Gauntlets" 
    LEG = "Leg Armor" 

indir = path.join(cwd, "src/data/data.json")

with open(indir, "r") as fi:
    data = load(fi)

    helms = dict()
    chests = dict()
    gauntlets = dict()
    legs = dict()

    helms["count"] = 0
    chests["count"] = 0
    gauntlets["count"] = 0
    legs["count"] = 0

    helms["items"] = []
    chests["items"] = []
    gauntlets["items"] = []
    legs["items"] = []

    new_data = dict()
    new_data["helms"] = helms
    new_data["chests"] = chests
    new_data["gauntlets"] = gauntlets
    new_data["legs"] = legs

    for item in data["armors"]["items"]:
        category = item["category"]
        if category == ArmorType.HELM.value:
            helms["count"] += 1
            helms["items"].append(item)
        elif category == ArmorType.CHEST.value:
            chests["count"] += 1
            chests["items"].append(item)
        elif category == ArmorType.LEG.value:
            legs["count"] += 1
            legs["items"].append(item)
        elif category == ArmorType.GAUNTLETS.value or category == "Gauntlet":
            gauntlets["count"] += 1
            gauntlets["items"].append(item)

    outdir = path.join(cwd, "src/data/new_data.json")

    with open(outdir, "w") as fo:
        for category in data:
            if category == "armors":
                continue

            new_data[category] = data[category]
            print(category)

        dump(new_data, fo, indent=4)

        
    


