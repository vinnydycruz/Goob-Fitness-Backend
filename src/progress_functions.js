const { normalizeDateToISO, addToArray, getArrayItem, getField } = require('./common_functions');

async function addProgress(id, progressData) {
    return await addToArray(id, 'progress', progressData);
}

async function getProgress(id, date) {
    return await getArrayItem(id, 'progress', date);
}

async function getAllProgress(id) {
    return await getField(id, 'progress');
}
module.exports = {
    addProgress,
    getProgress,
    getAllProgress
};
