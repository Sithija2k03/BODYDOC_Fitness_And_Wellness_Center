const mongoose = require('mongoose');

const bankTransactionSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['deposit', 'withdrawal'] },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'General' },
  bankAccount: { type: String, required: true },
  receipt: { type: String, default: null },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BankTransaction', bankTransactionSchema);