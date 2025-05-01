const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
//const { GridFsStorage } = require("multer-gridfs-storage");
const url = "mongodb://localhost:27017/JobDone";
const mongoose = require("mongoose");
const collectionF = require("./model/Fmodel");
const collectionM = require("./model/Mmodel");
const collectionA = require("./model/Amodel");
const collectionC = require("./model/Cmodel");
const collectionMsg = require("./model/messages");

const lancerRouter = require("./routes/LancerRoutes/lancer.route");
const userRouter = require("./routes/UserRoutes/user.route");
const adminRouter = require("./routes/AdminRoutes/admin.route");

//const storage = new GridFsStorage({ url });
//const upload = multer({ storage });

require("dotenv").config();

/* In-built middlewares */

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("/public"));

/* third party middleware */

app.use(
  cors({
    origin: "https://freelancing-frontend-lake.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const mongodbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`connected to database ${conn.connection.host}`);
  } catch (error) {
    console.log("failed to connect to database", error);
    process.exit(1);
  }
};

// get requests //

// app.get("/home/:userId/tasks", async (req, res) => {
//   const requests = await collectionC.findOne({
//     UserName: req.params.userId,
//   });

//   res.send(requests);
// });

/* Application level middleware */

app.use("/home", userRouter);
app.use("/freelancer", lancerRouter);
app.use("/admin", adminRouter);

/*
// app.get("/freelancer/:fUser", async (req, res) => {
//   const token = req.headers["authorization"];

//   if (!token) {
//     return res.status(403).json({ message: "Token required" });
//   }

//   jwt.verify(token, "mySecret", async (err, decoded) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });

//     const freelancer = await collectionF.findOne({ UserName: decoded.data });
//     res.send(freelancer);
//   });
// });

app.use("/freelancer", lancerRouter);

// app.get("/admin/:aUser", (req, res) => {
//   const token = req.headers["authorization"];

//   if (!token) {
//     return res.status(403).json({ message: "Token required" });
//   }

//   jwt.verify(token, "mySecret", async (err, decoded) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });

//     const admin = await collectionA.findOne({ UserName: decoded.data });
//     const allClients = await collectionC.find();
//     res.send({ admin, allClients });
//   });
// });

app.use("/admin", adminRouter);

app.get("/manager/:mUser", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token required" });
  }

  jwt.verify(token, "mySecret", async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const manager = await collectionM.findOne({ UserName: decoded.data });
    res.send(manager);
  });
});

// app.get("/home/:userId", (req, res) => {
//   const token = req.headers["authorization"];

//   if (!token) {
//     return res.status(403).json({ message: "No token" });
//   }

//   jwt.verify(token, "mySecret", async (err, decoded) => {
//     if (err) res.status(403).json({ message: "Invalid Token" });
//     else if (decoded?.data) {
//       //modified from if to else if statement
//       const user = await collectionC.findOne({ UserName: decoded.data });
//       const freelancer = await collectionF.find();
//       res.send({ user, freelancer });
//     } else res.send(false);
//   });
// });

app.use("/home", userRouter);

// app.get("/freelancer/:fUser/tasks/:userId/messages", async (req, res) => {
//   const msgUpdate = await collectionMsg.findOne({
//     lancerId: req.params.fUser,
//     clientId: req.params.userId,
//   });
//   res.send(msgUpdate);
// });

app.use("/freelancer", lancerRouter);

// app.get("/home/:userId/tasks/:fUser/messages", async (req, res) => {
//   const msgUpdate = await collectionMsg.findOne({
//     lancerId: req.params.fUser,
//     clientId: req.params.userId,
//   });
//   res.send(msgUpdate);
// });

app.use("/home", userRouter);

// app.get("/admin/:aUser/utilities", async (req, res) => {
//   const allLancers = await collectionF.find();
//   res.send(allLancers);
// });

app.use("/admin", adminRouter);
*/

// post requests //

/* User Login */

app.post("/login", async (req, res) => {
  const { UserName, Password } = req.body;
  const freelancer = await collectionF.findOne({ UserName: UserName });
  const client = await collectionC.findOne({ UserName: UserName });
  const admin = await collectionA.findOne({ UserName: UserName });
  const manager = await collectionM.findOne({ UserName: UserName });

  if (!freelancer && !admin && !manager && !client) {
    res.send("NoUser");
  } else if (freelancer) {
    if (!(await bcrypt.compare(Password, freelancer.Password))) {
      res.send("check");
    } else {
      const token = jwt.sign(
        {
          data: freelancer.UserName,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1hr" }
      );

      res.send({ token, freelancer });
    }
  } else if (admin) {
    if (!(await bcrypt.compare(Password, admin.Password))) {
      res.send("check");
    } else {
      const token = jwt.sign(
        {
          data: admin.UserName,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1hr" }
      );
      res.send({ token, admin });
    }
  } else if (client) {
    if (!(await bcrypt.compare(Password, client.Password))) {
      res.send("check");
    } else {
      const token = jwt.sign(
        {
          data: client.UserName,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1hr" }
      );
      res.send({ token, client });
    }
  } else if (manager) {
    if (!(await bcrypt.compare(Password, manager.Password))) {
      res.send("check");
    } else {
      const token = jwt.sign(
        {
          data: manager.UserName,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1hr" }
      );
      res.send({ token, manager });
    }
  }
});

/* Freelancer SignUp */

app.post("/signUp/freelancer", async (req, res) => {
  const { UserName } = req.body;
  const FuserCheck = await collectionF.findOne({ UserName: UserName });
  const AuserCheck = await collectionA.findOne({ UserName: UserName });
  const MuserCheck = await collectionM.findOne({ UserName: UserName });
  const CuserCheck = await collectionC.findOne({ UserName: UserName });

  if (!FuserCheck && !AuserCheck && !MuserCheck && !CuserCheck) {
    req.body.Password = await bcrypt.hash(req.body.Password, 10);
    const data = await collectionF.create(req.body);
    res.send(data.UserName);
  } else {
    const set = false;
    res.send(set);
  }
});

/* User SignUp */

app.post("/signUp/user", async (req, res) => {
  const { UserName } = req.body;
  const FuserCheck = await collectionF.findOne({ UserName: UserName });
  const AuserCheck = await collectionA.findOne({ UserName: UserName });
  const MuserCheck = await collectionM.findOne({ UserName: UserName });
  const CuserCheck = await collectionC.findOne({ UserName: UserName });

  if (!FuserCheck && !AuserCheck && !MuserCheck && !CuserCheck) {
    req.body.Password = await bcrypt.hash(req.body.Password, 10);
    const data = await collectionC.create(req.body);
    res.send(data.UserName);
  } else {
    const set = false;
    res.send(set);
  }
});

/* Not there */
app.post("/admin/:aUser/managersInfo", async (req, res) => {
  const { UserName } = req.body;
  const FuserCheck = await collectionF.findOne({ UserName: UserName });
  const AuserCheck = await collectionA.findOne({ UserName: UserName });
  const MuserCheck = await collectionM.findOne({ UserName: UserName });
  const CuserCheck = await collectionC.findOne({ UserName: UserName });

  console.log("234");

  if (!FuserCheck && !AuserCheck && !MuserCheck && !CuserCheck) {
    req.body.Password = await bcrypt.hash(req.body.Password, 10);
    const data = await collectionM.create(req.body);
    console.log("managerCreated");
    res.send(data.UserName);
  } else {
    const set = false;
    res.send(set);
  }
});
/*
// app.post("/home/:userId", async (req, res) => {
//   const { searchSkill } = req.body;
//   const searchLancerSkill = await collectionF.find({ Skill: searchSkill });
//   const searchLancerId = await collectionF.findOne({ UserName: searchSkill });

//   if (!searchLancerSkill && !searchLancerId) {
//     res.send("");
//   } else if (searchLancerSkill) {
//     res.send(searchLancerSkill);
//   } else {
//     res.send(searchLancerId);
//   }
// });

app.use("/home", userRouter);

// app.post("/home/:userId/tasks", async (req, res) => {
//   const { lancerIds } = req.body;

//   const updateLancer = await collectionF.findOneAndUpdate(
//     {
//       UserName: lancerIds,
//       bufferRequests: { $elemMatch: { clientIds: req.params.userId } },
//     },
//     { $pull: { bufferRequests: { clientIds: req.params.userId } } }
//   );
//   if (!updateLancer) {
//     res.send("alreadyAccepted");
//   } else {
//     const updateClient = await collectionC.findOneAndUpdate(
//       { UserName: req.params.userId },
//       { $pull: { bufferRequests: { lancerIds: lancerIds } } }
//     );
//     res.send("requestCancel");
//   }
// });

app.use("/home", userRouter);

// app.post("/home/:userId/:fUser/requestPage", async (req, res) => {
//   const { lancerId, clientId, taskName, taskDescription } = req.body;

//   const connectionCheck = await collectionMsg.findOne({
//     lancerId: lancerId,
//     clientId: clientId,
//   });
//   const lancerConnectionCheck = await collectionF.findOne({
//     UserName: lancerId,
//     bufferRequests: { $elemMatch: { clientId: clientId } },
//   });

//   const clientConnectionCheck = await collectionC.findOne({
//     UserName: clientId,
//     bufferRequests: { $elemMatch: { lancerId: lancerId } },
//   });

//   if (!connectionCheck && !lancerConnectionCheck) {
//     const freelancer = await collectionF.findOneAndUpdate(
//       { UserName: lancerId },
//       {
//         $push: {
//           bufferRequests: {
//             clientIds: clientId,
//             taskName: taskName,
//             taskDescription: taskDescription,
//           },
//         },
//       }
//     );
//   }

//   if (!connectionCheck && !clientConnectionCheck) {
//     const user = await collectionC.findOneAndUpdate(
//       { UserName: clientId },
//       {
//         $push: {
//           bufferRequests: {
//             lancerIds: lancerId,
//             taskName: taskName,
//             taskDescription: taskDescription,
//           },
//         },
//       }
//     );
//   }

//   await collectionC.findOneAndUpdate(
//     { userName: req.params.userId },
//     { profilePic: req.file }
//   );

//   res.send("Ok");
// });

app.use("/home", userRouter);

// app.post("/freelancer/:fUser/tasks", async (req, res) => {
//   const { clientIds, requestVal, taskName, taskDescription, currAmount } =
//     req.body;
//   console.log("entered");
//   if (requestVal === "accept") {
//     console.log("accepted");
//     const lancerRequestOp = await collectionF.findOneAndUpdate(
//       { UserName: req.params.fUser },
//       {
//         $pull: {
//           bufferRequests: {
//             clientIds: clientIds,
//             taskName: taskName,
//             taskDescription: taskDescription,
//           },
//         },
//         currAmount: parseInt(currAmount) - parseInt(2),
//       }
//     );

//     const clientRequestOp = await collectionC.findOneAndUpdate(
//       { UserName: clientIds },
//       {
//         $pull: {
//           bufferRequests: {
//             lancerIds: req.params.fUser,
//             taskName: taskName,
//             taskDescription: taskDescription,
//           },
//         },
//       }
//     );

//     const lancerUpdateReq = await collectionF.findOneAndUpdate(
//       { UserName: req.params.fUser },
//       {
//         $push: {
//           tasksAssigned: {
//             clientId: clientIds,
//             taskName: taskName,
//             taskDescription: taskDescription,
//           },
//         },
//       }
//     );

//     const clientUpdateReq = await collectionC.findOneAndUpdate(
//       { UserName: clientIds },
//       {
//         $push: {
//           tasksRequested: {
//             lancerId: req.params.fUser,
//             taskName: taskName,
//             taskDescription: taskDescription,
//           },
//         },
//       }
//     );
//     const connectionCheck = await collectionMsg.findOne({
//       clientId: clientIds,
//       lancerId: req.params.fUser,
//     });
//     if (!connectionCheck) {
//       const messageConnection = await collectionMsg.insertMany({
//         clientId: clientIds,
//         lancerId: req.params.fUser,
//       });
//     }
//   } else if (requestVal === "reject") {
//     console.log("rejected");
//     const lancerRequestOp = await collectionF.findOneAndUpdate(
//       { UserName: req.params.fUser },
//       {
//         $pull: {
//           bufferRequests: {
//             clientIds: clientIds,
//             taskName: taskName,
//             taskDescription: taskDescription,
//           },
//         },
//       }
//     );

//     const clientRequestOp = await collectionC.findOneAndUpdate(
//       { UserName: clientIds },
//       {
//         $pull: {
//           bufferRequests: {
//             lancerIds: req.params.fUser,
//             taskName: taskName,
//             taskDescription: taskDescription,
//           },
//         },
//       }
//     );
//   }

//   res.send("requestDone");
// });

app.use("/freelancer", lancerRouter);

// app.post("/freelancer/:fUser/tasks/:userId/messages", async (req, res) => {
//   const { msgContent } = req.body;
//   const msgUpdate = await collectionMsg.findOneAndUpdate(
//     {
//       lancerId: req.params.fUser,
//       clientId: req.params.userId,
//     },
//     {
//       $push: {
//         allMessages: {
//           userId: req.params.fUser,
//           msgContent: msgContent,
//           msgDate: Date.now(),
//         },
//       },
//     }
//   );
//   res.send(msgUpdate);
// });

app.use("/freelancer", lancerRouter);

// app.post("/home/:userId/tasks/:fUser/messages", async (req, res) => {
//   const { msgContent } = req.body;
//   const msgUpdate = await collectionMsg.findOneAndUpdate(
//     {
//       lancerId: req.params.fUser,
//       clientId: req.params.userId,
//     },
//     {
//       $push: {
//         allMessages: {
//           userId: req.params.userId,
//           msgContent: msgContent,
//           msgDate: Date.now(),
//         },
//       },
//     }
//   );
//   res.send(msgUpdate);
// });

app.use("/home", userRouter);

// app.post("/freelancer/:fUser/earnings", async (req, res) => {
//   const findLancer = await collectionF.findOne({ UserName: req.params.fUser });
//   if (!findLancer) {
//     res.send(null);
//   } else {
//     const price = req.body.amount;
//     console.log("profit");
//     const lancerUpdate = await collectionF.findOneAndUpdate(
//       { UserName: req.params.fUser },
//       { currAmount: parseInt(findLancer.currAmount) + parseInt(price) }
//     );

//     const adminProfit = await collectionA.findOneAndUpdate(
//       { UserName: "dheeraj17" },
//       { $inc: { currAmount: 2 } }
//     );
//     res.send(true);
//   }
// });

app.use("/freelancer", lancerRouter);

// app.post("/freelancer/:fUser/profile", async (req, res) => {
//   const deleteAccount = await collectionF.deleteMany({
//     UserName: req.params.fUser,
//   });
//   res.send("success");
// });

app.use("/freelancer", lancerRouter);

// app.post("/freelancer/:fUser/tasks/acceptedTasks", async (req, res) => {
//   console.log("accepted");
//   const taskFinish = await collectionF.findOneAndUpdate(
//     { UserName: req.params.fUser },
//     { $pull: { tasksAssigned: { clientId: req.body.clientId } } }
//   );
//   const clientTaskFinish = await collectionC.findOneAndUpdate(
//     { UserName: req.body.clientId },
//     { $pull: { tasksRequested: { lancerId: req.params.fUser } } }
//   );

//   const addClientFinishTasks = await collectionC.findOneAndUpdate(
//     { UserName: req.body.clientId },
//     {
//       $push: {
//         finishedTasks: {
//           lancerId: req.params.fUser,
//           taskName: req.body.taskName,
//         },
//       },
//     }
//   );
//   const addFinishTasks = await collectionF.findOneAndUpdate(
//     { UserName: req.params.fUser },
//     {
//       $push: {
//         finishedTasks: {
//           clientId: req.body.clientId,
//           taskName: req.body.taskName,
//         },
//       },
//     }
//   );
//   const deleteConnection = await collectionMsg.deleteOne({
//     clientId: req.body.clientId,
//     lancerId: req.params.fUser,
//   });
//   res.send("success");
// });

app.use("/freelancer", lancerRouter);

// app.post("/admin/:aUser/utilities", async (req, res) => {
//   const lancerDetails = await collectionF.deleteOne({
//     UserName: req.body.lancerId,
//   });
//   res.send("deleted");
// });

app.use("/admin", adminRouter);

// app.get("/admin/:aUser", async (req, res) => {
//   const allClients = await collectionC.find();
//   res.send(allClients);
// });
*/
app.post("/updatePassword", async (req, res) => {
  const { OldPassword, NewPassword, ReNewPassword } = req.body;
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    let user;
    user = await collectionF.findOne({ UserName: decoded.data });
    if (!user) user = await collectionA.findOne({ UserName: decoded.data });
    if (!user) user = await collectionC.findOne({ UserName: decoded.data });
    if (!user) user = await collectionM.findOne({ UserName: decoded.data });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(OldPassword, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(NewPassword, salt);

    user.Password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  });
});

// OTP Generation and Validation
const verificationStore = {};

// Email Validation during SignUp
// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/send-verification-email", async (req, res) => {
  const { Email } = req.body;

  if (!Email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
  const expirationTime = Date.now() + 5 * 60 * 1000; // Set expiration time to 5 minutes from now
  verificationStore[Email] = {
    code: verificationCode,
    expires: expirationTime,
  }; // Store the code and expiration time
  console.log("ENTERED IN");
  try {
    console.log("Try block");
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: Email,
      subject: "Email Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    });

    res.json({ message: "Verification email sent!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

app.post("/validate-code", (req, res) => {
  const { Email, code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Code is required" });
  }

  const record = verificationStore[Email];
  if (record) {
    const currentTime = Date.now();
    if (currentTime > record.expires) {
      delete verificationStore[Email]; // Remove the expired code
      return res
        .status(400)
        .json({ message: "Verification code has expired." });
    }
    if (record.code.toString() === code) {
      delete verificationStore[Email]; // Remove the code after successful validation
      return res.status(200).json({ message: "Email verified successfully!" });
    }
  }

  return res.status(400).json({ message: "Invalid code or email." });
});

// Forgot Password
app.post("/forgot-password", async (req, res) => {
  const { Email } = req.body;

  if (!Email) {
    return res.status(400).json({ message: "Email is required" });
  }

  let user;
  user =
    (await collectionF.findOne({ Email })) ||
    (await collectionA.findOne({ Email })) ||
    (await collectionC.findOne({ Email })) ||
    (await collectionM.findOne({ Email }));

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
  const expirationTime = Date.now() + 5 * 60 * 1000; // Set expiration time to 5 minutes from now
  verificationStore[Email] = {
    code: verificationCode,
    expires: expirationTime,
  }; // Store the code and expiration time

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: Email,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is: ${verificationCode}`,
    });

    res.json({ message: "OTP sent to your email!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { Email, newPassword } = req.body;

  if (!Email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email and new password are required" });
  }

  let user;
  user =
    (await collectionF.findOne({ Email })) ||
    (await collectionA.findOne({ Email })) ||
    (await collectionC.findOne({ Email })) ||
    (await collectionM.findOne({ Email }));

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.Password = hashedPassword;
  await user.save();

  res.status(200).json({ message: "Password reset successfully." });
});

// Checking if Email Already Exists
app.post("/check-repeated-email", async (req, res) => {
  const { Email } = req.body;
  let user;
  user =
    (await collectionF.findOne({ Email })) ||
    (await collectionA.findOne({ Email })) ||
    (await collectionC.findOne({ Email })) ||
    (await collectionM.findOne({ Email }));

  if (user) {
    return res.status(409).json({ message: "User already Exists." });
  }

  return res.status(200).json({ message: "New User" });
});

// Checking if UserName Already Exists
app.post("/check-repeated-username", async (req, res) => {
  const { UserName } = req.body;

  let user;
  user =
    (await collectionF.findOne({ UserName })) ||
    (await collectionA.findOne({ UserName })) ||
    (await collectionC.findOne({ UserName })) ||
    (await collectionM.findOne({ UserName }));

  if (user) {
    return res.status(409).json({ message: "User already Exists." });
  }

  return res.status(200).json({ message: "New User" });
});

/* Error-handling middleware */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(process.env.PORT || 5500, () => {
  console.log("Server Running in ", process.env.PORT);
  mongodbConnect();
});
