const mongoose = require('mongoose')

const foodpartnerSchema = new  mongoose.Schema({
    name: { type: String, required: true, trim: true },
    restaurantName : { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    address: { type: String, required: true, trim: true },
    // memberSince: { type: String, required: true, trim: true },
    // status: { type: String, default: 'Active', enum: ['Active', 'Inactive'] },
    // totalOrders: { type: Number, default: 0 },
    password: { type: String } 
},{
    timestamps:true
})

module.exports =  mongoose.model('FoodPartner', foodpartnerSchema)