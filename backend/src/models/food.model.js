const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    video: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    // category: { type: String, required: true, trim: true },
    likeCount: { type: Number, default: 0 },
    saveCount: { type: Number, default: 0 },
    foodPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodPartner', required: true }
}, {
    timestamps: true
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;