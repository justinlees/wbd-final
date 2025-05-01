const mongoose = require("mongoose");

const managerData = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  DOB: Date,
  UserName: String,
  Password: String,
  MobileNo: Number,
  userType: { type: String, default: "Manager" },
  Email: String,
  profilePic: String,
  currAmount: { type: Number, default: 0 },
  amountSpent: { type: Number, default: 0 },
  amountSaved: { type: Number, default: 0 },
  AccNumber: { type: Number, default: 0 },
  IFSCcode: { type: String, default: 0 },
  BankingName: { type: String, default: 0 },
});

const collectionM = mongoose.model("managers", managerData);

module.exports = collectionM;
