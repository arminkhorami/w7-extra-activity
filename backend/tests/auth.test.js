const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/vehicle-rental-api-test");
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User signup and login", () => {

  test("user can signup", async () => {
    const newUser = {
      email: "test@test.com",
      password: "123456",
      phoneNumber: "123456789"
    };

    const response = await request(app)
      .post("/api/users/signup")
      .send(newUser)
      .expect(201);

    expect(response.body.message).toBe("User created successfully");
  }, 15000);

  test("user can login", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({
        email: "test@test.com",
        password: "123456"
      })
      .expect(200);

    expect(response.body.token).toBeDefined();
  }, 15000);

});