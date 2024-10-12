const axios = require('axios');
require('dotenv').config();  // Ensure this line works in Vercel or set env variables in Vercel's dashboard.

module.exports = async (req, res) => {
    if (req.method === 'POST') {  // Only handle POST requests
        const { prompt } = req.body;
        const apiKey = process.env.OPENAI_API_KEY;  // Make sure to set this in Vercel dashboard
        const apiUrl = 'https://api.openai.com/v1/chat/completions';

        try {
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

            res.status(200).json({ reply: response.data.choices[0].message.content });
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            res.status(500).json({
                error: 'Something went wrong',
                details: error.response ? error.response.data : error.message
            });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
