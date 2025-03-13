const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const phamacySchema = new Schema({
    item_id: {
        type: String,
        unique: true, // Ensure no duplicates
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock_quality: {
        type: String,
        required: true,
        enum: ["Good", "Near Expiry", "Expired", "Damaged", "Low Stock"], // Allowed values
        default: "Good"
    },
    reorder_level: {
        type: Number,
        required: true
    },
    supplier: {
        type: String,
        required: true
    },
    expiry_date: {
        type: Date,
        required: true
    }
});

// Pre-save middleware to auto-generate item_id
phamacySchema.pre("save", async function (next) {
    const doc = this;

    if (!doc.item_id) { // Only generate if not already set
        try {
            // Find the last added item to get the highest `item_id`
            const lastItem = await mongoose.model("PhamacyInventory").findOne().sort({ item_id: -1 });

            let newId = "I01"; // Default if no previous data

            if (lastItem && lastItem.item_id) {
                const lastNumber = parseInt(lastItem.item_id.substring(1)); // Extract number part
                const nextNumber = lastNumber + 1;
                newId = `I${nextNumber.toString().padStart(2, "0")}`; // Format with leading zero (e.g., "I01", "I02")
            }

            doc.item_id = newId; // Set the new item_id
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const PhamacyInventory = mongoose.model("PhamacyInventory", phamacySchema);

module.exports = PhamacyInventory;
