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
const gamificationRoutes = require('./routes/gamificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/cognitive', cognitiveRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/garden', gardenRoutes);
app.use('/api/caregiver', caregiverRoutes);
app.use('/api/gamification', gamificationRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'MemoMate SIH 2026 API',
    mongoState: mongoose.connection.readyState === 1 ? 'connected' : 'standalone_mode',
    timestamp: new Date()
  });
});

// Serve static frontend build assets for full-stack deployment
const fs = require('fs');
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Wildcard SPA route fallback for single-page application refreshes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  res.status(404).json({ message: 'Resource or API route not found' });
});

// Database Connection with graceful standalone fallback
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('🌱 Connected to MongoDB successfully.');
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection issue (using in-memory fallback for API stability):', err.message);
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

startServer(PORT);
