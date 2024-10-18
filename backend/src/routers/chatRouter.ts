const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('./chatController');

// Get messages for a specific job seeker
router.get('/chat/:id', getMessages);

// Send a new message
router.post('/chat/:id', sendMessage);

module.exports = router;

