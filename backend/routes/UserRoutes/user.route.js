const express = require("express");

const {
  userAuth,
  showUserMsg,
  searchLancer,
  cancelTask,
  requestTask,
  showUserTasks,
  userMsg,
  postTask,
  profileUpdate,
} = require("../controllers/user");
const userRouter = express.Router();

/* Router level middleware */

//get methods
userRouter.get("/:userId", userAuth);
userRouter.get("/:userId/tasks/:fUser/messages", showUserMsg);
userRouter.get("/:userId/tasks", showUserTasks);

//post methods
userRouter.post("/:userId", searchLancer, postTask);
userRouter.post("/:userId/tasks", cancelTask);
userRouter.post("/:userId/:fUser/requestPage", requestTask);
userRouter.post("/:userId/tasks/:fUser/messages", userMsg);
userRouter.post('/:userId/post-task', postTask);

//put methods
userRouter.put('/:userId/profile', profileUpdate)

module.exports = userRouter;
