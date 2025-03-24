const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    order_id: {
        type: String,
        unique: true, // Ensure no duplicates
    },
    item_id: {
        type: String,
        required: true
    },
    supplier_name: {
        type: String,
        required: true
    },
    quality: {
        type: String,
        required: true,
        enum: ["Good", "Near Expiry", "Expired", "Damaged", "Low Stock"], // Allowed values
        default: "Good"
    },
    total: {
        type: Number,
        required: true
    }
});

// Pre-save middleware to auto-generate order_id
orderSchema.pre("save", async function (next) {
    const doc = this;

    if (!doc.order_id) { // Only generate if not already set
        try {
            // Find the last added order to get the highest `order_id`
            const lastItem = await mongoose.model("Order").findOne().sort({ order_id: -1 });

            let newId = "Or01"; // Default if no previous data

            if (lastItem && lastItem.order_id) {
                const lastNumber = parseInt(lastItem.order_id.substring(1)); // Extract number part
                const nextNumber = lastNumber + 1;
                newId = `Or${nextNumber.toString().padStart(2, "0")}`; // Format with leading zero (e.g., "Or01", "Or02")
            }

            doc.order_id = newId; // Set the new order_id
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const Order = mongoose.model("Order",orderSchema);

module.exports = Order;
