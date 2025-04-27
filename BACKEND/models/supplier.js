const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    supplier_id: { type: Number, required: true, unique: true },
    supplier_name: { type: String, required: true },
    contact: { type: String, required: true },
    credits: { type: Number, required: true },
    supplyCategory: { type: String, required: true, enum: ["pharmacy", "gym", "both"] } // Added field
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;