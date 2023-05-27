const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../model/productModel");
const checkauth = require("../middleware/checkauth");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dlxuxs9zv",
  api_key: "282254611379566",
  api_secret: "zkeN0j1NdZ62h9Eh59uxeufMSvw",
  secure: true,
});

router.get("/", checkauth, (req, res, next) => {
  var product = Product.find()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        response: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:id", (req, res, next) => {
  // console.log(req.params.id)
  Product.findById(req.params.id)
    .then((result) => {
      res.status(200).json({
        response: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        Error: err,
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Product.findByIdAndRemove({ _id: req.params.id })
    .then((result) => {
      res.status(200).json({
        msg: "Product Deleted Successfully",
        reponse: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        Error: err,
      });
    });
});


router.post("/", (req, res, next) => {
  console.log(req.body);
  const file = req.files.photo;
  console.log(file);
  console.log(file.tempFilePath);
  cloudinary.uploader.upload(file.tempFilePath, (result, err) => {
    const product = new Product({
      name: req.body.name,
      code: req.body.code,
      MRP: req.body.MRP,
      imgPath: result.url,
    });
    product
      .save()
      .then((result) => {
        console.log(result);
        res.status(200).json({
          msg: "Product Data Successfully Save",
          new_Product: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          err: err,
        });
      });
  });
  //   .then(result=>console.log(result));
});

module.exports = router;
