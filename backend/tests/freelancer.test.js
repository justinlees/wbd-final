const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server"); // your Express app
const collectionF = require("../model/Fmodel"); // freelancer model
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "testsecret"; // fallback for test

// Replace with actual user values from DB or use mocks
const fakeToken = jwt.sign({ data: "freelancer1" }, JWT_SECRET);
const headers = { Authorization: fakeToken };

describe("Freelancer Routes", () => {
  test("GET /freelancer/:fUser - Authenticated freelancer info", async () => {
    const res = await request(app).get("/freelancer/freelancer1").set(headers);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("UserName", "freelancer1");
  });

  test("GET /freelancer/:fUser/tasks/:userId/messages - Fetch messages", async () => {
    const res = await request(app).get(
      "/freelancer/freelancer1/tasks/client1/messages"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("lancerId", "freelancer1");
  });

  test("POST /freelancer/:fUser/tasks - Accept or Reject Task", async () => {
    const payload = {
      clientIds: "client1",
      requestVal: "reject",
      taskName: "Logo Design",
      taskDescription: "Create logo",
      currAmount: 10,
    };

    const res = await request(app)
      .post("/freelancer/freelancer1/tasks")
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("requestDone");
  });

  test("POST /freelancer/:fUser/tasks/:userId/messages - Send message", async () => {
    const res = await request(app)
      .post("/freelancer/freelancer1/tasks/client1/messages")
      .send({ msgContent: "Hello client" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("lancerId", "freelancer1");
  });

  test("POST /freelancer/:fUser/earnings - Update earnings", async () => {
    const res = await request(app)
      .post("/freelancer/freelancer1/earnings")
      .send({ amount: 20 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(true);
  });

  test("POST /freelancer/:fUser/tasks/acceptedTasks - Mark task finished", async () => {
    const res = await request(app)
      .post("/freelancer/freelancer1/tasks/acceptedTasks")
      .send({ clientId: "client1", taskName: "Logo Design" });

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("success");
  });

  test("POST /freelancer/:fUser/profile - Delete freelancer account", async () => {
    const res = await request(app).post("/freelancer/freelancer1/profile");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("success");
  });
});
