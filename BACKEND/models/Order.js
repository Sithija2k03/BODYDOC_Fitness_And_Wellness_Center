const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user_name: {
    type: String,
    required: true,
    trim: true,
  },
  doctor_name: {
    type: String,
    required: true,
    trim: true,
  },
  c_date: {
    type: Date,
    required: true,
  },
  prescription: {
    type: String, // Stores the file path
    required: true,
    trim: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

















// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const orderSchema = new Schema({
//   user_name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   doctor_name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   c_date: {
//     type: Date,
//     required: true,
//   },
//   prescription: {
//     type: String, // Stores the file path
//     required: true,
//     trim: true,
//   },
// });

// const Order = mongoose.model("Order", orderSchema);

// module.exports = Order;