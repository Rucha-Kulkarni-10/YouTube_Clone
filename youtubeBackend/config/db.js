const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    if (conn && conn.connection && conn.connection.host) {
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } else {
      console.error("Error: Could not connect to MongoDB");
      process.exit(1);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("Error: An unknown error occurred");
    }
    process.exit(1);
  }
};

module.exports = { connectDB };
