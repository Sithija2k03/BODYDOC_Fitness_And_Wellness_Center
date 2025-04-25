const router = require("express").Router();
const Supplier = require("../models/supplier");
const SupplierSummary = require("../models/supplierSummary");

// Create a new supplier (POST)
router.route("/add").post(async (req, res) => {
    try {
        const { supplier_id, supplier_name, contact, credits, supplyCategory } = req.body;
        if (!supplier_id || !supplier_name || !contact || credits === undefined || !supplyCategory) {
            return res.status(400).json({ error: "All fields, including supplyCategory, are required" });
        }

        const newSupplier = new Supplier({
            supplier_id: Number(supplier_id),
            supplier_name,
            contact,
            credits: Number(credits),
            supplyCategory,
        });

        await newSupplier.save();

        // Update monthly supplier summary
        const month = new Date().toISOString().slice(0, 7); // e.g., "2025-03"
        await SupplierSummary.findOneAndUpdate(
            { month },
            {
                $inc: { totalSuppliersAdded: 1 },
                $push: { suppliers: { supplierId: supplier_id, supplierName: supplier_name, addedDate: new Date() } },
            },
            { upsert: true, new: true }
        );

        res.status(201).json({ message: "Supplier added successfully", supplier: newSupplier });
    } catch (err) {
        console.error("Error adding supplier:", err);
        if (err.code === 11000) return res.status(409).json({ error: "Supplier ID already exists" });
        res.status(500).json({ error: err.message });
    }
});

// Get all suppliers (GET)
router.route("/get").get(async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (err) {
        console.error("Error fetching suppliers:", err);
        res.status(500).json({ error: err.message });
    }
});

// Update a supplier by supplier_id (PUT)
router.route("/update/:supid").put(async (req, res) => {
    try {
        const supplierId = Number(req.params.supid);
        const { supplier_name, contact, credits, supplyCategory } = req.body;

        // Validate that at least one field is provided
        if (!supplier_name && !contact && credits === undefined && !supplyCategory) {
            return res.status(400).json({ error: "At least one field is required to update" });
        }

        const updateData = {};
        if (supplier_name) updateData.supplier_name = supplier_name;
        if (contact) updateData.contact = contact;
        if (credits !== undefined) updateData.credits = Number(credits);
        if (supplyCategory) updateData.supplyCategory = supplyCategory; // Handle supplyCategory

        const updatedSupplier = await Supplier.findOneAndUpdate(
            { supplier_id: supplierId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedSupplier) {
            return res.status(404).json({ error: "Supplier not found" });
        }

        res.status(200).json({ message: "Supplier updated successfully", supplier: updatedSupplier });
    } catch (err) {
        console.error("Error updating supplier:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a supplier by supplier_id (DELETE)
router.route("/delete/:supid").delete(async (req, res) => {
    try {
        const supplierId = Number(req.params.supid);

        const deletedSupplier = await Supplier.findOneAndDelete({ supplier_id: supplierId });

        if (!deletedSupplier) {
            return res.status(404).json({ error: "Supplier not found" });
        }

        res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (err) {
        console.error("Error deleting supplier:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;