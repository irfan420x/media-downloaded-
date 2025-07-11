# Media Downloader REST API

A professional Node.js REST API for downloading media files (images, videos, audio) from URLs.

## Features

- ✅ Download media files from any valid URL
- ✅ Support for images, videos, and audio files
- ✅ Unique filename generation using UUID
- ✅ Efficient streaming downloads
- ✅ Comprehensive error handling
- ✅ Real-time download progress logging
- ✅ Automatic downloads folder creation
- ✅ CORS enabled for cross-origin requests
- ✅ Content-type validation
- ✅ Request timeout handling

## Project Structure

```
my-media-downloader/
├── package.json
├── index.js
├── routes/
│   └── download.js
├── controllers/
│   └── downloadController.js
├── downloads/
├── .gitignore
└── README.md
```

## Installation

1. Clone or download the project files
2. Navigate to the project directory:
   ```bash
   cd my-media-downloader
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## API Endpoints

### GET /
Returns API status and available endpoints.

**Response:**
```json
{
  "message": "Media Downloader API is running!",
  "version": "1.0.0",
  "endpoints": {
    "GET /": "API status",
    "POST /api/download": "Download media file"
  }
}
```

### POST /api/download
Downloads a media file from the provided URL.

**Request Body:**
```json
{
  "url": "https://example.com/image.jpg"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "filePath": "/downloads/media_123e4567-e89b-12d3-a456-426614174000.jpg",
  "filename": "media_123e4567-e89b-12d3-a456-426614174000.jpg",
  "originalUrl": "https://example.com/image.jpg",
  "contentType": "image/jpeg",
  "fileSize": 1024000,
  "downloadedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Usage Examples

### Using curl

```bash
# Test API status
curl http://localhost:3000/

# Download an image
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://picsum.photos/800/600"}'

# Download a video
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"}'
```

### Using JavaScript/Fetch

```javascript
// Download media file
const downloadMedia = async (url) => {
  try {
    const response = await fetch('http://localhost:3000/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Download successful:', result.filePath);
    } else {
      console.error('Download failed:', result.message);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};

// Example usage
downloadMedia('https://picsum.photos/800/600');
```

### Using Python/requests

```python
import requests
import json

def download_media(url):
    api_url = "http://localhost:3000/api/download"
    payload = {"url": url}
    
    try:
        response = requests.post(api_url, json=payload)
        result = response.json()
        
        if result.get('success'):
            print(f"Download successful: {result['filePath']}")
        else:
            print(f"Download failed: {result['message']}")
            
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")

# Example usage
download_media("https://picsum.photos/800/600")
```

## Error Handling

The API handles various error scenarios:

- **400 Bad Request**: Missing URL, invalid URL format, not a media file
- **408 Request Timeout**: Download timeout (30 seconds)
- **500 Internal Server Error**: File write errors, unexpected errors

## Supported Media Types

The API validates content types and supports:
- Images: `image/*` (JPEG, PNG, GIF, WebP, etc.)
- Videos: `video/*` (MP4, AVI, MOV, etc.)
- Audio: `audio/*` (MP3, WAV, FLAC, etc.)
- Binary files: `application/octet-stream`

## Deployment

### Render.com
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Set environment variable: `PORT` (optional, defaults to 3000)

### Heroku
1. Create a new Heroku app
2. Connect your repository
3. Deploy using Heroku CLI or GitHub integration
4. The `PORT` environment variable is automatically set by Heroku

### Vercel
1. Import your repository to Vercel
2. Set build command: `npm install`
3. Set output directory: `.`
4. Deploy

## Environment Variables

- `PORT`: Server port (default: 3000)

## Dependencies

- **express**: Web framework
- **axios**: HTTP client for downloads
- **uuid**: Unique ID generation
- **cors**: Cross-origin resource sharing
- **nodemon**: Development auto-restart (dev dependency)

## License

MIT License - feel free to use this project for any purpose.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions, please open an issue on the repository.