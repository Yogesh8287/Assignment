require("dotenv").config();
const express = require("express");
require("express-async-errors");
const mongoose = require("mongoose");
const auth = require("./app/router/auth");
const product = require("./app/router/product");
const error = require("./app/middleware/error");
const app = express();

mongoose
  .connect("mongodb://localhost/store")
  .then(() => console.log("Connected to mongodb..."))
  .catch(() => console.log("Could not connect to mongodb"));

app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/products", product);
app.use(error);

const PORT = process.env.PORT || 5000;
app.listen(3000, () => console.log(`Listening on port ${PORT}...`));
