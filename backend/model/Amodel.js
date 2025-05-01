const mongoose = require("mongoose");

const adminData = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  DOB: Date,
  UserName: String,
  Password: String,
  MobileNo: Number,
  userType: { type: String, default: "Admin" },
  Email: String,
  profilePic: String,
  currAmount: { type: Number, default: 0 },
  amountSpent: { type: Number, default: 0 },
  amountSaved: { type: Number, default: 0 },
});

const collectionA = mongoose.model("admins", adminData);

module.exports = collectionA;
