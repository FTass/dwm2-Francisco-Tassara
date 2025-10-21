const mongoose = require('mongoose');

async function connectDB(uri = 'mongodb://localhost:27017/Testuser') {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, { autoIndex: true });
}

async function disconnectDB() {
    await mongoose.connection.dropDatabase(); // opcional en tests
    await mongoose.disconnect();
    await mongoose.connection.close();
}

module.exports = { connectDB, disconnectDB };