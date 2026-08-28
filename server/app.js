const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes/index.js");
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// CENTRAL ROUTE HANDLER
app.use("/api", routes);

//GLOBAL ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

module.exports = app;
