const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/userControllers");

// POST /api/users
router.post("/", signup);

// POST /api/users/login
router.post("/login", login);

module.exports = router;
