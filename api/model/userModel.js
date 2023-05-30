const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name:String,
  jobTitle:String,
  organization:String,
  phone: Number,
  email: String,
  userType: String,
  imgPath: String,
  joinDate:String
});
module.exports = mongoose.model("User", userSchema);
