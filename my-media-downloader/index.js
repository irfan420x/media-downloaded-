const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import routes
const downloadRoutes = require('./routes/download');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create downloads folder if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
  console.log('📁 Downloads folder created');
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Media Downloader API is running!',
    version: '1.0.0',
    endpoints: {
      'GET /': 'API status',
      'POST /api/download': 'Download media file'
    }
  });
});

// API routes
app.use('/api', downloadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Media Downloader API running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}`);
  console.log(`📥 Download endpoint: http://localhost:${PORT}/api/download`);
});

module.exports = app;