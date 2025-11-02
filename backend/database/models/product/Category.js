const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true
    },
    description: { type: String },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    }
    }, {
    timestamps: true 
});

categorySchema.pre(/^find/, function(next) {
    this.populate({
        path: 'parentId',
        select: 'name' 
    });
    next();
});




module.exports = mongoose.model('Category', categorySchema);
