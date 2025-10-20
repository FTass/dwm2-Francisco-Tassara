const mongoose = require('mongoose')

const StockMovementSchema = mongoose.Schema({
    productId : {type: mongoose.Schema.ObjectId, ref : 'product', required : true},
    type : {type : String, enum: ['entry', 'exit', 'ad']},
    quantity: Number,
    reason : {type : String, required :  true},
    userId : {type: mongoose.Schema.ObjectId, ref : 'user', required : true},
    createdAt: Date
});


module.exports = mongoose.model('stockMovement', StockMovementSchema);