const mongoose = require('mongoose');

const addresSchema = mongoose.Schema({ 
    street :{ type: String, required : true},
    number: { type: String, required : true},
    apt: String,
    commune: { type: String, required : true},
    city: { type: String, required : true},
    isDefault: Boolean,
    createdAt : { type: Date, default: Date.now },
    userId: {type: mongoose.Schema.ObjectId, ref: 'user', required : true},
    
});

module.exports = mongoose.model('address', addresSchema);