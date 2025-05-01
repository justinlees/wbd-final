const jwt = require("jsonwebtoken");
const collectionF = require("../../model/Fmodel");
const collectionM = require("../../model/Mmodel");
const collectionA = require("../../model/Amodel");
const collectionC = require("../../model/Cmodel");
const collectionMsg = require("../../model/messages");

const adminAuth = (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token required" });
  }

  jwt.verify(token, "mySecret", async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const admin = await collectionA.findOne({ UserName: decoded.data });
    const allClients = await collectionC.find();
    res.send({ admin, allClients });
  });
};

const adminShowLancers = async (req, res) => {
  const allLancers = await collectionF.find();
  res.send(allLancers);
};

const adminDeleteLancer = async (req, res) => {
  const lancerDetails = await collectionF.deleteOne({
    UserName: req.body.lancerId,
  });
  res.send("deleted");
};

module.exports = { adminAuth, adminShowLancers, adminDeleteLancer };
