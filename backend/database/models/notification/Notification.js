const mongoose  = require('mongoose');

const notificationSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.ObjectId, ref:  'user', required : true},
    orderId: {type: mongoose.Schema.ObjectId, ref : 'order'},
    type: {type: String, enum:['order_confirmed', 'order_paid', 'order_shipped', 'order_failed']},
    sentAt : Date,
    status : {type: String , enum: ['sent', 'failed']},
    
});

module.exports = mongoose.model('notification', notificationSchema);