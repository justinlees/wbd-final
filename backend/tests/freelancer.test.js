const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server"); // your Express app
const collectionF = require("../model/Fmodel"); // freelancer model
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "test-secret"; // fallback for test

// Replace with actual user values from DB or use mocks
const fakeToken = jwt.sign({ data: "freelancer11" }, JWT_SECRET, {
  expiresIn: "1hr",
});

describe("Freelancer Routes", () => {
  //   test("GET /freelancer/:fUser - Authenticated freelancer info", async () => {
  //     const res = await request(app)
  //       .get("/freelancer/freelancer11")
  //       .set("authorization", `Bearer ${fakeToken}`);

  //     expect(res.statusCode).toBe(200);
  //     expect(res.body).toHaveProperty("UserName", "freelancer11");
  //   });

  test("GET /freelancer/:fUser/tasks/:userId/messages - Fetch messages", async () => {
    const res = await request(app).get(
      "/freelancer/freelancer11/tasks/client11/messages"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("lancerId", "freelancer11");
  });

  test("POST /freelancer/:fUser/tasks/:userId/messages - Send message", async () => {
    const res = await request(app)
      .post("/freelancer/freelancer11/tasks/client11/messages")
      .send({ msgContent: "Hello client" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("lancerId", "freelancer11");
  });

  test("POST /freelancer/:fUser/earnings - Update earnings", async () => {
    const res = await request(app)
      .post("/freelancer/freelancer11/earnings")
      .send({ amount: 20 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(true);
  });

  test("POST /freelancer/:fUser/profile - Delete freelancer account", async () => {
    const res = await request(app).post("/freelancer/freelancer11/profile");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("success");
  });
});
