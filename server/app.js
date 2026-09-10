const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes/index.js");
const errorHandler = require("./middlewares/errorMiddleware");
const upload = require('./middlewares/uploadMiddleware');

const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");

// MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// RENDERED ROUTE
app.get("/", (req, res) => {
  return res.render("homepage");
});

// CENTRAL ROUTE HANDLER
app.use("/api", routes);

//GLOBAL ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

module.exports = app;
