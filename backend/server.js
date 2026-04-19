require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chartRoutes = require('./routes/chartRoutes');
const authenticate = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check / Keep-alive endpoint
app.get('/ping', (req, res) => res.status(200).send('pong'));

// Routes (protected by API key middleware)
app.use('/api', authenticate, chartRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
