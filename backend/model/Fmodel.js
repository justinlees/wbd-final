const mongoose = require("mongoose");

const freelancerData = new mongoose.Schema(
  {
    FirstName: String,
    LastName: String,
    DOB: Date,
    UserName: { type: String, required: true, unique: true, index: true },
    Password: { type: String, required: true },
    MobileNo: Number,
    userType: { type: String, default: "Freelancer" },
    qualification: {
      type: String,
      default: "Empty",
    },
    Email: { type: String, required: true, unique: true },
    Rating: {
      type: Number,
      default: 0,
    },
    Skill: String,
    profilePic: { type: String, default: null },
    currAmount: { type: Number, default: 0 },
    amountSpent: Number,
    Transactions: Number,
    bufferRequests: [
      {
        clientIds: { type: String, default: null },
        taskName: { type: String, default: null },
        taskDescription: { type: String, default: null },
      },
    ],
    tasksAssigned: [
      {
        clientId: { type: String, default: "None" },
        taskName: { type: String, default: "None" },
        taskDescription: { type: String, default: "None" },
        taskDate: { type: Date, default: null },
        taskAmount: { type: Number, default: 0 },
      },
    ],
    finishedTasks: [
      {
        clientId: { type: String, default: "None" },
        taskName: { type: String, default: "None" },
      },
    ],
  },
  { timestamps: true }
);

const collectionF = mongoose.model("freelancers", freelancerData);

module.exports = collectionF;
