const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const _ = require("lodash");
const Product = require("../model/Product");
const auth = require("../middleware/auth");
const path = require("path");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  const product = await Product.find();
  res.send(product);
});

router.post("/upload", [auth, upload.single("file")], async (req, res) => {
  if (!req.file) return res.status(400).send("File is required");

  const { mimetype, filename } = req.file;
  const filePath = path.join(__dirname, "..", "..", "uploads", filename);

  if (mimetype !== "text/csv") {
    fs.unlinkSync(filePath);
    return res.status(400).send("File type must be csv");
  }

  const products = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (product) => {
      product._createdBy = req.user._id;
      products.push(product);
    })
    .on("end", async () => {
      const result = await Product.insertMany(products);
      fs.unlinkSync(filePath);
      res.send(result);
    })
    .on("error", () => {
      fs.unlinkSync(filePath);
      res.status(400).send("Invalid file data");
    });
});

module.exports = router;
