/* Freelancer Controlls */

const jwt = require("jsonwebtoken");
const collectionF = require("../../model/Fmodel");
const collectionM = require("../../model/Mmodel");
const collectionA = require("../../model/Amodel");
const collectionC = require("../../model/Cmodel");
const collectionMsg = require("../../model/messages");
const mongoose = require("mongoose");

//freelancer token authentication
const lancerAuth = async (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    try {
      const freelancer = await collectionF
        .findOne({ UserName: decoded.data })
        .lean();
      console.log("Token Created,Logged in");
      res.status(200).send(freelancer);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
};

//freelancer message display
const showLancerMsg = async (req, res) => {
  try {
    const msgUpdate = await collectionMsg
      .findOne({
        lancerId: req.params.fUser,
        clientId: req.params.userId,
      })
      .lean();
    console.log("Msg Display");
    res.status(200).send(msgUpdate);
  } catch (error) {
    res.status(500).json({ message: "Can't load messages", error });
  }
};

//freelancer profile upload
const profileUpload = async (req, res) => {
  console.log(req.params.fUser);
  console.log(req.body);
  console.log(req.file);
  const findUser = await collectionF.findOneAndUpdate(
    { UserName: req.params.fUser },
    { profilePic: req.file.filename }
  );
  console.log("Profile Uploaded");
  if (findUser) {
    res.send("Success");
  } else {
    res.send(null);
  }
};

//freelancer task request operation ("accept" / "reject")
const lancerTasks = async (req, res) => {
  const { clientIds, requestVal, taskName, taskDescription, currAmount } =
    req.body;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    console.log("TaskRoute");
    //request accept operation
    if (requestVal === "accept") {
      console.log("accepted");
      const lancerRequestOp = await collectionF.findOneAndUpdate(
        { UserName: req.params.fUser },
        {
          $pull: {
            bufferRequests: {
              clientIds,
              taskName,
              taskDescription,
            },
          },
          $inc: { currAmount: -2 },
          // currAmount: parseInt(currAmount) - parseInt(2),
        },
        { session }
      );

      console.log("first");

      if (lancerRequestOp) {
        const adminAdd = await collectionA.findOneAndUpdate(
          {
            UserName: "varunpuli11",
          },
          {
            $inc: { currAmount: 2 },
            // currAmount: parseInt(currAmount) + parseInt(2),
          },
          { session }
        );
      }

      console.log("second");

      const clientRequestOp = await collectionC.findOneAndUpdate(
        { UserName: clientIds },
        {
          $pull: {
            bufferRequests: {
              lancerIds: req.params.fUser,
              taskName: taskName,
              taskDescription: taskDescription,
            },
          },
        },
        { session }
      );

      console.log("third");

      const lancerUpdateReq = await collectionF.findOneAndUpdate(
        { UserName: req.params.fUser },
        {
          $push: {
            tasksAssigned: {
              clientId: clientIds,
              taskName: taskName,
              taskDescription: taskDescription,
            },
          },
        },
        { session }
      );

      console.log("fourth");

      const clientUpdateReq = await collectionC.findOneAndUpdate(
        { UserName: clientIds },
        {
          $push: {
            tasksRequested: {
              lancerId: req.params.fUser,
              taskName: taskName,
              taskDescription: taskDescription,
            },
          },
        },
        { session }
      );

      console.log("fifth");

      const connectionCheck = await collectionMsg
        .findOne(
          {
            clientId: clientIds,
            lancerId: req.params.fUser,
          },
          null,
          { session }
        )
        .lean();

      console.log("sixth");

      if (!connectionCheck) {
        const messageConnection = await collectionMsg.insertMany(
          {
            clientId: clientIds,
            lancerId: req.params.fUser,
          },
          { session }
        );
      }

      console.log("accept finish");
    }
    //request reject operation
    else if (requestVal === "reject") {
      console.log("rejected");
      const lancerRequestOp = await collectionF.findOneAndUpdate(
        { UserName: req.params.fUser },
        {
          $pull: {
            bufferRequests: {
              clientIds: clientIds,
              taskName: taskName,
              taskDescription: taskDescription,
            },
          },
        },
        { session }
      );

      const clientRequestOp = await collectionC.findOneAndUpdate(
        { UserName: clientIds },
        {
          $pull: {
            bufferRequests: {
              lancerIds: req.params.fUser,
              taskName: taskName,
              taskDescription: taskDescription,
            },
          },
        },
        { session }
      );
    }
    await session.commitTransaction();
    res.send("requestDone");
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction error:", error);
    res.status(500).send("Transaction failed");
  } finally {
    session.endSession();
  }
};

//freelancer message entry
const lancerMsg = async (req, res) => {
  const { msgContent } = req.body;
  try {
    const msgUpdate = await collectionMsg.findOneAndUpdate(
      {
        lancerId: req.params.fUser,
        clientId: req.params.userId,
      },
      {
        $push: {
          allMessages: {
            userId: req.params.fUser,
            msgContent: msgContent,
            msgDate: Date.now(),
          },
        },
      }
    );
    console.log("msg sent");
    res.status(200).send(msgUpdate);
  } catch (error) {
    res.status(500).json({ message: "message can't send", error });
  }
};

//freelancer profits
const lancerEarnings = async (req, res) => {
  const findLancer = await collectionF
    .findOne({ UserName: req.params.fUser })
    .lean();
  if (!findLancer) {
    res.send(null);
  } else {
    const price = req.body.amount;
    console.log("profit");
    const lancerUpdate = await collectionF.findOneAndUpdate(
      { UserName: req.params.fUser },
      { currAmount: parseInt(findLancer.currAmount) + parseInt(price) }
    );

    const adminProfit = await collectionA.findOneAndUpdate(
      { UserName: "varunpuli11" },
      { $inc: { currAmount: 2 } }
    );
    res.status(200).send(true);
  }
};

//freelancer account delete functionality
const lancerAccountDelete = async (req, res) => {
  try {
    const deleteAccount = await collectionF.deleteMany({
      UserName: req.params.fUser,
    });
    res.status(200).send("success");
  } catch (error) {
    res.status(500).json({ message: "Error in Deletion", error });
  }
};

//freelancer finished tasks display
const finishedTasks = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await collectionF.findOneAndUpdate(
        { UserName: req.params.fUser },
        { $pull: { tasksAssigned: { clientId: req.body.clientId } } },
        { session }
      );

      await collectionC.findOneAndUpdate(
        { UserName: req.body.clientId },
        { $pull: { tasksRequested: { lancerId: req.params.fUser } } },
        { session }
      );

      await collectionC.findOneAndUpdate(
        { UserName: req.body.clientId },
        {
          $push: {
            finishedTasks: {
              lancerId: req.params.fUser,
              taskName: req.body.taskName,
            },
          },
        },
        { session }
      );

      await collectionF.findOneAndUpdate(
        { UserName: req.params.fUser },
        {
          $push: {
            finishedTasks: {
              clientId: req.body.clientId,
              taskName: req.body.taskName,
            },
          },
        },
        { session }
      );

      await collectionMsg.deleteOne(
        {
          clientId: req.body.clientId,
          lancerId: req.params.fUser,
        },
        { session }
      );
    });

    res.send("success");
  } catch (error) {
    console.error("Transaction error:", error);
    res
      .status(500)
      .json({ message: "Couldn't perform requested operation", error });
  } finally {
    session.endSession();
  }
};

module.exports = {
  lancerAuth,
  showLancerMsg,
  lancerTasks,
  lancerAccountDelete,
  finishedTasks,
  lancerEarnings,
  lancerMsg,
  profileUpload,
};
