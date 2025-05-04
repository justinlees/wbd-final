const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const collectionF = require("../model/Fmodel");
const collectionC = require("../model/Cmodel");
const collectionMsg = require("../model/messages");
const collectionA = require("../model/Amodel");

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
  await collectionF.create({
    UserName: "freelancer1",
    currAmount: 100,
    bufferRequests: [],
    tasksAssigned: [],
    finishedTasks: [],
  });

  await collectionC.create({
    UserName: "client1",
    currAmount: 50,
    bufferRequests: [],
    tasksRequested: [],
    finishedTasks: [],
  });

  await collectionMsg.create({
    lancerId: "freelancer1",
    clientId: "client1",
    allMessages: [],
  });

  await collectionA.create({
    UserName: "varunpuli11",
    currAmount: 1000,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});
