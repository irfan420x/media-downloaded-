const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { URL } = require('url');

/**
 * Download media file from URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const downloadMedia = async (req, res) => {
  const { url } = req.body;
  const timestamp = new Date().toISOString();

  // Validate request body
  if (!url) {
    console.log(`❌ [${timestamp}] Download failed: Missing URL`);
    return res.status(400).json({
      success: false,
      error: 'Missing URL',
      message: 'URL is required in request body'
    });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch (error) {
    console.log(`❌ [${timestamp}] Download failed: Invalid URL - ${url}`);
    return res.status(400).json({
      success: false,
      error: 'Invalid URL',
      message: 'Please provide a valid URL'
    });
  }

  try {
    console.log(`📥 [${timestamp}] Starting download from: ${url}`);

    // Get file info from URL
    const urlPath = new URL(url).pathname;
    const originalExtension = path.extname(urlPath) || '';
    
    // Generate unique filename
    const uniqueId = uuidv4();
    const filename = `media_${uniqueId}${originalExtension}`;
    const filePath = path.join(__dirname, '..', 'downloads', filename);

    // Download file with axios
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      timeout: 30000, // 30 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      validateStatus: function (status) {
        return status >= 200 && status < 300; // Accept only 2xx status codes
      }
    });

    // Check content type to ensure it's a media file
    const contentType = response.headers['content-type'] || '';
    const isMediaFile = contentType.startsWith('image/') || 
                       contentType.startsWith('video/') || 
                       contentType.startsWith('audio/') ||
                       contentType.includes('application/octet-stream');

    if (!isMediaFile) {
      console.log(`❌ [${timestamp}] Download failed: Not a media file - Content-Type: ${contentType}`);
      return res.status(400).json({
        success: false,
        error: 'Not a media file',
        message: 'The provided URL does not point to a valid media file'
      });
    }

    // Get file size
    const contentLength = response.headers['content-length'];
    const fileSize = contentLength ? parseInt(contentLength) : 'unknown';
    
    console.log(`📊 [${timestamp}] File info - Size: ${fileSize} bytes, Type: ${contentType}`);

    // Create write stream
    const writer = fs.createWriteStream(filePath);

    // Handle stream events
    let downloadedBytes = 0;
    response.data.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      if (contentLength) {
        const progress = ((downloadedBytes / contentLength) * 100).toFixed(2);
        console.log(`📈 [${timestamp}] Download progress: ${progress}%`);
      }
    });

    // Pipe the response to file
    response.data.pipe(writer);

    // Handle completion
    writer.on('finish', () => {
      console.log(`✅ [${timestamp}] Download completed: ${filename}`);
      console.log(`💾 [${timestamp}] File saved to: ${filePath}`);
      
      res.status(200).json({
        success: true,
        filePath: `/downloads/${filename}`,
        filename: filename,
        originalUrl: url,
        contentType: contentType,
        fileSize: downloadedBytes,
        downloadedAt: timestamp
      });
    });

    // Handle write errors
    writer.on('error', (error) => {
      console.error(`❌ [${timestamp}] File write error:`, error.message);
      res.status(500).json({
        success: false,
        error: 'File write error',
        message: 'Failed to save the downloaded file'
      });
    });

  } catch (error) {
    console.error(`❌ [${timestamp}] Download error:`, error.message);
    
    // Handle specific axios errors
    if (error.code === 'ECONNREFUSED') {
      return res.status(400).json({
        success: false,
        error: 'Connection refused',
        message: 'Unable to connect to the provided URL'
      });
    }
    
    if (error.code === 'ENOTFOUND') {
      return res.status(400).json({
        success: false,
        error: 'URL not found',
        message: 'The provided URL could not be resolved'
      });
    }
    
    if (error.response) {
      // Server responded with error status
      return res.status(400).json({
        success: false,
        error: 'Download failed',
        message: `Server responded with status ${error.response.status}`
      });
    }
    
    if (error.code === 'ETIMEDOUT') {
      return res.status(408).json({
        success: false,
        error: 'Request timeout',
        message: 'Download request timed out'
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      error: 'Download failed',
      message: 'An unexpected error occurred during download'
    });
  }
};

module.exports = {
  downloadMedia
};