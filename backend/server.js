const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/memomate';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://memo-blind.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*') || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());

// Database Connection Handler
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connection: SUCCESS');
  } catch (err) {
    console.error('MongoDB connection: FAILED -', err.message);
  }
};

app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    await connectDB();
  }
  next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const cognitiveRoutes = require('./routes/cognitiveRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const gardenRoutes = require('./routes/gardenRoutes');
const caregiverRoutes = require('./routes/caregiverRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/cognitive', cognitiveRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/garden', gardenRoutes);
app.use('/api/caregiver', caregiverRoutes);
app.use('/api/gamification', gamificationRoutes);

app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? 'ok' : 'error',
    database: isConnected ? 'connected' : 'disconnected',
    app: 'MemoMate SIH 2026 API',
    timestamp: new Date()
  });
});

const startServer = (portToUse) => {
  const server = app.listen(portToUse, () => {
    console.log(`🚀 MemoMate Server running on http://localhost:${portToUse}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${portToUse} is already in use. Retrying on port ${Number(portToUse) + 1}...`);
      startServer(Number(portToUse) + 1);
    } else {
      console.error('Server execution error:', err);
    }
  });
};

connectDB().then(() => {
  if (require.main === module) {
    startServer(PORT);
  }
});

module.exports = app;
