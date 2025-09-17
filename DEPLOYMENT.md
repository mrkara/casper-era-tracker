# Casper Era Tracker - Full-Stack Deployment Guide

This guide covers deploying the complete Casper Era Tracker application with both frontend and backend components.

## Architecture

The application now consists of:
- **Frontend**: React application (built with Vite)
- **Backend**: Flask API server with CSPR.cloud proxy and caching
- **Deployment**: Single Flask server serving both frontend and API

## Features Added

### Backend API
- **Secure API Proxy**: Keeps CSPR.cloud API key server-side
- **Smart Caching**: 1-minute cache to minimize API calls
- **CORS Handling**: Eliminates browser CORS issues
- **Error Handling**: Graceful fallbacks and error responses

### Frontend Updates
- **Backend Integration**: Uses local API instead of direct CSPR.cloud calls
- **Connection Status**: Shows live data vs demo mode
- **Cache Indicators**: Displays cache age and status
- **Improved Error Handling**: Better user feedback

## Deployment Options

### Option 1: Heroku (Recommended)

1. **Prepare the backend directory**:
```bash
cd backend/
```

2. **Initialize Git repository**:
```bash
git init
git add .
git commit -m "Initial commit"
```

3. **Create Heroku app**:
```bash
heroku create your-app-name
```

4. **Set environment variables**:
```bash
heroku config:set CSPR_CLOUD_API_KEY=your_api_key_here
heroku config:set FLASK_ENV=production
```

5. **Deploy**:
```bash
git push heroku main
```

### Option 2: Railway

1. **Connect your repository** to Railway
2. **Set environment variables**:
   - `CSPR_CLOUD_API_KEY`: Your CSPR.cloud API key
   - `FLASK_ENV`: production
3. **Deploy from the `backend/` directory**

### Option 3: Render

1. **Create a new Web Service** on Render
2. **Connect your repository**
3. **Set build and start commands**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
4. **Set environment variables**:
   - `CSPR_CLOUD_API_KEY`: Your API key
   - `PYTHON_VERSION`: 3.11.0

### Option 4: DigitalOcean App Platform

1. **Create a new app** from your repository
2. **Configure the service**:
   - Type: Web Service
   - Source Directory: `/backend`
   - Build Command: `pip install -r requirements.txt`
   - Run Command: `gunicorn app:app`
3. **Set environment variables**

## Local Development

### Backend Development
```bash
cd backend/
pip install -r requirements.txt
python app.py
```
Server runs on http://localhost:5000

### Frontend Development
```bash
cd ../  # Back to project root
pnpm run dev
```
Development server runs on http://localhost:5173

### Full-Stack Development
1. Start backend: `cd backend && python app.py`
2. In another terminal, start frontend: `pnpm run dev`
3. Frontend will proxy API calls to backend automatically

## Environment Variables

### Required
- `CSPR_CLOUD_API_KEY`: Your CSPR.cloud API access token

### Optional
- `FLASK_ENV`: Set to `production` for production deployments
- `CACHE_DURATION`: Cache duration in seconds (default: 60)

## API Endpoints

### Public Endpoints
- `GET /`: Serve React application
- `GET /api/era-info`: Get current era information
- `GET /api/health`: Health check endpoint

### Admin Endpoints
- `POST /api/cache/clear`: Clear the cache
- `GET /api/cache/status`: Get cache status

## Monitoring

### Health Check
The `/api/health` endpoint provides:
- Server status
- Cache validity
- Cache age
- Timestamp

### Cache Management
- Cache automatically expires after 1 minute
- Manual cache clearing available via `/api/cache/clear`
- Cache status monitoring via `/api/cache/status`

## Security Features

1. **API Key Protection**: CSPR.cloud API key is server-side only
2. **CORS Handling**: Proper CORS configuration for cross-origin requests
3. **Error Handling**: No sensitive information leaked in error responses
4. **Rate Limiting**: Built-in via caching mechanism

## Performance Optimizations

1. **Smart Caching**: Reduces API calls to CSPR.cloud
2. **Static File Serving**: Efficient serving of React build files
3. **Gzip Compression**: Automatic compression via gunicorn
4. **CDN Ready**: Static assets can be served via CDN

## Troubleshooting

### Common Issues

1. **CORS Errors**: Should be resolved with backend proxy
2. **API Key Issues**: Check environment variable configuration
3. **Cache Problems**: Use `/api/cache/clear` to reset
4. **Build Failures**: Ensure all dependencies are in requirements.txt

### Debug Mode
For development, set `FLASK_DEBUG=True` to enable debug mode.

### Logs
Check application logs for API errors and cache status:
```bash
heroku logs --tail  # For Heroku
```

## Production Checklist

- [ ] Set `FLASK_ENV=production`
- [ ] Configure `CSPR_CLOUD_API_KEY`
- [ ] Test all API endpoints
- [ ] Verify cache functionality
- [ ] Test frontend-backend integration
- [ ] Monitor application logs
- [ ] Set up health check monitoring

## Scaling Considerations

For high-traffic deployments:
1. **Database Cache**: Replace in-memory cache with Redis
2. **Load Balancing**: Use multiple server instances
3. **CDN**: Serve static assets via CDN
4. **Monitoring**: Add application performance monitoring

---

The application is now production-ready with secure API handling, efficient caching, and seamless frontend-backend integration!
