const mongoose = require('mongoose')


const productImageSchema = mongoose.Schema({
    productId : {type : mongoose.Schema.ObjectId, ref : 'product', required : true},
    url : {type : String, required: true},
    alt : {type : String, required: true},
    isPrimary: { type: Boolean, default: false , required : true},
    createdAt: Date

});

module.exports = mongoose.model('productImage', productImageSchema);