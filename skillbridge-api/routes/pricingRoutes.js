const express = require("express");
const router = express.Router();
const { getPricingPlans, addPricingPlan, updatePricingPlan, deletePricingPlan } = require("../controllers/pricingController");

// GET all pricing plans
router.get("/", getPricingPlans);

// POST new pricing plan
router.post("/", addPricingPlan);

// PUT update pricing plan
router.put("/:id", updatePricingPlan);

// DELETE pricing plan
router.delete("/:id", deletePricingPlan);

module.exports = router;
