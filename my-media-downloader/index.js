const express = require('express');
const path = require('path');
const fs = require('fs');
const downloadRoutes = require('./routes/download');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
    console.log(`📁 Created downloads directory: ${downloadsDir}`);
}

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'Media Downloader API is running!',
        version: '1.0.0',
        endpoints: {
            download: 'POST /api/download',
            health: 'GET /'
        }
    });
});

// API Routes
app.use('/api', downloadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`❌ ${new Date().toISOString()} - Error:`, err.message);
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
        error: 'Endpoint not found',
        message: `The endpoint ${req.method} ${req.originalUrl} does not exist`
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Media Downloader API is running on port ${PORT}`);
    console.log(`📱 Access the API at: http://localhost:${PORT}`);
    console.log(`💾 Downloads will be saved to: ${downloadsDir}`);
});