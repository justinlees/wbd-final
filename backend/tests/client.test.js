const request = require("supertest");
const app = require("../server"); // adjust the path if needed
const bcrypt = require("bcrypt");
const collectionF = require("../model/Fmodel");
const collectionC = require("../model/Cmodel");
const collectionMsg = require("../model/messages");

describe("Client Routes", () => {
  let clientId;
  let lancerId;

  beforeEach(async () => {
    // Seed test data into in-memory MongoDB
    var pass = await bcrypt.hash("password", 10);
    const client = await collectionC.create({
      UserName: "testClient11",
      Email: "client1@gmail.com",
      Password: pass,
      bufferRequests: [],
    });

    const lancer = await collectionF.create({
      UserName: "testLancer11",
      Email: "lancer1@gmail.com",
      Password: pass,
      Skill: "JavaScript",
      bufferRequests: [],
    });

    await collectionMsg.create({
      lancerId: "testLancer11",
      clientId: "testClient11",
      allMessages: [],
    });

    clientId = client.UserName;
    lancerId = lancer.UserName;
  });

  afterEach(async () => {
    await collectionF.deleteMany({});
    await collectionC.deleteMany({});
    await collectionMsg.deleteMany({});
  });

  it("should return user and freelancers on userAuth", async () => {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { data: "testClient11" },
      process.env.JWT_SECRET || "test-secret"
    );

    const res = await request(app)
      .get(`/home/${clientId}`)
      .set("Authorization", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.UserName).toBe("testClient11");
    expect(Array.isArray(res.body.freelancer)).toBe(true);
  });

  it("should return user messages", async () => {
    const res = await request(app).get(
      `/home/${clientId}/tasks/${lancerId}/messages`
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.clientId).toBe("testClient11");
  });

  it("should cancel task properly", async () => {
    await collectionF.findOneAndUpdate(
      { UserName: lancerId },
      {
        $push: {
          bufferRequests: { clientIds: clientId },
        },
      }
    );

    await collectionC.findOneAndUpdate(
      { UserName: clientId },
      {
        $push: {
          bufferRequests: { lancerIds: lancerId },
        },
      }
    );

    const res = await request(app)
      .post(`/home/${clientId}/tasks`)
      .send({ lancerIds: lancerId });

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("requestCancel");
  });
});
