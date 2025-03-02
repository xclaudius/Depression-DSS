const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  // password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "depression_dss",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Successfully connected to the database!");
    connection.release();
  }
});

// Export the pool for use in other files
module.exports = pool.promise();