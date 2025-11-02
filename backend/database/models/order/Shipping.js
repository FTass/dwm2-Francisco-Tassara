const mongoose  = require('mongoose');

const shippingSchema = mongoose.Schema({
    orderId: { type: mongoose.Schema.ObjectId, ref : 'order',required : true },
    carrier: {type: String, required : true},
    trackingNUmber: {type: String, required : true},
    estimatedDelivery : {type: Date, required :true},
    shippedAt : {type: Date, required :true},
    deliveredAt : {type: Date, required :true},
});

shippingSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'orderId',
        select: 'number' 
    });
    next();
});

module.exports = mongoose.model('shipping', shippingSchema);