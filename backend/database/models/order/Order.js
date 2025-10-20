const mongoose = require('mongoose')
const addres = require('../user/addres')

const orderSchema = mongoose.Schema({
    orderNumber: {type : String, unique : true},
    userId : {type : mongoose.Schema.ObjectId , ref : 'user', required : true},
    addresId : {type : mongoose.Schema.ObjectId , ref : 'addres', required : true},
    status : {type : String, enum : ['pending_payment', 'paid', 'shipped', 'delivered', 'cancelled']},
    subTotal : {type : Double , required: true},
    tax : {type : Double , required: true},
    total : {type : Double , required: true},
    createdAt: Date,
    updatedAt: Date

});

module.exports = mongoose.model('order', orderSchema);