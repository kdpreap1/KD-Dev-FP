const express = require('express');
const Conversation = require('../models/conversation');

const router = express.Router();

router.get('/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.find();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/conversations', async (req, res) => {
  const { users, messages } = req.body;
  try {
    const newConversation = new Conversation({ users, messages });
    await newConversation.save();
    res.status(201).json({ message: 'Conversation created successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create conversation' });
  }
});

// Other CRUD operations as needed

module.exports = router;
