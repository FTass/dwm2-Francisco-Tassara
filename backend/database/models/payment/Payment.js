const mongoose  = require('mongoose');

const paymentSchema = mongoose.Schema({
    method: { type: String, enum: ['transfer', 'webpay'], required: true },
    orderId: { type: mongoose.Schema.ObjectId, ref: 'order', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    transactionId: { type: String, required: true },
    idempotencyKey: { type: String, required: true },
}, { timestamps: true });

paymentSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'orderId',
        select: 'orderNumber'
    });
    next();
});

module.exports = mongoose.model('payment', paymentSchema);