const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supplierSummarySchema = new Schema({
    month: { type: String, required: true },
    totalSuppliersAdded: { type: Number, default: 0 },
    suppliers: [{ supplierId: Number, supplierName: String, addedDate: Date }],
});

const SupplierSummary = mongoose.model("SupplierSummary", supplierSummarySchema);
module.exports = SupplierSummary;