import classes_data from '../data/classes_data.json'

function getClass() {
    // Find class
    const rand_class_idx = Math.floor(Math.random() * classes_data.count)
    const starting_class = classes_data.data[rand_class_idx]
    // End find class

    return starting_class
}

export default getClass;