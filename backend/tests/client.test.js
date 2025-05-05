const request = require("supertest");
const app = require("../../app"); // Path to your Express app
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const token = jwt.sign({ UserName: "testuser" }, process.env.JWT_SECRET);

describe("User Controller", () => {

  it("should get user data by username", async () => {
    const res = await request(app)
      .get("/api/userdata/testuser")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("UserName", "testuser");
  });

  it("should upload a profile photo", async () => {
    const res = await request(app)
      .post("/api/profileupload")
      .set("Authorization", `Bearer ${token}`)
      .attach("profile", "__tests__/files/sample.jpg");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("uploaded");
  });

  it("should return messages between client and freelancer", async () => {
    const res = await request(app)
      .get("/api/showusermsg/client1/freelancer1")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should return task history for a client", async () => {
    const res = await request(app)
      .get("/api/clientTaskHistory/testclient")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should handle task request properly", async () => {
    const res = await request(app)
      .post("/api/requesttask")
      .set("Authorization", `Bearer ${token}`)
      .send({ ClientName: "clientA", TaskName: "taskX", LancerName: "freelancerB" });
    expect([200, 409]).toContain(res.statusCode);
  });

  it("should return all users", async () => {
    const res = await request(app).get("/api/allUsers");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
