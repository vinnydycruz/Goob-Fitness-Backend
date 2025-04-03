const Joi = require('joi');
const mongoose = require('mongoose');

// potentially move progress and weight schemas
const progressSchema = new mongoose.Schema({
    date: Date,
    workouts: [{
        exerciseName: String,
        weight: Number,
        reps: Number
    }]
});

const weightSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    weight: {
        type: Number,
        required: true
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    weight: {
        type: [weightSchema] 
    },
    maxPr: {
        type: Map,
        of: Number
    },
    progress : [progressSchema]
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        weight: Joi.array().items(Joi.object({
            date: Joi.date().required(),
            weight: Joi.number().required()
        })),
        maxPr: Joi.object().pattern(Joi.string(), Joi.number()),
        progress: Joi.array().items(Joi.object().unknown(true))
    });

    return schema.validate(user, { abortEarly: false });
}

exports.User = User;
exports.validate = validateUser;
