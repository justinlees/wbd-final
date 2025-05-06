/* Freelancer Controls */

const jwt = require("jsonwebtoken");
const collectionF = require("../../model/Fmodel");
const collectionM = require("../../model/Mmodel");
const collectionA = require("../../model/Amodel");
const collectionC = require("../../model/Cmodel");
const collectionMsg = require("../../model/messages");
const collectionTask = require("../../model/Task");
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Freelancer token authentication
const lancerAuth = async (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "Token required" });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    try {
      const freelancer = await collectionF
        .findOne({ UserName: decoded.data })
        .lean();
      console.log("Token Created, Logged in");
      res.status(200).send(freelancer);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
};

// Freelancer message display
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

// Freelancer profile upload
const profileUpload = async (req, res) => {
  try {
    console.log(req.params.fUser);
    console.log(req.file); // multer + cloudinary adds file info here

    const imageUrl = req.file.path;       // Cloudinary URL
    const publicId = req.file.filename;   // Cloudinary public ID

    const findUser = await collectionF.findOneAndUpdate(
      { UserName: req.params.fUser },
      { profilePic: imageUrl }, // Save full URL
      { new: true }
    );

    if (findUser) {
      console.log("Profile Uploaded");
      res.status(200).json({ success: true, url: imageUrl });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Freelancer task request operation ("accept" / "reject")
const lancerTasks = async (req, res) => {
  const { clientIds, requestVal, taskName, taskDescription } = req.body;
  try {
    console.log("TaskRoute");
    if (requestVal === "accept") {
      console.log("accepted");
      await collectionF.findOneAndUpdate(
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
        }
      );

      await collectionA.findOneAndUpdate(
        { UserName: "varunpuli11" },
        { $inc: { currAmount: 2 } }
      );

      await collectionC.findOneAndUpdate(
        { UserName: clientIds },
        {
          $pull: {
            bufferRequests: {
              lancerIds: req.params.fUser,
              taskName,
              taskDescription,
            },
          },
        }
      );

      await collectionF.findOneAndUpdate(
        { UserName: req.params.fUser },
        {
          $push: {
            tasksAssigned: {
              clientId: clientIds,
              taskName,
              taskDescription,
            },
          },
        }
      );

      await collectionC.findOneAndUpdate(
        { UserName: clientIds },
        {
          $push: {
            tasksRequested: {
              lancerId: req.params.fUser,
              taskName,
              taskDescription,
            },
          },
        }
      );

      const connectionCheck = await collectionMsg
        .findOne({
          clientId: clientIds,
          lancerId: req.params.fUser,
        })
        .lean();

      if (!connectionCheck) {
        await collectionMsg.insertMany({
          clientId: clientIds,
          lancerId: req.params.fUser,
        });
      }

      console.log("accept finish");
    } else if (requestVal === "reject") {
      console.log("rejected");
      await collectionF.findOneAndUpdate(
        { UserName: req.params.fUser },
        {
          $pull: {
            bufferRequests: {
              clientIds,
              taskName,
              taskDescription,
            },
          },
        }
      );

      await collectionC.findOneAndUpdate(
        { UserName: clientIds },
        {
          $pull: {
            bufferRequests: {
              lancerIds: req.params.fUser,
              taskName,
              taskDescription,
            },
          },
        }
      );
    }
    res.send("requestDone");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Operation failed");
  }
};

// Freelancer message entry
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
            msgContent,
            msgDate: Date.now(),
          },
        },
      }
    );
    console.log("msg sent");
    res.status(200).send(msgUpdate);
  } catch (error) {
    res.status(500).json({ message: "Message can't send", error });
  }
};

// Freelancer profits
const lancerEarnings = async (req, res) => {
  const findLancer = await collectionF
    .findOne({ UserName: req.params.fUser })
    .lean();
  if (!findLancer) {
    res.send(null);
  } else {
    const price = req.body.amount;
    console.log("profit");
    await collectionF.findOneAndUpdate(
      { UserName: req.params.fUser },
      { currAmount: parseInt(findLancer.currAmount) + parseInt(price) }
    );

    await collectionA.findOneAndUpdate(
      { UserName: "varunpuli11" },
      { $inc: { currAmount: 2 } }
    );
    res.status(200).send(true);
  }
};

// Freelancer account delete functionality
const lancerAccountDelete = async (req, res) => {
  try {
    await collectionF.deleteMany({ UserName: req.params.fUser });
    res.status(200).send("success");
  } catch (error) {
    res.status(500).json({ message: "Error in Deletion", error });
  }
};

// Freelancer finished tasks display
const finishedTasks = async (req, res) => {
  try {
    await collectionF.findOneAndUpdate(
      { UserName: req.params.fUser },
      { $pull: { tasksAssigned: { clientId: req.body.clientId } } }
    );

    await collectionC.findOneAndUpdate(
      { UserName: req.body.clientId },
      { $pull: { tasksRequested: { lancerId: req.params.fUser } } }
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
      }
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
      }
    );

    await collectionMsg.deleteOne({
      clientId: req.body.clientId,
      lancerId: req.params.fUser,
    });

    res.send("success");
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Couldn't perform requested operation", error });
  }
};

const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: "Payment failed", error });
  }
};

const exploreTasks = async (req, res) => {
  try {
    const tasks = await collectionTask.find(); // Optional populate if postedBy is a ref
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
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
  createPaymentIntent,
  exploreTasks
};