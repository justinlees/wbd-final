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
      process.env.JWT_SECRET || "test-secret"
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
    it("should return admin and clients with valid token", async () => {
      const res = await request(app)
        .get(`/admin/${adminUser.UserName}`)
        .set("Authorization", adminToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.admin.UserName).toBe("adminTest11");
      expect(Array.isArray(res.body.allClients)).toBe(true);
    });

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
    it("should return list of freelancers", async () => {
      const res = await request(app).get(
        `/admin/${adminUser.UserName}/utilities`
      );
      expect(res.statusCode).toBe(200);
      expect(res.body[0].UserName).toBe("lancerTest11");
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

    it("should return 500 if freelancer not found", async () => {
      const res = await request(app)
        .post(`/admin/${adminUser.UserName}/utilities`)
        .send({ lancerId: "nonexistent" });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Freelancer not found");
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

    it("should return 500 if client not found", async () => {
      const res = await request(app)
        .post(`/admin/${adminUser.UserName}`)
        .send({ clientId: "ghostClient" });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Client not found");
    });
  });
});
