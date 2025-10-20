const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    name: {type: String, required: true},
});

module.exports = mongoose.model('profile', profileSchema);