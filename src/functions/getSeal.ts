import seals from "../data/seals.json";

function getSeal() {
    const randSealIdx = Math.floor(Math.random() * seals.count)
    const seal = seals.data[randSealIdx]

    return seal
}

export default getSeal;
