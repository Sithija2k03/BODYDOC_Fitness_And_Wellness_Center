const router = require("express").Router();
const GymEquipment = require("../models/gymEquipment");
const OrderSummary = require("../models/orderSummary");

// Create a new gym equipment (POST)
router.route("/add").post(async (req, res) => {
    try {
        const {
            equipmentId,
            equipmentName,
            equipmentCategory,
            lastMaintenanceDate,
        } = req.body;

        if (
            !equipmentId ||
            !equipmentName ||
            !equipmentCategory ||
            !lastMaintenanceDate
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newEquipment = new GymEquipment({
            equipmentId: Number(equipmentId),
            equipmentName,
            equipmentCategory,
            lastMaintenanceDate: new Date(lastMaintenanceDate),
        });

        await newEquipment.save();
        res.status(201).json({ message: "Equipment added successfully", equipment: newEquipment });
    } catch (err) {
        console.error("Error adding equipment:", err);
        if (err.code === 11000) {
            return res.status(409).json({ error: "Equipment ID already exists" });
        }
        res.status(500).json({ error: err.message });
    }
});

// Get all gym equipment (GET)
router.route("/").get(async (req, res) => {
    try {
        const equipment = await GymEquipment.find();
        res.status(200).json(equipment);
    } catch (err) {
        console.error("Error fetching equipment:", err);
        res.status(500).json({ error: err.message });
    }
});

// Update a gym equipment by equipmentId (PUT)
router.route("/update/:equipmentId").put(async (req, res) => {
    try {
        const equipmentId = Number(req.params.equipmentId);
        const { equipmentName, equipmentCategory, lastMaintenanceDate } = req.body;

        if (
            !equipmentName &&
            !equipmentCategory &&
            !lastMaintenanceDate
        ) {
            return res.status(400).json({ error: "At least one field is required to update" });
        }

        const updateData = {};
        if (equipmentName) updateData.equipmentName = equipmentName;
        if (equipmentCategory) updateData.equipmentCategory = equipmentCategory;
        if (lastMaintenanceDate) updateData.lastMaintenanceDate = new Date(lastMaintenanceDate);

        const updatedEquipment = await GymEquipment.findOneAndUpdate(
            { equipmentId },
            updateData,
            { new: true }
        );

        if (!updatedEquipment) return res.status(404).json({ error: "Equipment not found" });

        res.status(200).json({
            message: "Equipment updated successfully",
            equipment: updatedEquipment,
        });
    } catch (err) {
        console.error("Error updating equipment:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a gym equipment by equipmentId (DELETE)
router.route("/delete/:equipmentId").delete(async (req, res) => {
    try {
        const equipmentId = Number(req.params.equipmentId);
        const deletedEquipment = await GymEquipment.findOneAndDelete({ equipmentId });

        if (!deletedEquipment) {
            return res.status(404).json({ error: "Equipment not found" });
        }

        res.status(200).json({ message: "Equipment deleted successfully" });
    } catch (err) {
        console.error("Error deleting equipment:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
