const mongoose = require('mongoose')


const orderItemSchema = mongoose.Schema({
    orderNumber: {type : String, unique : true},
    orderId : {type : mongoose.Schema.ObjectId , ref : 'order', required : true},
    productId : {type : mongoose.Schema.ObjectId , ref : 'product', required : true},
    quantity: {type: Number, required : true},
    unitPrice : {type: Double, required :true},
    subTotal:  {type: Double, required :true},
    createdAt: Date,

});

module.exports = mongoose.model('orderitem', orderItemSchema);