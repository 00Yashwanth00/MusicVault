require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');


// Import routes
const authRoutes = require('./routes/authRoutes.js');
const searchRoutes = require('./routes/searchRoutes.js');
const playRoutes = require('./routes/playRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/songs', express.static(path.join(__dirname, '../songs')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/play', playRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Music System API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`Node.js server running on http://localhost:${PORT}`);
});