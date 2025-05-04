const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server"); // Adjust path if needed
const bcrypt = require("bcrypt");
const collectionF = require("../model/Fmodel");
const collectionC = require("../model/Cmodel");
const collectionA = require("../model/Amodel");

describe("Admin Controller Tests with Route Params", () => {
  let adminToken;
  let adminUser;

  beforeEach(async () => {
    var pass = await bcrypt.hash("password", 10);
    adminUser = await collectionA.create({
      UserName: "adminTest11",
      Email: "admin@example.com",
      Password: pass,
      MobileNo: "1234567890",
    });

    adminToken = jwt.sign(
      { data: adminUser.UserName },
      process.env.JWT_SECRET || "test-secret",
      { expiresIn: "1hr" }
    );

    await collectionC.create({
      UserName: "clientTest11",
      Email: "client@example.com",
      Password: pass,
      MobileNo: "1111111111",
    });

    await collectionF.create({
      UserName: "lancerTest11",
      Email: "lancer@example.com",
      Password: pass,
      MobileNo: "2222222222",
    });
  });

  afterEach(async () => {
    await collectionF.deleteMany({});
    await collectionC.deleteMany({});
    await collectionA.deleteMany({});
  });

  describe("GET /admin/:aUser", () => {
    // it("should return admin and clients with valid token", async () => {
    //   const res = await request(app)
    //     .get(`/admin/${adminUser.UserName}`)
    //     .set("authorization", `Bearer ${adminToken}`);

    //   expect(res.statusCode).toBe(200);
    //   expect(res.body.admin.UserName).toBe("adminTest11");
    //   expect(Array.isArray(res.body.allClients)).toBe(true);
    // });

    it("should return 403 if token is missing", async () => {
      const res = await request(app).get(`/admin/${adminUser.UserName}`);
      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Token required");
    });

    it("should return 403 if token is invalid", async () => {
      const res = await request(app)
        .get(`/admin/${adminUser.UserName}`)
        .set("Authorization", "invalidToken");

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Invalid token");
    });
  });

  describe("GET /admin/:aUser/utilities", () => {
    it("should return list of all freelancers", async () => {
      const res = await request(app)
        .get(`/admin/${adminUser.UserName}/utilities`)
        .set("Authorization", adminToken); // Ensure token is included

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true); // Check if response is an array
      expect(res.body.length).toBeGreaterThan(0); // Ensure at least one freelancer is returned

      // Validate specific freelancer details
      const freelancer = res.body.find((f) => f.UserName === "lancerTest11");
      expect(freelancer).toBeDefined();
      expect(freelancer.Email).toBe("lancer@example.com");
      expect(freelancer.MobileNo).toBe(2222222222);
    });
  });

  describe("POST /admin/:aUser/utilities", () => {
    it("should delete a freelancer", async () => {
      const res = await request(app)
        .post(`/admin/${adminUser.UserName}/utilities`)
        .send({ lancerId: "lancerTest11" });

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("deleted");
    });
  });

  describe("POST /admin/:aUser", () => {
    it("should delete a client", async () => {
      const res = await request(app)
        .post(`/admin/${adminUser.UserName}`)
        .send({ clientId: "clientTest11" });

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("deleted");
    });
  });
});
