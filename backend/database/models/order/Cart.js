const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    userId : {type : mongoose.Schema.ObjectId, ref : 'user', required : true},
    updatedAt: Date,
    createdAt: Date
});

module.exports = mongoose.model('cart', cartSchema);