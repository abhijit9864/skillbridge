const Pricing = require("../models/pricingModel");



// Get all pricing plans (Fix: Use async/await)
exports.getPricingPlans = async (req, res) => {
  try {
    const plans = await Pricing.getAllPricingPlans();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

/// Add a new pricing plan
exports.addPricingPlan = async (req, res) => {
  const { title, price, duration, features, is_active } = req.body;
  if (!title || price === undefined || !duration || !features) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await Pricing.addPricingPlan({ title, price, duration, features, is_active: is_active ?? 1 });
    res.status(201).json({ message: "Pricing plan added", planId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

// Update a pricing plan
exports.updatePricingPlan = async (req, res) => {
  const id = req.params.id;
  const { title, price, duration, features, is_active } = req.body;
  
  if (!title || price === undefined || !duration || !features) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await Pricing.updatePricingPlan(id, { title, price, duration, features, is_active });
    res.json({ message: "Pricing plan updated" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

// Delete a pricing plan
exports.deletePricingPlan = async (req, res) => {
  const id = req.params.id;
  
  try {
    await Pricing.deletePricingPlan(id);
    res.json({ message: "Pricing plan deleted" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

