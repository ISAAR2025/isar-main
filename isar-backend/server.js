const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db'); // MongoDB connection

dotenv.config();

const app = express();

// ✅ Correct CORS: allow only your frontend domains
app.use(cors({
  origin: [
    'https://isaar.in',
    'https://www.isaar.in',
    'https://admin.isaar.in',
    'https://isar-main.onrender.com'
  ],
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ✅ Health/Ping check
app.get('/ping', (req, res) => {
  res.send('pong');
});

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Start server on 0.0.0.0 so external clients can reach it
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () =>
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`)
  );
}

module.exports = app;
