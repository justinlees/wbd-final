const jwt = require("jsonwebtoken");
const collectionF = require("../../model/Fmodel");
const collectionM = require("../../model/Mmodel");
const collectionA = require("../../model/Amodel");
const collectionC = require("../../model/Cmodel");
const collectionMsg = require("../../model/messages");

const adminAuth = (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "Token required" });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    try {
      const admin = await collectionA
        .findOne({ UserName: decoded.data })
        .lean();
      const allClients = await collectionC
        .find()
        .select("UserName Email MobileNo")
        .lean();
      res.status(200).send({ admin, allClients });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error in loading data or server error", error });
    }
  });
};

const adminShowLancers = async (req, res) => {
  try {
    const allLancers = await collectionF
      .find()
      .select("UserName Email MobileNo Skill")
      .lean();
    res.status(200).send(allLancers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Coudn't fetch Freelancer details", error });
  }
};

const adminDeleteLancer = async (req, res) => {
  try {
    const lancerDetails = await collectionF.deleteOne({
      UserName: req.body.lancerId,
    });
    res.status(200).send("deleted");
  } catch (error) {
    res.status(500).json({ message: "Unable to delete", error });
  }
};

const adminDeleteClient = async (req, res) => {
  try {
    const clientDetails = await collectionC.deleteOne({
      UserName: req.body.clientId,
    });
    res.status(200).send("deleted");
  } catch (error) {
    res.status(500).json({ message: "Unable to delete", error });
  }
};

module.exports = {
  adminAuth,
  adminShowLancers,
  adminDeleteLancer,
  adminDeleteClient,
};
