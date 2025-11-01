const mongoose  = require('mongoose');

const paymentSchema = mongoose.Schema({
    method: {type: String, enum:['transfer', 'webpay']},
    orderId: {type: mongoose.Schema.ObjectId, ref:  'order', required : true},
    amount: {type: Double, required : true},
    status : {type: String , enum: ['pending', 'paid', 'failed']},
    transactionId: {type : String, required : true},
    idempotencyKey : {type : String, required: true},
    createdAt: Date,
});


module.exports = mongoose.model('payment', paymentSchema);