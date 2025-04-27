// routes/messages.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose'); // ✨ Need this to use mongoose.Types.ObjectId
const Message = require('../models/Message');

// ✨ Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// POST route for sending prescriptions
router.post('/messages/sendPrescription', async (req, res) => {
    try {
      const { senderId, receiverId, text, file } = req.body;
  
      // Validate ObjectIds for senderId and receiverId
      if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
        return res.status(400).json({ message: 'Invalid sender or receiver ID' });
      }
  
      // Create a new message
      const newMessage = new Message({
        senderId: mongoose.Types.ObjectId(senderId),
        receiverId: mongoose.Types.ObjectId(receiverId),
        text,
        fileUrl: file ? file.path : null, // Handle file if it exists
      });
  
      await newMessage.save();
      res.status(200).json({ message: 'Prescription sent successfully!' });
    } catch (error) {
      console.error('Error saving prescription message:', error);
      res.status(500).json({ message: 'Error saving prescription message' });
    }
  });

// ✅ Get all messages for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ receiverId: new mongoose.Types.ObjectId(userId) }).sort({ timestamp: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching user messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// ✅ Send simple text message
router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: 'senderId and receiverId are required' });
    }

    const newMessage = new Message({
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      text,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending text message:', error);
    res.status(500).json({ message: 'Failed to send text message' });
  }
});

module.exports = router;
