const mongoose = require('mongoose')

const productSchema = mongoose.Schema ({
    name        : { type: String, required : true},
    description : { type: String, required : true},
    price :       { type: Number, required : true},
    oldPrice :     Number,
    stock :       { type: Number, required : true},
    categoryId :  { type: mongoose.Schema.ObjectId, ref : 'category', required : true},
    milkType :    { type : String, enum: ['cow', 'goat', 'sheep', 'veggie'], required : true},
    status :      { type: String, enum :['draft', 'published', 'retired'], required : true},
    createdAt:     Date,
    offer:         Boolean,
    highlight:      Boolean,
    updatedAt:    { type: Date, default: Date.now }

});

module.exports = mongoose.model('product', productSchema);