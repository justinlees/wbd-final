const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const collectionF = require("../model/Fmodel");
const collectionC = require("../model/Cmodel");
const collectionMsg = require("../model/messages");
const collectionA = require("../model/Amodel");
const bcrypt = require("bcrypt");

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  // Clean DB
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany();
  }

  // Seed data
  var pass = await bcrypt.hash("password", 10);
  await collectionF.create({
    UserName: "freelancer11",
    Email: "freelancer11@gmail.com",
    Password: pass,
    currAmount: 100,
    bufferRequests: [],
    tasksAssigned: [],
    finishedTasks: [],
  });

  await collectionC.create({
    UserName: "client11",
    Email: "client11@gmail.com",
    Password: pass,
    currAmount: 50,
    bufferRequests: [],
    tasksRequested: [],
    finishedTasks: [],
  });

  await collectionMsg.create({
    lancerId: "freelancer11",
    clientId: "client11",
    allMessages: [],
  });

  await collectionA.create({
    UserName: "varunpuli11",
    Email: "varunpuli11@gmail.com",
    Password: pass,
    currAmount: 1000,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});
