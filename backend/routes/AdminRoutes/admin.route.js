const express = require("express");

const {
  adminAuth,
  adminShowLancers,
  adminDeleteLancer,
  adminDeleteClient,
} = require("../controllers/admin");
const adminRouter = express.Router();

/* Router level middleware */

//get routes
adminRouter.get("/:aUser", adminAuth);
adminRouter.get("/:aUser/utilities", adminShowLancers);

//post routes
adminRouter.post("/:aUser", adminDeleteClient);
adminRouter.post("/:aUser/utilities", adminDeleteLancer);

module.exports = adminRouter;
