const mongoose = require('mongoose')

const productSchema = mongoose.Schema ({
    name        : { type: String, required : true},
    description : { type: String, required : true},
    price :       { type: Number, required : true},
    oldPrice :     Number,
    stock :       { type: Number, required : true},
    categoryId :  { type: mongoose.Schema.ObjectId, ref : 'Category', required : true},
    milkType :    { type : String, enum: ['cow', 'goat', 'sheep', 'veggie']},
    status :      { type: String, enum :['draft', 'published', 'retired'], required : true},

    offer:         Boolean,
    discount:      { type: Number, min: 0, max: 100 },
    highlight:      Boolean,
    

}, {
    timestamps: true 
});

productSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'categoryId',
        select: 'name' 
    });
    next();
});




module.exports = mongoose.model('product', productSchema);