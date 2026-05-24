const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn('MONGO_URI not set. Running without a database connection.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log('MongoDB connected');
    return mongoose.connection;
  } catch (error) {
    console.warn('MongoDB connection skipped:', error.message);
    return null;
  }
}

module.exports = { connectDatabase };
