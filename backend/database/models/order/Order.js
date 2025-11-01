const mongoose = require('mongoose')


const orderSchema = mongoose.Schema({
    orderNumber: {type : String, unique : true},
    userId : {type : mongoose.Schema.ObjectId , ref : 'user', required : true},
    addresId : {type : mongoose.Schema.ObjectId , ref : 'addres', required : true},
    status : {type : String, enum : ['pending_payment', 'paid', 'shipped', 'delivered', 'cancelled']},
    subTotal : {type : Number , required: true},
    tax : {type : Number , required: true},
    total : {type : Number , required: true},
    createdAt: Date,
    updatedAt: Date

});

module.exports = mongoose.model('order', orderSchema);