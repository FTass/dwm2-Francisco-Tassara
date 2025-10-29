const mongoose = require('mongoose');

async function connectDB(uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Testuser') {
    if (!uri) {
        throw new Error('Falta MONGODB_URI en .env');
    }
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, { autoIndex: true });
}

async function disconnectDB() {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoose.connection.close();
}

module.exports = { connectDB, disconnectDB };