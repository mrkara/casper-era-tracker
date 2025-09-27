# Security Guidelines

This document outlines important security considerations for the Casper Era Tracker application.

## Environment Configuration

### Debug Mode Security

**CRITICAL**: Never run the Flask application with debug mode enabled in production environments.

- **Development**: Set `FLASK_DEBUG=true` only for local development
- **Production**: Always ensure `FLASK_DEBUG=false` or omit the variable entirely
- **Default Behavior**: The application defaults to `debug=False` for security

### Environment Variables

Ensure the following environment variables are properly configured:

```bash
# Required
CSPR_CLOUD_API_KEY=your_secure_api_key

# Security Settings
FLASK_ENV=production
FLASK_DEBUG=false

# Optional
CACHE_DURATION=60
```

## API Key Protection

- Store API keys in environment variables, never in code
- Use different API keys for development and production
- Regularly rotate API keys
- Monitor API key usage for suspicious activity

## Deployment Security

- Always use HTTPS in production
- Configure proper CORS settings
- Use a production WSGI server (Gunicorn, uWSGI)
- Enable security headers
- Regular security updates for dependencies

## Development vs Production

### Development Setup
```bash
export FLASK_DEBUG=true
export FLASK_ENV=development
python app.py
```

### Production Setup
```bash
export FLASK_DEBUG=false
export FLASK_ENV=production
gunicorn app:app
```

## Security Checklist

- [ ] Debug mode disabled in production
- [ ] API keys stored securely
- [ ] HTTPS enabled
- [ ] Dependencies updated
- [ ] Security headers configured
- [ ] Error handling doesn't leak sensitive information
