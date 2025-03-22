const router = require("express").Router();
const PharmacyItem = require("../models/pharmacyItem");

// Create a new pharmacy item (POST)
router.route("/add").post(async (req, res) => {
    try {
        const {
            itemNumber,
            itemName,
            itemCategory,
            availableStockQty,
            reorderLevel,
            supplierName,
            supplierId,
            orderQty,
        } = req.body;

        // Validate required fields
        if (
            !itemNumber ||
            !itemName ||
            !itemCategory ||
            availableStockQty === undefined ||
            reorderLevel === undefined ||
            !supplierName ||
            !supplierId ||
            orderQty === undefined
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newItem = new PharmacyItem({
            itemNumber: Number(itemNumber),
            itemName,
            itemCategory,
            availableStockQty: Number(availableStockQty),
            reorderLevel: Number(reorderLevel),
            supplierName,
            supplierId: Number(supplierId),
            orderQty: Number(orderQty),
            orderDate: new Date(), // Explicitly set to current date/time
        });

        await newItem.save();
        res.status(201).json({ message: "Item added successfully", item: newItem });
    } catch (err) {
        console.error("Error adding item:", err);
        if (err.code === 11000) {
            return res.status(409).json({ error: "Item number already exists" });
        }
        res.status(500).json({ error: err.message });
    }
});

// Get all pharmacy items (GET)
router.route("/").get(async (req, res) => {
    try {
        const items = await PharmacyItem.find();
        const itemsWithStatus = items.map((item) => ({
            ...item._doc,
            needsReorder: item.availableStockQty <= item.reorderLevel,
        }));
        res.status(200).json(itemsWithStatus);
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).json({ error: err.message });
    }
});

// Update a pharmacy item by itemNumber (PUT)
router.route("/update/:itemNum").put(async (req, res) => {
    try {
        const itemNumber = Number(req.params.itemNum);
        const {
            itemName,
            itemCategory,
            availableStockQty,
            reorderLevel,
            supplierName,
            supplierId,
            orderQty,
        } = req.body;

        if (
            !itemName &&
            !itemCategory &&
            availableStockQty === undefined &&
            reorderLevel === undefined &&
            !supplierName &&
            supplierId === undefined &&
            orderQty === undefined
        ) {
            return res.status(400).json({ error: "At least one field is required to update" });
        }

        const updateData = { orderDate: new Date() }; // Update orderDate on every change
        if (itemName) updateData.itemName = itemName;
        if (itemCategory) updateData.itemCategory = itemCategory;
        if (availableStockQty !== undefined) updateData.availableStockQty = Number(availableStockQty);
        if (reorderLevel !== undefined) updateData.reorderLevel = Number(reorderLevel);
        if (supplierName) updateData.supplierName = supplierName;
        if (supplierId !== undefined) updateData.supplierId = Number(supplierId);
        if (orderQty !== undefined) updateData.orderQty = Number(orderQty);

        const updatedItem = await PharmacyItem.findOneAndUpdate(
            { itemNumber },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ error: "Item not found" });
        }

        const needsReorder = updatedItem.availableStockQty <= updatedItem.reorderLevel;
        if (needsReorder) {
            console.log(
                `ALERT: Stock for ${updatedItem.itemName} (Item #${updatedItem.itemNumber}) is low! ` +
                `Available: ${updatedItem.availableStockQty}, Reorder Level: ${updatedItem.reorderLevel}. ` +
                `Consider ordering ${updatedItem.orderQty} more from ${updatedItem.supplierName} (ID: ${updatedItem.supplierId}).`
            );
        }

        res.status(200).json({
            message: "Item updated successfully",
            item: updatedItem,
            needsReorder,
        });
    } catch (err) {
        console.error("Error updating item:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a pharmacy item by itemNumber (DELETE) - Unchanged
router.route("/delete/:itemNum").delete(async (req, res) => {
    try {
        const itemNumber = Number(req.params.itemNum);

        const deletedItem = await PharmacyItem.findOneAndDelete({ itemNumber });

        if (!deletedItem) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;