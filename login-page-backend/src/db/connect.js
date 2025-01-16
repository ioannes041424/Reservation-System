const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    // Connect to MongoDB without deprecated options
    await mongoose.connect(url);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit if the connection fails
  }
};

module.exports = connectDB;