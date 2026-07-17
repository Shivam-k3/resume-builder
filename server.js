import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Setup middlewares
app.use(cors());
app.use(express.json());

// Proxy endpoint for Gemini API
app.post('/api/gemini/generateContent', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Security Alert: Gemini API Key is missing from the server environment!');
    return res.status(500).json({ 
      error: {
        message: 'Gemini API Key is not configured on the server. Please check the server environment.' 
      }
    });
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error forwarding request to Gemini API:', err);
    res.status(500).json({ 
      error: {
        message: 'Internal server error while communicating with the AI service in the background.' 
      }
    });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Secure Gemini Proxy Server is running on port ${PORT}`);
});
