const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyControllers");

// GET /api/properties
router.get("/", getAllProperties, authMiddleware);

// POST /api/properties
router.post("/", authMiddleware, createProperty);

// GET /api/properties/:propertyId
router.get("/:propertyId", authMiddleware, getPropertyById);

// PUT /api/properties/:propertyId
router.put("/:propertyId", authMiddleware, updateProperty);

// DELETE /api/properties/:propertyId
router.delete("/:propertyId", authMiddleware, deleteProperty);

module.exports = router;
