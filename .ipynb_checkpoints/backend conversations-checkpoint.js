const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  users: [String],
  messages: [messageSchema],
});

module.exports = mongoose.model('Conversation', conversationSchema);
