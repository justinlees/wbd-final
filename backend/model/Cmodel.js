const mongoose = require("mongoose");
const { finished } = require("nodemailer/lib/xoauth2");

const clientData = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  DOB: Date,
  UserName: String,
  Password: String,
  MobileNo: Number,
  userType: { type: String, default: "Client" },
  Email: String,
  bufferRequests: [
    {
      lancerIds: { type: String, default: null },
      taskName: { type: String, default: null },
      taskDescription: { type: String, default: null },
    },
  ],
  tasksRequested: [
    {
      lancerId: { type: String, default: null },
      taskName: { type: String, default: null },
      taskDescription: { type: String, default: null },
      taskDate: { type: Date, default: null },
      taskAmount: { type: Number, default: 0 },
    },
  ],
  finishedTasks: [
    {
      lancerId: { type: String, default: "None" },
      taskName: { type: String, default: "None" },
    },
  ],
  profilePic: { type: String, default: null },
  currAmount: { type: Number, default: null },
  amountSpent: { type: Number, default: null },
  amountSaved: { type: Number, default: null },
});

const collectionC = mongoose.model("clients", clientData);

module.exports = collectionC;
