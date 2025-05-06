const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

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

const redisClient = require("./utils/redisClient");

//const storage = new GridFsStorage({ url });
//const upload = multer({ storage });

require("dotenv").config();

/* In-built middlewares */

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* third party middleware */

app.options("*", (req, res) => {
  // res.header(
  //   "Access-Control-Allow-Origin",
  //   "https://freelancing-frontend-lake.vercel.app"
  // );
  res.header(
    "Access-Control-Allow-Origin",
    "https://web-dev-taupe.vercel.app/"
  );
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.sendStatus(200); // Respond with HTTP 200 for preflight requests
});

app.use(
  cors({
    //origin: "https://freelancing-frontend-lake.vercel.app", // Allow only your frontend origin
    origin: "https://web-dev-taupe.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific HTTP methods
    allowedHeaders: ["Authorization", "Content-Type"], // Allow specific headers
    credentials: true, // Allow cookies and credentials
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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// get requests //

/* Application level middleware */

app.use("/home", userRouter);
app.use("/freelancer", lancerRouter);
app.use("/admin", adminRouter);

// post requests //

/* User Login */

app.post("/login", async (req, res) => {
  const { UserName, Password } = req.body;
  const freelancer = await collectionF.findOne({ UserName: UserName }).lean();
  const client = await collectionC.findOne({ UserName: UserName }).lean();
  const admin = await collectionA.findOne({ UserName: UserName }).lean();
  //const manager = await collectionM.findOne({ UserName: UserName }).lean();

  if (!freelancer && !admin && !client) {
    res.status(404).send("NoUser");
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

      res.status(200).send({ token, freelancer });
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
      res.status(200).send({ token, admin });
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
      res.status(200).send({ token, client });
    }
  }
});

/* Freelancer SignUp */

app.post("/signUp/freelancer", async (req, res) => {
  const { UserName } = req.body;
  const FuserCheck = await collectionF.findOne({ UserName: UserName }).lean();
  const AuserCheck = await collectionA.findOne({ UserName: UserName }).lean();
  //const MuserCheck = await collectionM.findOne({ UserName: UserName }).lean();
  const CuserCheck = await collectionC.findOne({ UserName: UserName }).lean();

  if (!FuserCheck && !AuserCheck && !CuserCheck) {
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
  const FuserCheck = await collectionF.findOne({ UserName: UserName }).lean();
  const AuserCheck = await collectionA.findOne({ UserName: UserName }).lean();
  //const MuserCheck = await collectionM.findOne({ UserName: UserName }).lean();
  const CuserCheck = await collectionC.findOne({ UserName: UserName }).lean();

  if (!FuserCheck && !AuserCheck && !CuserCheck) {
    req.body.Password = await bcrypt.hash(req.body.Password, 10);
    const data = await collectionC.create(req.body);
    res.send(data.UserName);
  } else {
    const set = false;
    res.send(set);
  }
});

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

module.exports = app;

/* Redis TEST */
app.get("/redis-test", async (req, res) => {
  try {
    await redisClient.set("healthcheck", "ok");
    const result = await redisClient.get("healthcheck");
    res.send(`Redis is working: ${result}`);
  } catch (err) {
    res.status(500).send(`Redis error: ${err.message}`);
  }
});

if (require.main === module) {
  // Only listen when running server.js directly
  app.listen(process.env.PORT || 5500, () => {
    console.log("Server Running in ", process.env.PORT);
    mongodbConnect();
  });
}
