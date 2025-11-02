const mongoose = require('mongoose')

const StockMovementSchema = mongoose.Schema({
    productId : {type: mongoose.Schema.ObjectId, ref : 'product', required : true},
    type : {type : String, enum: ['entry', 'exit', 'ad']},
    quantity: Number,
    reason : {type : String, required :  true},
    userId : {type: mongoose.Schema.ObjectId, ref : 'user', required : true},
    createdAt: Date
});

StockMovementSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'userId',
        select: 'firtsName lastName' 
    });
    next();
});

StockMovementSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'productId',
        select: 'name' 
    });
    next();
});


module.exports = mongoose.model('stockMovement', StockMovementSchema);