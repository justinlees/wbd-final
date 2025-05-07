const jwt = require("jsonwebtoken");
const collectionF = require("../../model/Fmodel");
const collectionM = require("../../model/Mmodel");
const collectionA = require("../../model/Amodel");
const collectionC = require("../../model/Cmodel");
const collectionMsg = require("../../model/messages");
const redisClient = require("../../utils/redisClient");

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
    // Check if the data is already cached
    const cachedLancers = await redisClient.get("allLancers");

    if (cachedLancers) {
      console.log("Serving adminShowLancers from cache");
      return res.status(200).json(JSON.parse(cachedLancers));
    }

    // Fetch from database if not cached
    const allLancers = await collectionF
      .find()
      .select("UserName Email MobileNo Skill")
      .lean();

    // Cache the result for 10 minutes (600 seconds)
    await redisClient.setEx("allLancers", 600, JSON.stringify(allLancers));
    console.log("Serving adminShowLancers from database and caching");

    res.status(200).send(allLancers);
  } catch (error) {
    res.status(500).json({ message: "Couldn't fetch Freelancer details", error });
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
