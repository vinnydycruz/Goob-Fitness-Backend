const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi);

// Schema to add comments on post
const commentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    isPosted: Boolean
});

const Comment = mongoose.model('Comment', commentSchema);

function validateComment(comment) {
    const schema = Joi.object({
        username: Joi.string().required(),
        description: Joi.string().required(),
        createdAt: Joi.date().default(() => new Date()),
        likes: Joi.number().integer().min(0).default(0),
        isPosted: Joi.boolean()
  });
    return schema.validate(comment, { abortEarly: false });
}

exports.Comment = Comment;
exports.validateComment = validateComment;
exports.commentSchema = commentSchema;
