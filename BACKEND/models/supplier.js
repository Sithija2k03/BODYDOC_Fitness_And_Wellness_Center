// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// // Define the Supplier Schema
// const supplierSchema = new mongoose.Schema({
//     supplier_id: { type: Number, required: true, unique: true },
//     supplier_name: { type: String, required: true },
//     contact: { type: String, required: true },
//     credits: { type: Number, required: true },
//   });

//   // Create the Supplier Model
// const Supplier = mongoose.model('Supplier', supplierSchema);

// module.exports = Supplier;





// // supplier_id: { type: Number, required: true, unique: true },
// // supplier_name: { type: String, required: true },
// // contact: { type: String, required: true },
// // credits: { type: Number, required: true },




const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    supplier_id: { type: Number, required: true, unique: true },
    supplier_name: { type: String, required: true },
    contact: { type: String, required: true },
    credits: { type: Number, required: true },
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;