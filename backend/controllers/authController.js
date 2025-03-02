const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const userId = await User.create({ name, email, password: hashedPassword });

    // Generate a JWT token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set the token as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,  // Prevent JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
      sameSite: "Lax", // Helps prevent CSRF attacks
      maxAge: 3600000, // 1 hour expiration
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Login a user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set the token as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,  // Prevents JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === "production", // Send over HTTPS in production
      sameSite: "Strict", // Helps prevent CSRF attacks
      maxAge: 3600000, // 1 hour expiration
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "Strict", secure: process.env.NODE_ENV === "production" });
  res.status(200).json({ message: "Logged out successfully" });
};

// Get current user data
const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = req.user;
    user.name = name;
    user.email = email;
    await User.updateUser(name, email, req.user.id).then((res) => console.log(res));
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export the functions
module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  logout
};