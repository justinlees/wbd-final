const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, unique: true, index: true },
    lancerId: { type: String, required: true, unique: true, index: true },
    allMessages: [
      {
        userId: String,
        msgContent: String,
        msgDate: Date,
      },
    ],
  },
  { timestamps: true }
);

const collectionMsg = mongoose.model("connections", MessagesSchema);

module.exports = collectionMsg;
