const mongoose = require('mongoose');

const sessionTokenSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.ObjectId, ref: 'user', required : true},
    token: String,
    expiresAt: Date,
    createdAt : { type: Date, default: Date.now }
});


module.exports = mongoose.model('sessionToken', sessionTokenSchema);