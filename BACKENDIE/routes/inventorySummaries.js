const router = require("express").Router();
const SupplierSummary = require("../models/supplierSummary");
const OrderSummary = require("../models/orderSummary");
const EquipmentAvailabilitySummary = require("../models/equipmentAvailabilitySummary");

// Get supplier monthly summaries
router.route("/suppliers").get(async (req, res) => {
    try {
        const summaries = await SupplierSummary.find().sort({ month: -1 });
        res.status(200).json(summaries);
    } catch (err) {
        console.error("Error fetching supplier summaries:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get order monthly summaries
router.route("/orders").get(async (req, res) => {
    try {
        const summaries = await OrderSummary.find().sort({ month: -1 });
        res.status(200).json(summaries);
    } catch (err) {
        console.error("Error fetching order summaries:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get equipment availability weekly summaries
router.route("/availability").get(async (req, res) => {
    try {
        const summaries = await EquipmentAvailabilitySummary.find().sort({ week: -1 });
        res.status(200).json(summaries);
    } catch (err) {
        console.error("Error fetching availability summaries:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;