const mongoose = require('mongoose');

const userSchema = mongoose.Schema({ 
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

userSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'profile',
        select: 'name' 
    });
    next();
});

userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('user', userSchema);