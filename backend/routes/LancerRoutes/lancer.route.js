const express = require("express");
const lancerRouter = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../../public/profile");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

const {
  lancerAuth,
  showLancerMsg,
  lancerTasks,
  lancerAccountDelete,
  lancerMsg,
  finishedTasks,
  lancerEarnings,
  profileUpload,
} = require("../controllers/lancer");

/* Router level middleware */

//get routes
lancerRouter.get("/:fUser", lancerAuth);
lancerRouter.get("/:fUser/tasks/:userId/messages", showLancerMsg);

//post routes
lancerRouter.post("/:fUser", upload.single("profilePic"), profileUpload);
lancerRouter.post("/:fUser/tasks", lancerTasks);
lancerRouter.post("/:fUser/tasks/:userId/messages", lancerMsg);
lancerRouter.post("/:fUser/earnings", lancerEarnings);
lancerRouter.post("/:fUser/profile", lancerAccountDelete);
lancerRouter.post("/:fUser/tasks/acceptedTasks", finishedTasks);

module.exports = lancerRouter;
