const { normalizeDateToISO, addToArray, getArrayItem } = require('./common_functions');

async function addWeight(id, weightData) {
    return await addToArray(id, 'weight', weightData);
}

async function getWeight(id, date) {
    return await getArrayItem(id, 'weight', date);
}

async function getAllWeights(id) {
    return await getField(id, 'weight');
}

module.exports = {
    addWeight,
    getWeight,
    getAllWeights
};
