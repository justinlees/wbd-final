/* Freelancer Controlls */

const jwt = require("jsonwebtoken");
const collectionF = require("../../model/Fmodel");
const collectionM = require("../../model/Mmodel");
const collectionA = require("../../model/Amodel");
const collectionC = require("../../model/Cmodel");
const collectionMsg = require("../../model/messages");

//freelancer token authentication
const lancerAuth = async (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const freelancer = await collectionF
      .findOne({ UserName: decoded.data })
      .lean();
    console.log("Token Created,Logged in");
    res.send(freelancer);
  });
};

//freelancer message display
const showLancerMsg = async (req, res) => {
  const msgUpdate = await collectionMsg
    .findOne({
      lancerId: req.params.fUser,
      clientId: req.params.userId,
    })
    .lean();
  console.log("Msg Display");
  res.send(msgUpdate);
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
  const session = await collectionF.startSession();
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
            UserName: "dheeraj17",
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

      const connectionCheck = await collectionMsg.findOne(
        {
          clientId: clientIds,
          lancerId: req.params.fUser,
        },
        null,
        { session }
      );

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
  res.send(msgUpdate);
};

//freelancer profits
const lancerEarnings = async (req, res) => {
  const findLancer = await collectionF.findOne({ UserName: req.params.fUser });
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
      { UserName: "dheeraj17" },
      { $inc: { currAmount: 2 } }
    );
    res.send(true);
  }
};

//freelancer account delete functionality
const lancerAccountDelete = async (req, res) => {
  const deleteAccount = await collectionF.deleteMany({
    UserName: req.params.fUser,
  });
  res.send("success");
};

//freelancer finished tasks display
const finishedTasks = async (req, res) => {
  console.log("accepted");
  const taskFinish = await collectionF.findOneAndUpdate(
    { UserName: req.params.fUser },
    { $pull: { tasksAssigned: { clientId: req.body.clientId } } }
  );
  const clientTaskFinish = await collectionC.findOneAndUpdate(
    { UserName: req.body.clientId },
    { $pull: { tasksRequested: { lancerId: req.params.fUser } } }
  );

  const addClientFinishTasks = await collectionC.findOneAndUpdate(
    { UserName: req.body.clientId },
    {
      $push: {
        finishedTasks: {
          lancerId: req.params.fUser,
          taskName: req.body.taskName,
        },
      },
    }
  );
  const addFinishTasks = await collectionF.findOneAndUpdate(
    { UserName: req.params.fUser },
    {
      $push: {
        finishedTasks: {
          clientId: req.body.clientId,
          taskName: req.body.taskName,
        },
      },
    }
  );
  const deleteConnection = await collectionMsg.deleteOne({
    clientId: req.body.clientId,
    lancerId: req.params.fUser,
  });
  res.send("success");
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
