const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/memomate';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const cognitiveRoutes = require('./routes/cognitiveRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const gardenRoutes = require('./routes/gardenRoutes');
const caregiverRoutes = require('./routes/caregiverRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/cognitive', cognitiveRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/garden', gardenRoutes);
app.use('/api/caregiver', caregiverRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'MemoMate SIH 2026 API',
    mongoState: mongoose.connection.readyState === 1 ? 'connected' : 'standalone_mode',
    timestamp: new Date()
  });
});

// Database Connection with graceful standalone fallback
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('🌱 Connected to MongoDB successfully.');
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection issue (using in-memory fallback for API stability):', err.message);
  });

app.listen(PORT, () => {
  console.log(`🚀 MemoMate Server running on http://localhost:${PORT}`);
});
