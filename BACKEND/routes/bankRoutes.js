const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

// Sample Bank Transaction Model (you'd need to create a proper Mongoose schema)
const BankTransaction = require('../models/bankTransaction'); // Assume this model exists

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/bank-receipts/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET all bank transactions
router.get('/', verifyToken, async (req, res) => {
  try {
    const transactions = await BankTransaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// POST a new bank transaction
router.post('/', verifyToken, upload.single('receipt'), async (req, res) => {
  try {
    const { type, amount, description, category, bankAccount } = req.body;
    const receipt = req.file ? `/uploads/bank-receipts/${req.file.filename}` : null;

    const transaction = new BankTransaction({
      type,
      amount: parseFloat(amount),
      description,
      category,
      bankAccount,
      receipt,
      status: 'pending',
      date: new Date(),
    });

    await transaction.save();
    res.status(201).json({ transaction });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add transaction' });
  }
});

// PUT update transaction status
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await BankTransaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ transaction });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status' });
  }
});

// DELETE a transaction
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const transaction = await BankTransaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
});

module.exports = router;