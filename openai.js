const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL_NAME = 'gpt-3.5-turbo';

router.post('/completion', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
});

module.exports = router;
