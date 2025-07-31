const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// ✅ Correct CORS: allow ONLY your real frontend domains
app.use(cors({
  origin: [
    'https://isaar.in',
    'https://www.isaar.in',
    'https://admin.isaar.in',
    'https://isar-main.onrender.com',
    'https://main.d3dfmh442d4tq3.amplifyapp.com' // ✅ your new Amplify build!
  ],
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Import routes
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ✅ Health check routes
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

app.get('/api/health', (req, res) => {
  res.status(200).send('✅ Backend is healthy!');
});

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Start server on all interfaces
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () =>
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`)
  );
}

module.exports = app;
