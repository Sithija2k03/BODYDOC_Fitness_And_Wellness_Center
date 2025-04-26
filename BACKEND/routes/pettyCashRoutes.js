const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/petty-cash-receipts/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Petty Cash Transaction Schema
const pettyCashSchema = new mongoose.Schema({
  type: { type: String, enum: ['inflow', 'outflow'], required: true }, // Inflow (fund allocation) or Outflow (expense)
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'General' }, // E.g., Office Supplies, Travel
  date: { type: Date, default: Date.now },
  receipt: { type: String }, // Path to uploaded receipt
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdBy: { type: String, required: true }, // Admin ID or username
});

const PettyCash = mongoose.model('PettyCash', pettyCashSchema);

// Middleware to verify JWT and admin role
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.admin = decoded; // Contains admin info (e.g., id, role)
    next();
  });
};

// Get all petty cash transactions
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const transactions = await PettyCash.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

// Add a new transaction
router.post('/', verifyAdmin, upload.single('receipt'), async (req, res) => {
  try {
    const { type, amount, description, category } = req.body;
    const receipt = req.file ? `/uploads/petty-cash-receipts/${req.file.filename}` : null;

    const transaction = new PettyCash({
      type,
      amount,
      description,
      category,
      receipt,
      createdBy: req.admin.id, // Assuming admin ID is in the token
    });

    await transaction.save();
    res.status(201).json({ message: 'Transaction added successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error });
  }
});

// Update transaction status (approve/reject)
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    // Only senior admins can approve/reject
    if (req.admin.role !== 'senior') {
      return res.status(403).json({ message: 'Only senior admins can approve/reject transactions' });
    }

    const transaction = await PettyCash.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: `Transaction ${status} successfully`, transaction });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error });
  }
});

// Delete a transaction
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const transaction = await PettyCash.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
});

module.exports = router;