const router = require("express").Router();
const GymEquipment = require("../models/gymEquipment");

// Create a new gym equipment (POST)
router.route("/add").post(async (req, res) => {
    try {
        const {
            equipmentId,
            equipmentName,
            equipmentCategory,
            lastMaintenanceDate,
        } = req.body;

        // Validate required fields
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
            status: "In Place", // Default status
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

// Update gym equipment by equipmentId (PUT)
router.route("/update/:equipId").put(async (req, res) => {
    try {
        const equipmentId = Number(req.params.equipId);
        const {
            equipmentName,
            equipmentCategory,
            lastMaintenanceDate,
        } = req.body;

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
            { new: true, runValidators: true }
        );

        if (!updatedEquipment) {
            return res.status(404).json({ error: "Equipment not found" });
        }

        res.status(200).json({
            message: "Equipment updated successfully",
            equipment: updatedEquipment,
        });
    } catch (err) {
        console.error("Error updating equipment:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete gym equipment by equipmentId (DELETE)
router.route("/delete/:equipId").delete(async (req, res) => {
    try {
        const equipmentId = Number(req.params.equipId);

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

// Update equipment location status based on IoT sensor data (POST)
router.route("/update-location/:equipId").post(async (req, res) => {
    try {
        const equipmentId = Number(req.params.equipId);
        const { distance } = req.body; // Distance in cm from Wokwi sensor

        if (distance === undefined || distance < 0) {
            return res.status(400).json({ error: "Valid distance value is required" });
        }

        const threshold = 10; // Threshold in cm; adjust as needed
        const status = distance <= threshold ? "In Place" : "Not In Place";

        const updatedEquipment = await GymEquipment.findOneAndUpdate(
            { equipmentId },
            { status, lastDistance: Number(distance) },
            { new: true }
        );

        if (!updatedEquipment) {
            return res.status(404).json({ error: "Equipment not found" });
        }

        if (status === "Not In Place") {
            console.log(
                `ALERT: ${updatedEquipment.equipmentName} (ID #${updatedEquipment.equipmentId}) ` +
                `is not in its place! Distance: ${distance} cm (Threshold: ${threshold} cm)`
            );
        }

        res.status(200).json({
            message: "Location status updated successfully",
            equipment: updatedEquipment,
        });
    } catch (err) {
        console.error("Error updating location status:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;