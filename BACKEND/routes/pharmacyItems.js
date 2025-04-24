const router = require("express").Router();
const PharmacyItem = require("../models/pharmacyItem");
const Supplier = require("../models/supplier");
const OrderSummary = require("../models/orderSummary");

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
            unitPrice, // Accept unitPrice
        } = req.body;

        if (
            !itemNumber ||
            !itemName ||
            !itemCategory ||
            availableStockQty === undefined ||
            reorderLevel === undefined ||
            !supplierName ||
            !supplierId ||
            orderQty === undefined ||
            unitPrice === undefined
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
            unitPrice: Number(unitPrice), // Set unit price
            orderDate: new Date(),
        });

        await newItem.save(); // totalAmount will be automatically set in schema
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
            unitPrice,
        } = req.body;

        if (
            !itemName &&
            !itemCategory &&
            availableStockQty === undefined &&
            reorderLevel === undefined &&
            !supplierName &&
            supplierId === undefined &&
            orderQty === undefined &&
            unitPrice === undefined
        ) {
            return res.status(400).json({ error: "At least one field is required to update" });
        }

        const updateData = {};
        if (itemName) updateData.itemName = itemName;
        if (itemCategory) updateData.itemCategory = itemCategory;
        if (availableStockQty !== undefined) updateData.availableStockQty = Number(availableStockQty);
        if (reorderLevel !== undefined) updateData.reorderLevel = Number(reorderLevel);
        if (supplierName) updateData.supplierName = supplierName;
        if (supplierId !== undefined) updateData.supplierId = Number(supplierId);
        if (orderQty !== undefined) {
            updateData.orderQty = Number(orderQty);
            updateData.orderDate = new Date();
        }
        if (unitPrice !== undefined) updateData.unitPrice = Number(unitPrice);

        // If either orderQty or unitPrice changes, recalculate totalAmount
        if (orderQty !== undefined || unitPrice !== undefined) {
            const item = await PharmacyItem.findOne({ itemNumber });
            const finalOrderQty = orderQty !== undefined ? Number(orderQty) : item.orderQty;
            const finalUnitPrice = unitPrice !== undefined ? Number(unitPrice) : item.unitPrice;
            updateData.totalAmount = finalOrderQty * finalUnitPrice;
        }

        const updatedItem = await PharmacyItem.findOneAndUpdate(
            { itemNumber },
            updateData,
            { new: true }
        );

        if (!updatedItem) return res.status(404).json({ error: "Item not found" });

        // Update order summary if orderQty is provided
        if (orderQty !== undefined) {
            const month = new Date().toISOString().slice(0, 7);
            await OrderSummary.findOneAndUpdate(
                { month },
                {
                    $inc: { "pharmacyOrders.totalItemsOrdered": orderQty },
                    $push: {
                        "pharmacyOrders.items": {
                            itemNumber,
                            itemName: updatedItem.itemName,
                            orderQty: Number(orderQty),
                            orderDate: new Date(),
                        },
                    },
                },
                { upsert: true, new: true }
            );
        }

        const needsReorder = updatedItem.availableStockQty <= updatedItem.reorderLevel;
        if (needsReorder) {
            console.log(`ALERT: ${updatedItem.itemName} (Item #${updatedItem.itemNumber}) needs reordering! Stock: ${updatedItem.availableStockQty}, Reorder Level: ${updatedItem.reorderLevel}`);
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

// Delete a pharmacy item by itemNumber (DELETE)
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
