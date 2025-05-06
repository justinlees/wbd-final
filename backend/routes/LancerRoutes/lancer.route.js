const express = require("express");
const lancerRouter = express.Router();
const storage = require('../../config/storage');
const multer = require("multer");

const upload = multer({ storage });

const {
  lancerAuth,
  showLancerMsg,
  lancerTasks,
  lancerAccountDelete,
  lancerMsg,
  finishedTasks,
  lancerEarnings,
  profileUpload,
  createPaymentIntent,
  exploreTasks,
} = require("../controllers/lancer");

/* Router level middleware */

//get routes
lancerRouter.get("/:fUser", lancerAuth);
lancerRouter.get("/:fUser/tasks/:userId/messages", showLancerMsg);
lancerRouter.get("/:fUser/explore", exploreTasks);

//post routes
lancerRouter.post("/:fUser", upload.single("profilePic"), profileUpload);
lancerRouter.post("/:fUser/tasks", lancerTasks);
lancerRouter.post("/:fUser/tasks/:userId/messages", lancerMsg);
lancerRouter.post("/:fUser/earnings", lancerEarnings);
lancerRouter.post("/:fUser/profile", lancerAccountDelete);
lancerRouter.post("/:fUser/tasks/acceptedTasks", finishedTasks);
lancerRouter.post("/:fUser/create-payment-intent", createPaymentIntent);

module.exports = lancerRouter;