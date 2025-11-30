const mongoose  = require('mongoose');

const shippingSchema = mongoose.Schema({
    orderId: { type: mongoose.Schema.ObjectId, ref : 'order', required : true },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    carrier: { type: String, default: null },
    trackingNumber: { type: String, default: null },
    estimatedDelivery: { type: Date, default: null },
    shippedAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
}, { timestamps: true });

shippingSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'orderId',
        select: 'orderNumber' 
    });
    next();
});

module.exports = mongoose.model('shipping', shippingSchema);