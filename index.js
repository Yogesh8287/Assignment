const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const user = require("./app/router/user");
const auth = require("./app/router/auth");
const product = require("./app/router/product");
const app = express();

mongoose
  .connect("mongodb://localhost/store")
  .then(() => console.log("connected to mongodb"))
  .catch(() => console.log("does not connected to mongodb"));

app.use(express.json());
app.use("/user", user);
app.use("/auth", auth);
app.use("/products", product);

app.listen(3000, () => console.log("listening on port 3000"));
