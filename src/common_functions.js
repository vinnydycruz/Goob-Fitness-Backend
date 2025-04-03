const { User } = require('../mongo/userSchema');

function normalizeDateToISO(date) {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    return dateObj.toISOString().split('T')[0]; 
}

async function addToArray(id, fieldName, newItem){
    const user = await User.findById(id);
    if(!user){
        throw new Error('User not found');
    }
    user[fieldName].push(newItem);
    await user.save();

    return user[fieldName];
}

async function getArrayItem(id, fieldName, date) {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }

    const inputDateString = normalizeDateToISO(date);

    const result = user[fieldName].filter(entry => {
        const entryDate = normalizeDateToISO(entry.date);
        return entryDate === inputDateString;
    });

    return result;
}

async function getField(id, fieldName) {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user[fieldName];
}

module.exports = { 
    normalizeDateToISO, 
    addToArray, 
    getArrayItem, 
    getField
};
