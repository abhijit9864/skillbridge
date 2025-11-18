const db = require("../config/db"); // Ensure DB connection

class User {
  // Get all users with role details
  static async getAllUsers() {
    try {
      const [rows] = await db.query(`
                SELECT u.user_id, u.name, u.email, u.role_id, 
                       r.role_name, u.is_active 
                FROM user u 
                LEFT JOIN role r ON u.role_id = r.role_id
            `);
      return rows;
    } catch (err) {
      console.error("Error fetching users: ", err);
      throw new Error("Database error");
    }
  }

  // Get a user by ID (including role details)
  static async getUserById(userId) {
    try {
      const [rows] = await db.query(
        `SELECT u.user_id, u.name, u.email, u.role_id, 
                    r.role_name, u.is_active 
             FROM user u 
             LEFT JOIN role r ON u.role_id = r.role_id
             WHERE u.user_id = ?`,
        [userId]
      );

      return rows.length > 0 ? rows[0] : null; // Return null if no user is found
    } catch (err) {
      console.error("Error fetching user by ID: ", err);
      throw new Error("Database error");
    }
  }

  // Create a new user
  static async createUser(name, email, passwordHash, roleId, organizationId) {
    try {
      const [result] = await db.query(
        `
                INSERT INTO user (name, email, password_hash, role_id, organization_id) 
                VALUES (?, ?, ?, ?, ?)
            `,
        [name, email, passwordHash, roleId, organizationId]
      );

      return result.insertId;
    } catch (err) {
      console.error("Error creating user: ", err);
      throw new Error("Database error");
    }
  }

  // Get a user by email
  static async getUserByEmail(email) {
    try {
      const [rows] = await db.query(
        `
                SELECT u.user_id, u.name, u.email, u.role_id, 
                       u.password_hash,  -- Add this field
                       r.role_name, u.is_active 
                FROM user u 
                LEFT JOIN role r ON u.role_id = r.role_id
                WHERE u.email = ?
            `,
        [email]
      );

      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      console.error("Error fetching user by email: ", err);
      throw new Error("Database error");
    }
  }

  // Update an existing user
  static async updateUser(userId, name, email, roleId) {
    try {
      const [result] = await db.query(
        `
                UPDATE user 
                SET name = ?, email = ?, role_id = ? 
                WHERE user_id = ?
            `,
        [name, email, roleId, userId]
      );

      return result.affectedRows > 0; // Return true if update was successful
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Database error");
    }
  }

  // Soft delete a user (set is_active = false)
  static async deleteUser(userId) {
    try {
      const [result] = await db.query(
        `
                UPDATE user 
                SET is_active = false 
                WHERE user_id = ?
            `,
        [userId]
      );

      return result.affectedRows > 0; // Return true if update was successful
    } catch (err) {
      console.error("Error deleting user: ", err);
      throw new Error("Database error");
    }
  }
  static async getUsersWithRoles() {
    try {
        const [result] = await db.query(
            `SELECT u.user_id, u.email, r.role_name 
             FROM user u
             JOIN role r ON u.role_id = r.role_id`
        );
        return result;
    } catch (error) {
        console.error("Error fetching users with roles:", error);
        throw new Error("Database error");
    }
}

}

module.exports = User;
