const mongoose = require('mongoose')

const cartItemSchema = mongoose.Schema({
    cartId    : { type : mongoose.Schema.ObjectId, ref : 'cart', required : true},
    productId : { type : mongoose.Schema.ObjectId, ref : 'product', required : true},
    quantity :  {type: Number, required : true},
    addedAt: Date
}, { timestamps: true });

cartItemSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'productId',
        select: 'name' 
    });
    next();
});



module.exports = mongoose.model('cartItem', cartItemSchema);