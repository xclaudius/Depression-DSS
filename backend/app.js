const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser()); 
app.use(cors({
  origin: "http://localhost:3000", // Update for production
  credentials: true, // Allows cookies to be sent
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/assess", authMiddleware, assessmentRoutes);

module.exports = app;