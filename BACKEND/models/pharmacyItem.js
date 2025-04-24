const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pharmacyItemSchema = new Schema({
    itemNumber: { type: Number, required: true, unique: true },
    itemName: { type: String, required: true },
    itemCategory: { type: String, required: true },
    availableStockQty: { type: Number, required: true, min: 0 },
    reorderLevel: { type: Number, required: true, min: 0 },
    supplierName: { type: String, required: true },
    supplierId: { type: Number, required: true },
    orderQty: { type: Number, required: true, min: 0 },
    orderDate: { type: Date, default: Date.now },
    unitPrice: { type: Number, required: true },
    totalAmount: { type: Number } // Will be calculated automatically
});

// Middleware to calculate totalAmount before saving
pharmacyItemSchema.pre("save", function(next) {
    this.totalAmount = this.orderQty * this.unitPrice;
    next();
});

const PharmacyItem = mongoose.model("PharmacyItem", pharmacyItemSchema);

module.exports = PharmacyItem;
