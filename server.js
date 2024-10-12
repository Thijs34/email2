const express = require('express'); // Import the Express framework
const bodyParser = require('body-parser'); // Middleware to parse JSON bodies
const axios = require('axios'); // HTTP client for making requests
const path = require('path'); // Utility for working with file and directory paths
require('dotenv').config(); // Load environment variables from a .env file

const app = express(); // Create an instance of Express
const port = 3000; // Define the port the server will listen on

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // Parse JSON bodies for incoming requests

const apiKey = process.env.OPENAI_API_KEY; // Get the OpenAI API key from environment variables
// The correct endpoint for the chat model
const apiUrl = 'https://api.openai.com/v1/chat/completions';

// Serve the main HTML file on the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle POST requests to the /chat endpoint
app.post('/chat', async (req, res) => {
    const prompt = req.body.prompt; // Get the prompt from the request body

    try {
        // Make a request to the OpenAI API
        const response = await axios.post(apiUrl, {
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: prompt
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });

        // Send the API response back to the client
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        // Send an error response back to the client
        res.status(500).json({ error: 'Something went wrong', details: error.response ? error.response.data : error.message });
    }
});

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

