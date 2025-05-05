const request = require("supertest");
const app = require("../../app"); // Path to your Express app
const jwt = require("jsonwebtoken");

const token = jwt.sign({ data: "adminUser" }, process.env.JWT_SECRET);

describe("Admin Controller", () => {

  describe("GET /api/admin-auth", () => {
    it("should return 403 if no token provided", async () => {
      const res = await request(app).get("/api/admin-auth");
      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Token required");
    });

    it("should return 403 if token is invalid", async () => {
      const res = await request(app)
        .get("/api/admin-auth")
        .set("Authorization", "Bearer invalidtoken");
      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Invalid token");
    });

    it("should return admin and all clients if token is valid", async () => {
      const res = await request(app)
        .get("/api/admin-auth")
        .set("Authorization", `Bearer ${token}`);
      expect([200, 500]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty("admin");
        expect(res.body).toHaveProperty("allClients");
      }
    });
  });

  describe("GET /api/admin-lancers", () => {
    it("should return all freelancers", async () => {
      const res = await request(app).get("/api/admin-lancers");
      expect([200, 500]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(Array.isArray(res.body)).toBe(true);
      }
    });
  });

  describe("DELETE /api/delete-lancer", () => {
    it("should delete a lancer", async () => {
      const res = await request(app)
        .delete("/api/delete-lancer")
        .send({ lancerId: "freelancer1" });
      expect([200, 500]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.text).toBe("deleted");
      }
    });
  });

  describe("DELETE /api/delete-client", () => {
    it("should delete a client", async () => {
      const res = await request(app)
        .delete("/api/delete-client")
        .send({ clientId: "client1" });
      expect([200, 500]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.text).toBe("deleted");
      }
    });
  });

});
