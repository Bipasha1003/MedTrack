const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Add to server.js temporarily for testing
const { checkAndSendAlerts } = require('./lib/emailAlert');

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app-name.netlify.app'  // add this after you get netlify URL
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (we'll add these one by one)
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/scan',      require('./routes/scan'));
app.use('/api/chat',      require('./routes/chat'));

// Health check — tells you server is running
app.get('/', (req, res) => {
  res.json({ message: 'Medicine Tracker API running' });
});

app.get('/api/test-email', async (req, res) => {
  await checkAndSendAlerts();
  res.json({ message: 'Email check triggered' });
});

// Start server
const PORT = process.env.PORT || 5000;
const { startCronJob } = require('./lib/emailAlert');
startCronJob();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});