const mongoose = require('mongoose')


const orderSchema = mongoose.Schema({
    orderNumber: {type : String, unique : true},
    userId : {type : mongoose.Schema.ObjectId , ref : 'user', required : true},
    addressId : {type : mongoose.Schema.ObjectId , ref : 'address', required : true},
    status : {type : String, enum : ['pending_payment', 'paid', 'shipped', 'delivered', 'cancelled']},
    subTotal : {type : Number , required: true},
    tax : {type : Number , required: true},
    total : {type : Number },
    paymentMethod : {type : String, enum : ['transfer', 'WebPay']},
    lastUpdatedBy : {type : mongoose.Schema.ObjectId , ref : 'user'},
    receiptUrl: String, 
    receiptNumber: String,
    generatedAt: Date

}, { timestamps: true });

orderSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'userId',
        select: 'firstName lastName' 
    });
    next();
});

orderSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'addressId',
        select: 'street firstName number' 
    });
    next();
});


module.exports = mongoose.model('order', orderSchema);