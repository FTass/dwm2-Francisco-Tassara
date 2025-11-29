const mongoose  = require('mongoose');

const paymentSchema = mongoose.Schema({
    method: {type: String, enum:['transfer', 'WebPay']},
    orderId: {type: mongoose.Schema.ObjectId, ref:  'order', required : true},
    amount: {type: Number, required : true},
    status : {type: String , enum: ['pending', 'paid', 'failed']},
    transactionId: {type : String, required : true},
    idempotencyKey : {type : String, required: true},
    createdAt: Date,
});


module.exports = mongoose.model('payment', paymentSchema);