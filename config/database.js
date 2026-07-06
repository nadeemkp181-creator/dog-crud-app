const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;
const mongoDbName = process.env.MONGO_DB

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      dbName: mongoDbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
