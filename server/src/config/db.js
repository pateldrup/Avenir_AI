const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('MongoDB URI not set. Continuing without database for local auth demos.');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB unavailable: ${error.message}`);
  }
};

module.exports = connectDB;
