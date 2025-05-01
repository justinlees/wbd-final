const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema({
  clientId: String,
  lancerId: String,
  allMessages: [
    {
      userId: String,
      msgContent: String,
      msgDate: Date,
    },
  ],
});

const collectionMsg = mongoose.model("connections", MessagesSchema);

module.exports = collectionMsg;
