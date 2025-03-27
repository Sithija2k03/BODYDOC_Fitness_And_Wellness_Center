const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gymEquipmentSchema = new Schema({
    equipmentId: { type: Number, required: true, unique: true }, // Unique identifier
    equipmentName: { type: String, required: true }, // Name of the equipment
    equipmentCategory: { type: String, required: true }, // Category (e.g., "Cardio", "Strength")
    status: { type: String, enum: ["In Place", "Not In Place"], default: "In Place" }, // Status based on sensor
    lastMaintenanceDate: { type: Date, required: true }, // Last maintenance date
    lastDistance: { type: Number, default: null } // Last distance reading from sensor (cm)
});

const GymEquipment = mongoose.model("GymEquipment", gymEquipmentSchema);

module.exports = GymEquipment;