const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    userId : {type : mongoose.Schema.ObjectId, ref : 'user', required : true},
    updatedAt: Date,
    createdAt: Date
});

cartSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'userId',
        select: 'firstName' 
    });
    next();
});

module.exports = mongoose.model('cart', cartSchema);