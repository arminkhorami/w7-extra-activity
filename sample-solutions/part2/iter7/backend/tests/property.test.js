const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Property = require("../models/propertyModel");
const User = require("../models/userModel");
const config = require("../utils/config");

const testUser = {
  email: "test@example.com",
  password: "testPassword123",
  phoneNumber: "1234567890",
};

const testProperty = {
  title: "Cozy Apartment",
  type: "Apartment",
  description: "A cozy apartment in downtown",
  price: 250000,
};

const getToken = async () => {
  const response = await api.post("/api/users").send(testUser);
  return response.body.token;
};

beforeAll(async () => {
  await mongoose.connect(config.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await Property.deleteMany({});
  await User.deleteMany({});
});

describe("User Authentication", () => {
  test("POST /api/users — should signup a new user", async () => {
    const response = await api
      .post("/api/users")
      .send(testUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.email).toBe(testUser.email);
    expect(response.body.phoneNumber).toBe(testUser.phoneNumber);
    expect(response.body.token).toBeDefined();
  });

  test("POST /api/users — should not signup with missing fields", async () => {
    const response = await api
      .post("/api/users")
      .send({ email: "incomplete@example.com" })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  test("POST /api/users — should not signup with existing email", async () => {
    await api.post("/api/users").send(testUser);

    const response = await api
      .post("/api/users")
      .send(testUser)
      .expect(/4[0-9]{2}/);

    expect(response.body.error).toBeDefined();
  });

  test("POST /api/users/login — should login an existing user", async () => {
    await api.post("/api/users").send(testUser);

    const response = await api
      .post("/api/users/login")
      .send({ email: testUser.email, password: testUser.password })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.email).toBe(testUser.email);
    expect(response.body.token).toBeDefined();
  });

  test("POST /api/users/login — should not login with wrong password", async () => {
    await api.post("/api/users").send(testUser);

    const response = await api
      .post("/api/users/login")
      .send({ email: testUser.email, password: "wrongPassword" })
      .expect(401);

    expect(response.body.error).toBeDefined();
  });

  test("POST /api/users/login — should not login with non-existent email", async () => {
    const response = await api
      .post("/api/users/login")
      .send({ email: "nonexistent@example.com", password: "somePassword" })
      .expect(401);

    expect(response.body.error).toBeDefined();
  });
});

describe("Properties CRUD (Public Routes)", () => {
  test("GET /api/properties — should return all properties", async () => {
    await Property.create(testProperty);
    await Property.create({
      title: "Beach House",
      type: "House",
      description: "A lovely beach house",
      price: 500000,
    });

    const response = await api
      .get("/api/properties")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(2);
  });

  test("GET /api/properties/:id — should return a single property", async () => {
    const property = await Property.create(testProperty);

    const response = await api
      .get(`/api/properties/${property._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(testProperty.title);
    expect(response.body.type).toBe(testProperty.type);
    expect(response.body.description).toBe(testProperty.description);
    expect(response.body.price).toBe(testProperty.price);
  });

  test("GET /api/properties/:id — should return 404 for non-existent property", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    await api.get(`/api/properties/${nonExistentId}`).expect(404);
  });
});

describe("Properties CRUD (Protected Routes)", () => {
  test("POST /api/properties — should create a property when authenticated", async () => {
    const token = await getToken();

    const response = await api
      .post("/api/properties")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send(testProperty)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(testProperty.title);
    expect(response.body.type).toBe(testProperty.type);
    expect(response.body.description).toBe(testProperty.description);
    expect(response.body.price).toBe(testProperty.price);
  });

  test("POST /api/properties — should return 401 without a token", async () => {
    await api
      .post("/api/properties")
      .set("Content-Type", "application/json")
      .send(testProperty)
      .expect(401);
  });

  test("POST /api/properties — should return 401 with invalid token", async () => {
    await api
      .post("/api/properties")
      .set("Authorization", "Bearer invalidtoken123")
      .set("Content-Type", "application/json")
      .send(testProperty)
      .expect(401);
  });

  test("PUT /api/properties/:id — should update a property when authenticated", async () => {
    const token = await getToken();

    const createResponse = await api
      .post("/api/properties")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send(testProperty);

    const propertyId = createResponse.body._id;
    const updatedData = { title: "Updated Apartment", price: 300000 };

    const response = await api
      .put(`/api/properties/${propertyId}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send(updatedData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(updatedData.title);
    expect(response.body.price).toBe(updatedData.price);
  });

  test("PUT /api/properties/:id — should return 401 without a token", async () => {
    const token = await getToken();

    const createResponse = await api
      .post("/api/properties")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send(testProperty);

    const propertyId = createResponse.body._id;

    await api
      .put(`/api/properties/${propertyId}`)
      .set("Content-Type", "application/json")
      .send({ title: "Should Not Update" })
      .expect(401);
  });

  test("DELETE /api/properties/:id — should delete a property when authenticated", async () => {
    const token = await getToken();

    const createResponse = await api
      .post("/api/properties")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send(testProperty);

    const propertyId = createResponse.body._id;

    await api
      .delete(`/api/properties/${propertyId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const propertiesInDb = await Property.find({});
    expect(propertiesInDb).toHaveLength(0);
  });

  test("DELETE /api/properties/:id — should return 401 without a token", async () => {
    const token = await getToken();

    const createResponse = await api
      .post("/api/properties")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send(testProperty);

    const propertyId = createResponse.body._id;

    await api.delete(`/api/properties/${propertyId}`).expect(401);

    const propertiesInDb = await Property.find({});
    expect(propertiesInDb).toHaveLength(1);
  });
});
