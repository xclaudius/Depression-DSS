const db = require("../config/db.js");

class User {
  // Create a new user
  static async create({ name, email, password }) {
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );
    return result.insertId;
  }

  // Find a user by email
  static async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }

  // Find a user by ID
  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  }

  static async updateUser(name, email, id) {
    const [rows] = await db.execute("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id])
    return rows
  }
}

module.exports = User;