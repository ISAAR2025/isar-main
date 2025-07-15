const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db'); // ⬅️ New MongoDB connection

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Connect MongoDB
connectDB(); // ⬅️ Connect to MongoDB

// Routes
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use(cors({
  origin: 'https://www.isaar.in', // 👈 your real GoDaddy domain
  credentials: true // if you send cookies or sessions
}));


app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
