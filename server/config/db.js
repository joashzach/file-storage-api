const mongoose = require("mongoose");

const connectDB = () => {
  const DB = process.env.MONGODB_URI;
  mongoose
    .connect(DB)
    .then(() => console.log("DB connnected successfully!"))
    .catch((err) => {
      console.log("DB connection failed!");
      throw err;
    });
};

module.exports = connectDB;
