const Property = require("../models/propertyModel");

// GET /api/properties
const getAllProperties = async (req, res) => {
  const properties = await Property.find();
  res.json(properties);
};

// POST /api/properties
const createProperty = async (req, res) => {
  const property = new Property(req.body); // user send info
  await property.save(); //save in MongoDB
  res.status(201).json(property); // send back
};

// GET /api/properties/:propertyId
const getPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.propertyId);
  res.json(property);
};

// PUT /api/properties/:propertyId
const updateProperty = async (req, res) => {
  const property = await Property.findByIdAndUpdate(
    req.params.propertyId,
    req.body,
    { new: true }
  );
  res.json(property);
};

// DELETE /api/properties/:propertyId
const deleteProperty = async (req, res) => {
  await Property.findByIdAndDelete(req.params.propertyId);
  res.json({ message: "Property deleted" });
};

module.exports = {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
