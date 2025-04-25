const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gymEquipmentSchema = new Schema({
    equipmentId: { type: Number, required: true, unique: true },
    equipmentName: { type: String, required: true },
    equipmentCategory: { type: String, required: true },
    lastMaintenanceDate: { type: Date, required: true }
});

const GymEquipment = mongoose.model("GymEquipment", gymEquipmentSchema);

module.exports = GymEquipment;
