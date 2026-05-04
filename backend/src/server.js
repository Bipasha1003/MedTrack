const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://medtrack-bm.netlify.app'
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/scan',      require('./routes/scan'));
app.use('/api/chat',      require('./routes/chat'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'MedTrack API running ✅' });
});

// Manual email trigger — secured with a secret key
app.get('/api/send-alerts', async (req, res) => {
  if (req.query.secret !== process.env.ALERT_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { checkAndSendAlerts } = require('./lib/emailAlert');
  try {
    await checkAndSendAlerts();
    res.json({ message: 'Alerts sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start cron + server
const PORT = process.env.PORT || 5000;
const { startCronJob } = require('./lib/emailAlert');
startCronJob();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});