const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSummarySchema = new Schema({
    month: { type: String, required: true }, // e.g., "2025-03"
    pharmacyOrders: {
        totalItemsOrdered: { type: Number, default: 0 },
        items: [{ itemNumber: Number, itemName: String, orderQty: Number, orderDate: Date }],
    },
    gymOrders: {
        totalItemsOrdered: { type: Number, default: 0 },
        items: [{ equipmentId: Number, equipmentName: String, orderDate: Date }],
    },
});

const OrderSummary = mongoose.model("OrderSummary", orderSummarySchema);
module.exports = OrderSummary;