const request = require("supertest");
const app = require("../server"); // adjust the path if needed
const bcrypt = require("bcrypt");
const collectionF = require("../model/Fmodel");
const collectionC = require("../model/Cmodel");
const collectionMsg = require("../model/messages");

describe("Client Routes", () => {
  let clientId;
  let lancerId;
  let token;

  beforeEach(async () => {
    const jwt = require("jsonwebtoken");
    const pass = await bcrypt.hash("password", 10);

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

    clientId = client.UserName;
    lancerId = lancer.UserName;

    token = jwt.sign(
      { data: client.UserName },
      process.env.JWT_SECRET || "test-secret",
      { expiresIn: "1hr" }
    );
  });

  afterEach(async () => {
    await collectionF.deleteMany({});
    await collectionC.deleteMany({});
    await collectionMsg.deleteMany({});
  });

  //   it("should return user and freelancers on userAuth", async () => {
  //     const res = await request(app)
  //       .get(`/home/${clientId}`)
  //       .set("authorization", `Bearer ${token}`);

  //     expect(res.statusCode).toBe(200);
  //     expect(res.body.user.UserName).toBe("testClient11");
  //     expect(Array.isArray(res.body.freelancer)).toBe(true);
  //   });

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
