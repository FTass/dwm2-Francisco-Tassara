const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true, trim: true},
});

module.exports = mongoose.model('profile', profileSchema);