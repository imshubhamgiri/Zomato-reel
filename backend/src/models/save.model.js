const mongoose = require('mongoose');
const saveSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'food', required: true },
}, {timestamps: true })

const save = mongoose.model('save', saveSchema)
module.exports = save;