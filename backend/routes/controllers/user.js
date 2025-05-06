// User Controller
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const collectionF = require("../../model/Fmodel");
const collectionM = require("../../model/Mmodel");
const collectionA = require("../../model/Amodel");
const collectionC = require("../../model/Cmodel");
const collectionMsg = require("../../model/messages");
const task = require('../../model/Task');

const userAuth = async (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "No token" });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });

    try {
      const user = await collectionC.findOne({ UserName: decoded.data }).lean();
      const freelancer = await collectionF.find().lean();
      res.status(200).send({ user, freelancer });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  });
};

const showUserTasks = async (req, res) => {
  try {
    const requests = await collectionC
      .findOne({
        UserName: req.params.userId,
      })
      .lean();

    res.status(200).send(requests);
  } catch (error) {
    res.status(500).json({ message: "Can't show Requests", error });
  }
};

const showUserMsg = async (req, res) => {
  try {
    const msgUpdate = await collectionMsg.findOne({
      lancerId: req.params.fUser,
      clientId: req.params.userId,
    });
    if (!messages) {
      return res.status(500).json({ message: "Messages not found" });
    }
    res.status(200).send(msgUpdate);
  } catch (error) {
    res.status(500).json({ message: "Can't show messages", error });
  }
};

const searchLancer = async (req, res) => {
  const { searchSkill } = req.body;
  try {
    const searchLancerSkill = await collectionF
      .find({ Skill: searchSkill })
      .lean();
    const searchLancerId = await collectionF
      .findOne({ UserName: searchSkill })
      .lean();

    if (!searchLancerSkill && !searchLancerId) {
      res.send("");
    } else if (searchLancerSkill) {
      res.status(200).send(searchLancerSkill);
    } else {
      res.status(200).send(searchLancerId);
    }
  } catch (error) {
    res.status(500).json({ message: "Error occured in searching", error });
  }
};

const cancelTask = async (req, res) => {
  const { lancerIds } = req.body;
  try {
    const updateLancer = await collectionF.findOneAndUpdate(
      {
        UserName: lancerIds,
        bufferRequests: { $elemMatch: { clientIds: req.params.userId } },
      },
      { $pull: { bufferRequests: { clientIds: req.params.userId } } }
    );
    if (!updateLancer) {
      res.send("alreadyAccepted");
    } else {
      const updateClient = await collectionC.findOneAndUpdate(
        { UserName: req.params.userId },
        { $pull: { bufferRequests: { lancerIds: lancerIds } } }
      );
      res.send("requestCancel");
    }
  } catch (error) {
    res.status(500).json({ message: "Error in cancellation", error });
  }
};

const requestTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { lancerId, clientId, taskName, taskDescription } = req.body;

    const connectionCheck = await collectionMsg
      .findOne({
        lancerId: lancerId,
        clientId: clientId,
      })
      .session(session);

    const lancerConnectionCheck = await collectionF
      .findOne({
        UserName: lancerId,
        bufferRequests: { $elemMatch: { clientIds: clientId } },
      })
      .session(session);

    const clientConnectionCheck = await collectionC
      .findOne({
        UserName: clientId,
        bufferRequests: { $elemMatch: { lancerIds: lancerId } },
      })
      .session(session);

    if (!connectionCheck && !lancerConnectionCheck) {
      await collectionF.findOneAndUpdate(
        { UserName: lancerId },
        {
          $push: {
            bufferRequests: {
              clientIds: clientId,
              taskName,
              taskDescription,
            },
          },
        },
        { session }
      );
    }

    if (!connectionCheck && !clientConnectionCheck) {
      await collectionC.findOneAndUpdate(
        { UserName: clientId },
        {
          $push: {
            bufferRequests: {
              lancerIds: lancerId,
              taskName,
              taskDescription,
            },
          },
        },
        { session }
      );
    }
    await session.commitTransaction();
    res.send("Ok");
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction error in requestTask:", error);
    res.status(500).json({ message: "Request task failed", error });
  } finally {
    session.endSession();
  }
};
const userMsg = async (req, res) => {
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
            userId: req.params.userId,
            msgContent: msgContent,
            msgDate: Date.now(),
          },
        },
      }
    );
    if (!msgUpdate) {
      return res.status(500).json({ message: "Message not found" });
    }
    res.status(200).send(msgUpdate);
  } catch (error) {
    res.status(500).json({ message: "Error occured", error });
  }
};

const postTask = async (req, res) => {
  try {
    const { taskName, taskDescription } = req.body;
    const postedBy = req.params.userId;

    console.log("POST /:userId/post-task hit");
    console.log("Body:", req.body);
    console.log("Params:", req.params);

    if (!taskName || !taskDescription || !postedBy) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const taskdetails = new task({ taskName, taskDescription, postedBy });
    await taskdetails.save();

    res.status(201).json({ message: 'Task posted successfully', taskdetails });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const profileUpdate = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).send("User not found");
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

module.exports = {
  userAuth,
  showUserMsg,
  searchLancer,
  cancelTask,
  requestTask,
  showUserTasks,
  userMsg,
  postTask,
  profileUpdate
};
