const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { pipeline } = require('stream/promises');

// Function to validate URL
const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

// Function to get file extension from URL or content-type
const getFileExtension = (url, contentType) => {
    // First try to get extension from URL
    const urlPath = new URL(url).pathname;
    const urlExt = path.extname(urlPath);
    
    if (urlExt) {
        return urlExt;
    }
    
    // If no extension in URL, try to determine from content-type
    if (contentType) {
        const mimeToExt = {
            'image/jpeg': '.jpg',
            'image/jpg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
            'image/webp': '.webp',
            'image/svg+xml': '.svg',
            'video/mp4': '.mp4',
            'video/avi': '.avi',
            'video/mov': '.mov',
            'video/wmv': '.wmv',
            'video/flv': '.flv',
            'video/webm': '.webm',
            'audio/mp3': '.mp3',
            'audio/mpeg': '.mp3',
            'audio/wav': '.wav',
            'audio/flac': '.flac',
            'audio/aac': '.aac',
            'audio/ogg': '.ogg'
        };
        
        return mimeToExt[contentType.toLowerCase()] || '.bin';
    }
    
    return '.bin'; // Default extension if cannot determine
};

// Main download function
const downloadMedia = async (req, res) => {
    const startTime = Date.now();
    console.log(`📥 ${new Date().toISOString()} - Download request initiated`);
    
    try {
        const { url } = req.body;
        
        // Validate input
        if (!url) {
            console.log(`❌ ${new Date().toISOString()} - Missing URL in request body`);
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'URL is required in the request body'
            });
        }
        
        if (!isValidUrl(url)) {
            console.log(`❌ ${new Date().toISOString()} - Invalid URL: ${url}`);
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Invalid URL format'
            });
        }
        
        console.log(`🔗 ${new Date().toISOString()} - Downloading from: ${url}`);
        
        // Download the file
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
            timeout: 30000, // 30 seconds timeout
            maxRedirects: 5,
            headers: {
                'User-Agent': 'Media-Downloader-API/1.0.0'
            }
        });
        
        // Get content type and size
        const contentType = response.headers['content-type'];
        const contentLength = response.headers['content-length'];
        
        console.log(`📊 ${new Date().toISOString()} - Content-Type: ${contentType}, Size: ${contentLength ? (contentLength / 1024 / 1024).toFixed(2) + 'MB' : 'Unknown'}`);
        
        // Generate unique filename
        const fileExtension = getFileExtension(url, contentType);
        const uniqueId = uuidv4();
        const filename = `${uniqueId}${fileExtension}`;
        const filePath = path.join(__dirname, '..', 'downloads', filename);
        const relativePath = `/downloads/${filename}`;
        
        // Create write stream
        const writeStream = fs.createWriteStream(filePath);
        
        // Use pipeline for efficient streaming with proper error handling
        await pipeline(response.data, writeStream);
        
        const endTime = Date.now();
        const downloadTime = ((endTime - startTime) / 1000).toFixed(2);
        
        console.log(`✅ ${new Date().toISOString()} - Download completed successfully`);
        console.log(`📁 File saved as: ${filename}`);
        console.log(`⏱️ Download time: ${downloadTime} seconds`);
        
        // Return success response
        res.status(200).json({
            success: true,
            filePath: relativePath,
            filename: filename,
            size: contentLength ? parseInt(contentLength) : null,
            contentType: contentType,
            downloadTime: `${downloadTime}s`
        });
        
    } catch (error) {
        const endTime = Date.now();
        const downloadTime = ((endTime - startTime) / 1000).toFixed(2);
        
        console.error(`❌ ${new Date().toISOString()} - Download failed after ${downloadTime}s:`, error.message);
        
        // Handle different types of errors
        if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'The requested URL could not be found or is unreachable'
            });
        }
        
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                error: 'Service Unavailable',
                message: 'Connection to the URL was refused'
            });
        }
        
        if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
            return res.status(408).json({
                success: false,
                error: 'Request Timeout',
                message: 'The download request timed out'
            });
        }
        
        if (error.response) {
            // HTTP error response
            return res.status(error.response.status || 400).json({
                success: false,
                error: 'Download Failed',
                message: `Server responded with status ${error.response.status}: ${error.response.statusText}`
            });
        }
        
        // Generic error
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'An unexpected error occurred during download'
        });
    }
};

module.exports = {
    downloadMedia
};