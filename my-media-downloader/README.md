# 🚀 Media Downloader API

A professional REST API built with Node.js and Express for downloading media files from URLs. The API accepts URLs and downloads images, videos, or audio files with unique filenames.

## ✨ Features

- 📥 Download media files from any URL
- 🔄 Automatic file type detection
- 🆔 Unique filename generation using UUID
- 📁 Organized file storage in `/downloads` folder
- ⚡ Efficient streaming downloads
- 🛡️ Comprehensive error handling
- 📊 Detailed logging with timestamps
- 🌐 Production-ready with proper HTTP status codes

## 🏗️ Project Structure

```
my-media-downloader/
├── package.json          # Dependencies and scripts
├── index.js             # Main server file
├── routes/
│   └── download.js      # API routes
├── controllers/
│   └── downloadController.js  # Download logic
├── downloads/           # Downloaded files (auto-created)
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 📦 Installation

1. **Clone or copy the project files**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

The API will be available at `http://localhost:3000`

## 🔧 API Endpoints

### Health Check
```http
GET /
```
Returns API status and available endpoints.

### Download Media
```http
POST /api/download
```

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
  "filePath": "/downloads/550e8400-e29b-41d4-a716-446655440000.jpg",
  "filename": "550e8400-e29b-41d4-a716-446655440000.jpg",
  "size": 204800,
  "contentType": "image/jpeg",
  "downloadTime": "1.23s"
}
```

**Error Response (400/404/500):**
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Invalid URL format"
}
```

### API Documentation
```http
GET /api/download
```
Returns detailed API usage information.

## 🧪 Testing with cURL

### Basic Image Download
```bash
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://httpbin.org/image/jpeg"}'
```

### Video Download
```bash
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"}'
```

### Test Invalid URL
```bash
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url":"not-a-valid-url"}'
```

### Health Check
```bash
curl http://localhost:3000/
```

## 🎯 Supported Media Types

### Images
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- SVG (.svg)

### Videos
- MP4 (.mp4)
- AVI (.avi)
- MOV (.mov)
- WMV (.wmv)
- FLV (.flv)
- WebM (.webm)

### Audio
- MP3 (.mp3)
- WAV (.wav)
- FLAC (.flac)
- AAC (.aac)
- OGG (.ogg)

## 🚀 Deployment

### Deploy to Render.com

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Set the following:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node.js

### Deploy to Heroku

1. **Create a new Heroku app:**
   ```bash
   heroku create your-app-name
   ```

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

### Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

### Environment Variables

The API uses the following environment variables:

- `PORT` - Server port (default: 3000)

## 🛡️ Error Handling

The API provides comprehensive error handling for various scenarios:

- **400 Bad Request** - Missing or invalid URL
- **404 Not Found** - URL not reachable
- **408 Request Timeout** - Download timeout
- **500 Internal Server Error** - Server errors
- **503 Service Unavailable** - Connection refused

## 📝 Logging

The API logs all operations with timestamps:

- ✅ Successful downloads
- ❌ Failed downloads with error details
- 📊 File size and content type information
- ⏱️ Download duration

## 🔒 Security Features

- Input validation for URLs
- Request timeout protection (30 seconds)
- Maximum redirects limit (5)
- Content-Type validation
- File size monitoring

## 🚀 Performance

- **Streaming downloads** - Memory efficient for large files
- **Async/await** - Non-blocking operations
- **Pipeline streams** - Optimal file writing
- **Connection pooling** - Reused HTTP connections

## 📊 Production Considerations

1. **Add rate limiting** for production use
2. **Implement authentication** if needed
3. **Set up file cleanup** for old downloads
4. **Configure reverse proxy** (nginx)
5. **Add monitoring** and health checks
6. **Set up log rotation**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ using Node.js & Express**