const mongoose = require('mongoose')


const orderSchema = mongoose.Schema({
    orderNumber: {type : String, unique : true},
    userId : {type : mongoose.Schema.ObjectId , ref : 'user', required : true},
    addressId : {type : mongoose.Schema.ObjectId , ref : 'address', required : true},
    status : {type : String, enum : ['pending_payment', 'paid', 'shipped', 'delivered', 'cancelled']},
    subTotal : {type : Number , required: true},
    tax : {type : Number , required: true},
    total : {type : Number },
    paymentMethod : {type : String, enum : ['transfer', 'webpay']},
    lastUpdatedBy : {type : mongoose.Schema.ObjectId , ref : 'user'},

}, { timestamps: true });

orderSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'userId',
        select: 'firstName' 
    });
    next();
});

orderSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'addressId',
        select: 'street firstName name' 
    });
    next();
});


module.exports = mongoose.model('order', orderSchema);