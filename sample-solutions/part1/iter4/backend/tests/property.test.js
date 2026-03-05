const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Property = require("../models/propertyModel");
const config = require("../utils/config");

const testProperty = {
  title: "Cozy Apartment",
  type: "Apartment",
  description: "A cozy apartment in downtown",
  price: 250000,
};

beforeAll(async () => {
  await mongoose.connect(config.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await Property.deleteMany({});
});

describe("POST /api/properties", () => {
  it("should create a new property successfully", async () => {
    const response = await api
      .post("/api/properties")
      .send(testProperty)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(testProperty.title);
    expect(response.body.type).toBe(testProperty.type);
    expect(response.body.description).toBe(testProperty.description);
    expect(response.body.price).toBe(testProperty.price);
  });

  it("should fail with missing required fields", async () => {
    const incompleteProperty = { title: "Incomplete" };

    await api
      .post("/api/properties")
      .send(incompleteProperty)
      .expect(400);
  });
});

describe("GET /api/properties", () => {
  it("should return all properties", async () => {
    await new Property(testProperty).save();
    await new Property({ ...testProperty, title: "Beach House", type: "House", price: 500000 }).save();

    const response = await api
      .get("/api/properties")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.length).toBe(2);
  });
});

describe("GET /api/properties/:id", () => {
  it("should return a single property", async () => {
    const property = await new Property(testProperty).save();

    const response = await api
      .get(`/api/properties/${property._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(testProperty.title);
    expect(response.body.type).toBe(testProperty.type);
  });

  it("should return 404 for a non-existent id", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    await api
      .get(`/api/properties/${nonExistentId}`)
      .expect(404);
  });
});

describe("PUT /api/properties/:id", () => {
  it("should update a property successfully", async () => {
    const property = await new Property(testProperty).save();

    const updates = { title: "Updated Apartment", price: 300000 };

    const response = await api
      .put(`/api/properties/${property._id}`)
      .send(updates)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(updates.title);
    expect(response.body.price).toBe(updates.price);
    expect(response.body.type).toBe(testProperty.type);
  });

  it("should return 404 for a non-existent id", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    await api
      .put(`/api/properties/${nonExistentId}`)
      .send({ title: "Does Not Exist" })
      .expect(404);
  });
});

describe("DELETE /api/properties/:id", () => {
  it("should delete a property successfully", async () => {
    const property = await new Property(testProperty).save();

    await api
      .delete(`/api/properties/${property._id}`)
      .expect(200);

    const found = await Property.findById(property._id);
    expect(found).toBeNull();
  });

  it("should return 404 for a non-existent id", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    await api
      .delete(`/api/properties/${nonExistentId}`)
      .expect(404);
  });
});
