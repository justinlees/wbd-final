// User Controller
const jwt = require("jsonwebtoken");
const collectionF = require("../../model/Fmodel");
const collectionM = require("../../model/Mmodel");
const collectionA = require("../../model/Amodel");
const collectionC = require("../../model/Cmodel");
const collectionMsg = require("../../model/messages");

const userAuth = (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) res.status(403).json({ message: "Invalid Token" });
    else if (decoded?.data) {
      //modified from if to else if statement
      const user = await collectionC.findOne({ UserName: decoded.data });
      const freelancer = await collectionF.find();
      res.send({ user, freelancer });
    } else res.send(false);
  });
};

const showUserTasks = async (req, res) => {
  const requests = await collectionC.findOne({
    UserName: req.params.userId,
  });

  res.send(requests);
};

const showUserMsg = async (req, res) => {
  const msgUpdate = await collectionMsg.findOne({
    lancerId: req.params.fUser,
    clientId: req.params.userId,
  });
  res.send(msgUpdate);
};

const searchLancer = async (req, res) => {
  const { searchSkill } = req.body;
  const searchLancerSkill = await collectionF.find({ Skill: searchSkill });
  const searchLancerId = await collectionF.findOne({ UserName: searchSkill });

  if (!searchLancerSkill && !searchLancerId) {
    res.send("");
  } else if (searchLancerSkill) {
    res.send(searchLancerSkill);
  } else {
    res.send(searchLancerId);
  }
};

const cancelTask = async (req, res) => {
  const { lancerIds } = req.body;

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
};

const requestTask = async (req, res) => {
  const { lancerId, clientId, taskName, taskDescription } = req.body;

  const connectionCheck = await collectionMsg.findOne({
    lancerId: lancerId,
    clientId: clientId,
  });
  const lancerConnectionCheck = await collectionF.findOne({
    UserName: lancerId,
    bufferRequests: { $elemMatch: { clientId: clientId } },
  });

  const clientConnectionCheck = await collectionC.findOne({
    UserName: clientId,
    bufferRequests: { $elemMatch: { lancerId: lancerId } },
  });

  if (!connectionCheck && !lancerConnectionCheck) {
    const freelancer = await collectionF.findOneAndUpdate(
      { UserName: lancerId },
      {
        $push: {
          bufferRequests: {
            clientIds: clientId,
            taskName: taskName,
            taskDescription: taskDescription,
          },
        },
      }
    );
  }

  if (!connectionCheck && !clientConnectionCheck) {
    const user = await collectionC.findOneAndUpdate(
      { UserName: clientId },
      {
        $push: {
          bufferRequests: {
            lancerIds: lancerId,
            taskName: taskName,
            taskDescription: taskDescription,
          },
        },
      }
    );
  }

  await collectionC.findOneAndUpdate(
    { userName: req.params.userId },
    { profilePic: req.file }
  );

  res.send("Ok");
};
const userMsg = async (req, res) => {
  const { msgContent } = req.body;
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
  res.send(msgUpdate);
};

module.exports = {
  userAuth,
  showUserMsg,
  searchLancer,
  cancelTask,
  requestTask,
  showUserTasks,
  userMsg,
};
