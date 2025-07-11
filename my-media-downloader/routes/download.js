const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');

// POST /api/download - Download media file
router.post('/download', downloadController.downloadMedia);

module.exports = router;