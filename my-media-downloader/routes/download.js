const express = require('express');
const { downloadMedia } = require('../controllers/downloadController');

const router = express.Router();

// POST /api/download - Download media from URL
router.post('/download', downloadMedia);

// GET /api/download - Provide API information
router.get('/download', (req, res) => {
    res.json({
        endpoint: 'POST /api/download',
        description: 'Download media files from URLs',
        usage: {
            method: 'POST',
            url: '/api/download',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                url: 'string (required) - The URL of the media file to download'
            }
        },
        example: {
            curl: 'curl -X POST http://localhost:3000/api/download -H "Content-Type: application/json" -d \'{"url":"https://example.com/image.jpg"}\''
        },
        supportedFormats: [
            'Images: JPG, PNG, GIF, WebP, SVG',
            'Videos: MP4, AVI, MOV, WMV, FLV, WebM',
            'Audio: MP3, WAV, FLAC, AAC, OGG'
        ]
    });
});

module.exports = router;