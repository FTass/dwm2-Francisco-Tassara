const mongoose = require('mongoose');

const userSchema = mongoose.Schema({ 
	name: { type : String, required: true},
    email: { type : String, required: true},
	password: { type : String, required: true},
    firstName: { type : String, required: true},
    lastName: { type : String, required: true},
    phone: { type : String, required: true},
    profile: {type: mongoose.Schema.ObjectId, ref: 'profile', required : true},
    isActive: Boolean,
    failedLoginAttempts: Number,
    lockUntil: Date,
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('user', userSchema);