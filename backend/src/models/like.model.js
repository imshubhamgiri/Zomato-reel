const mongoose = require('mongoose');

const likeSchema =new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'food', required: true },
}, {timestamps: true });

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;