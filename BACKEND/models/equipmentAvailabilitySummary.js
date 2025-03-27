const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const equipmentAvailabilitySummarySchema = new Schema({
    week: { type: String, required: true }, // e.g., "2025-W13"
    totalEquipment: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    unavailable: { type: Number, default: 0 },
    details: [{ equipmentId: Number, equipmentName: String, status: String }],
});

const EquipmentAvailabilitySummary = mongoose.model("EquipmentAvailabilitySummary", equipmentAvailabilitySummarySchema);
module.exports = EquipmentAvailabilitySummary;