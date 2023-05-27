const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: String,
  code: String,
  MRP: Number,
  imgPath: String,
});

module.exports = mongoose.model("Product", productSchema);
