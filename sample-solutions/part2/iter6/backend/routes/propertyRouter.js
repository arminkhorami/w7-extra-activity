const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyControllers");

// GET /api/properties (public)
router.get("/", getAllProperties);

// POST /api/properties (protected)
router.post("/", auth, createProperty);

// GET /api/properties/:propertyId (public)
router.get("/:propertyId", getPropertyById);

// PUT /api/properties/:propertyId (protected)
router.put("/:propertyId", auth, updateProperty);

// DELETE /api/properties/:propertyId (protected)
router.delete("/:propertyId", auth, deleteProperty);

module.exports = router;
