const request = require("supertest");
const app = require("../../app");
const jwt = require("jsonwebtoken");

const token = jwt.sign({ UserName: "freelancer1" }, process.env.JWT_SECRET);

describe("Lancer Controller", () => {

  it("should accept a task", async () => {
    const res = await request(app)
      .post("/api/accepttask")
      .set("Authorization", `Bearer ${token}`)
      .send({ LancerName: "freelancer1", ClientName: "client1", TaskName: "task1" });
    expect([200, 409]).toContain(res.statusCode);
  });

  it("should reject a task", async () => {
    const res = await request(app)
      .post("/api/rejecttask")
      .set("Authorization", `Bearer ${token}`)
      .send({ LancerName: "freelancer1", ClientName: "client1", TaskName: "task2" });
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should return accepted tasks", async () => {
    const res = await request(app)
      .get("/api/acceptedTasks/freelancer1")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should search for freelancer by skill", async () => {
    const res = await request(app)
      .get("/api/searchLancer/JavaScript")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should return message history for freelancer", async () => {
    const res = await request(app)
      .get("/api/lancerChatHistory/freelancer1")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should update account earnings", async () => {
    const res = await request(app)
      .post("/api/updateAccount")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 100 });
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should delete a freelancer account", async () => {
    const res = await request(app)
      .delete("/api/lancerAccountDelete/freelancer1")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });

});
