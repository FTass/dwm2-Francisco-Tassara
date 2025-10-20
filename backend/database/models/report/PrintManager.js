const mongoose  = require('mongoose');

const printManagerSchema = mongoose.Schema({
    type: {type: String, enum:['receipt', 'shipping', 'order_summary']},
    orderId: {type: mongoose.Schema.ObjectId, ref:  'order', required : true},
    filePath: {type: String, required : true},
    createdAt: Date,
    printedBy: {type: mongoose.Schema.ObjectId, ref: 'user', required: true}
});


module.exports = mongoose.model('printManager', printManagerSchema);