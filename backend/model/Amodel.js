const mongoose = require("mongoose");

const adminData = new mongoose.Schema(
  {
    FirstName: String,
    LastName: String,
    DOB: Date,
    UserName: { type: String, required: true, unique: true, index: true },
    Password: { type: String, required: true },
    MobileNo: { type: Number },
    userType: { type: String, default: "Admin" },
    Email: { type: String, required: true, unique: true },
    profilePic: String,
    currAmount: { type: Number, default: 0 },
    amountSpent: { type: Number, default: 0 },
    amountSaved: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const collectionA = mongoose.model("admins", adminData);

module.exports = collectionA;
