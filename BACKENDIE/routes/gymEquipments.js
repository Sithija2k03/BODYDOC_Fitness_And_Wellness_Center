const router = require("express").Router();
const GymEquipment = require("../models/gymEquipment");
const Supplier = require("../models/supplier");
const OrderSummary = require("../models/orderSummary");
const EquipmentAvailabilitySummary = require("../models/equipmentAvailabilitySummary");

// Create a new gym equipment (POST)
router.route("/add").post(async (req, res) => {
    try {
        const { equipmentId, equipmentName, equipmentCategory, lastMaintenanceDate, supplierId } = req.body;
        if (!equipmentId || !equipmentName || !equipmentCategory || !lastMaintenanceDate || !supplierId) {
            return res.status(400).json({ error: "All fields, including supplierId, are required" });
        }

        const supplier = await Supplier.findOne({ supplier_id: Number(supplierId) });
        if (!supplier || !supplier.supplyCategory.includes("Gym")) {
            return res.status(400).json({ error: "Selected supplier does not provide Gym equipment" });
        }

        const newEquipment = new GymEquipment({
            equipmentId: Number(equipmentId),
            equipmentName,
            equipmentCategory,
            status: "In Place",
            lastMaintenanceDate: new Date(lastMaintenanceDate),
            supplierId: Number(supplierId),
        });

        await newEquipment.save();

        // Update order summary (assume adding equipment is an "order")
        const month = new Date().toISOString().slice(0, 7);
        await OrderSummary.findOneAndUpdate(
            { month },
            {
                $inc: { "gymOrders.totalItemsOrdered": 1 },
                $push: {
                    "gymOrders.items": { equipmentId, equipmentName, orderDate: new Date() },
                },
            },
            { upsert: true, new: true }
        );

        res.status(201).json({ message: "Equipment added successfully", equipment: newEquipment });
    } catch (err) {
        console.error("Error adding equipment:", err);
        if (err.code === 11000) return res.status(409).json({ error: "Equipment ID already exists" });
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
        const { distance } = req.body;
        if (!Number.isFinite(distance) || distance < 0) {
            return res.status(400).json({ error: "Distance must be a non-negative number" });
        }

        const threshold = process.env.DISTANCE_THRESHOLD || 10;
        const status = distance <= threshold ? "In Place" : "Not In Place";

        const updatedEquipment = await GymEquipment.findOneAndUpdate(
            { equipmentId },
            { status, lastDistance: Number(distance), lastUpdated: new Date() },
            { new: true }
        );

        if (!updatedEquipment) return res.status(404).json({ error: "Equipment not found" });

        // Update weekly availability summary
        const week = new Date().toISOString().slice(0, 10).replace(/-\d{2}$/, "-W" + Math.ceil(new Date().getDate() / 7));
        const allEquipment = await GymEquipment.find();
        await EquipmentAvailabilitySummary.findOneAndUpdate(
            { week },
            {
                totalEquipment: allEquipment.length,
                available: allEquipment.filter(e => e.status === "In Place").length,
                unavailable: allEquipment.filter(e => e.status === "Not In Place").length,
                details: allEquipment.map(e => ({
                    equipmentId: e.equipmentId,
                    equipmentName: e.equipmentName,
                    status: e.status,
                })),
            },
            { upsert: true, new: true }
        );

        if (status === "Not In Place") {
            console.log(`ALERT: ${updatedEquipment.equipmentName} (ID #${updatedEquipment.equipmentId}) is unavailable! Distance: ${distance} cm`);
        }

        res.status(200).json({ message: "Location status updated successfully", equipment: updatedEquipment });
    } catch (err) {
        console.error("Error updating location status:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;