const express = require("express");
const { register, login, getMe, updateProfile, logout } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login a user
router.post("/login", login);

// Logout a user
router.post("/logout", logout);

// Get current user data
router.get("/me", authMiddleware, getMe);

// Update user profile
router.put("/update", authMiddleware, updateProfile);

module.exports = router;