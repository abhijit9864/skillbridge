const db = require("../config/db");

// Get all pricing plans (Fix: Use async/await)
exports.getAllPricingPlans = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM pricing");
    return rows;
  } catch (error) {
    throw error;
  }
};

// Add a new pricing plan
exports.addPricingPlan = async (plan) => {
  const { title, price, duration, features, is_active } = plan;
  try {
    const [result] = await db.query(
      "INSERT INTO pricing (title, price, duration, features, is_active) VALUES (?, ?, ?, ?, ?)",
      [title, price, duration, JSON.stringify(features), is_active]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

// Update a pricing plan
exports.updatePricingPlan = async (id, plan) => {
  const { title, price, duration, features, is_active } = plan;
  try {
    const [result] = await db.query(
      "UPDATE pricing SET title=?, price=?, duration=?, features=?, is_active=? WHERE id=?",
      [title, price, duration, JSON.stringify(features), is_active, id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

// Delete a pricing plan
exports.deletePricingPlan = async (id) => {
  try {
    const [result] = await db.query("DELETE FROM pricing WHERE id=?", [id]);
    return result;
  } catch (error) {
    throw error;
  }
};
