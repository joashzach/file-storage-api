const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env", quiet: true });

const app = require("./app");
const connectDB = require("./config/db.js");

const runServer = async () => {
  await connectDB();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server successfully running on port ${port}`);
  });
};
runServer();
