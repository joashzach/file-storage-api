const express = require("express");
const cors = require("cors");
const routes = require("./routes/index.js");

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cors());

// CENTRAL ROUTE HANDLER
app.use("/api", routes);

module.exports = app;
