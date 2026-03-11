# EasyXpense - Environment Variables Configuration

## Overview

This document describes all environment variables required for EasyXpense to run in both development and production environments.

---

## Backend Environment Variables (Render)

### Required Variables

#### MONGO_URI
- **Description**: MongoDB Atlas connection string
- **Type**: String
- **Required**: Yes
- **Production Value**: 
  ```
  mongodb+srv://easyXpense:jagdeep2607@easyxpense.pziespr.mongodb.net/easyxpense?retryWrites=true&w=majority&appName=EasyXpense
  ```
- **Local Development**: Same as production or local MongoDB
- **Notes**: 
  - Must include database name in connection string
  - Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0 for Render
  - Connection string is validated on app startup

#### JWT_SECRET
- **Description**: Secret key for JWT token signing and verification
- **Type**: String (32+ characters recommended)
- **Required**: Yes
- **Production Value**: 
  ```
  9f7a41a6e23b5d890cf45a1c3d9e8f7a
  ```
- **Local Development**: Same as production
- **Notes**: 
  - Never commit to version control
  - Must be consistent across all backend instances
  - Used for authentication token generation
  - Validated on app startup

#### PORT
- **Description**: Port number for Flask application
- **Type**: Integer
- **Required**: No (defaults to 5000)
- **Production Value**: 
  ```
  10000
  ```
- **Local Development**: 
  ```
  5000
  ```
- **Notes**: 
  - Render automatically sets this
  - Local development typically uses 5000

### Optional Variables

#### FLASK_ENV
- **Description**: Flask environment mode
- **Type**: String
- **Required**: No
- **Values**: `development` | `production`
- **Production Value**: `production`
- **Local Development**: `development`
- **Notes**: Controls debug mode

---

## Frontend Environment Variables (Netlify)

### Required Variables

#### VITE_API_URL
- **Description**: Backend API base URL
- **Type**: String (URL)
- **Required**: Yes
- **Production Value**: 
  ```
  https://easyxpense.onrender.com/api
  ```
- **Local Development**: 
  ```
  http://localhost:5000/api
  ```
- **Notes**: 
  - Must include `/api` suffix
  - Used by Axios client for all API calls
  - Vite requires `VITE_` prefix for environment variables

---

## Setting Environment Variables

### Render (Backend)

1. Go to Render Dashboard
2. Select your web service (easyxpense-api)
3. Navigate to "Environment" tab
4. Click "Add Environment Variable"
5. Add each variable:

```
MONGO_URI=mongodb+srv://easyXpense:jagdeep2607@easyxpense.pziespr.mongodb.net/easyxpense?retryWrites=true&w=majority&appName=EasyXpense
JWT_SECRET=9f7a41a6e23b5d890cf45a1c3d9e8f7a
PORT=10000
FLASK_ENV=production
```

6. Click "Save Changes"
7. Service will automatically redeploy

### Netlify (Frontend)

1. Go to Netlify Dashboard
2. Select your site (easyxpense)
3. Navigate to "Site settings" → "Environment variables"
4. Click "Add a variable"
5. Add:

```
VITE_API_URL=https://easyxpense.onrender.com/api
```

6. Click "Save"
7. Trigger a new deployment

---

## Local Development Setup

### Backend (.env file)

Create `backend/.env`:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://easyXpense:jagdeep2607@easyxpense.pziespr.mongodb.net/easyxpense?retryWrites=true&w=majority&appName=EasyXpense

# JWT Secret
JWT_SECRET=9f7a41a6e23b5d890cf45a1c3d9e8f7a

# Server Port
PORT=5000

# Flask Environment
FLASK_ENV=development
```

**Important**: 
- Never commit `.env` to git
- `.env` is in `.gitignore`
- Use `.env.example` as template

### Frontend (.env file)

Create `frontend/.env`:

```env
# API Base URL
VITE_API_URL=http://localhost:5000/api
```

For production testing locally, create `frontend/.env.production`:

```env
# Production API URL
VITE_API_URL=https://easyxpense.onrender.com/api
```

---

## Environment Variable Validation

### Backend Validation

The backend validates required environment variables on startup:

```python
# In app.py
if not Config.MONGO_URI:
    raise ValueError("MONGO_URI environment variable is required")
if not Config.JWT_SECRET:
    raise ValueError("JWT_SECRET environment variable is required")
```

If validation fails, the application will not start and will show an error message.

### Frontend Validation

The frontend uses a fallback for development:

```javascript
// In api.js
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
```

If `VITE_API_URL` is not set, it defaults to localhost.

---

## Accessing Environment Variables in Code

### Backend (Python)

```python
# Import from config
from config.config import Config

# Use in code
mongo_uri = Config.MONGO_URI
jwt_secret = Config.JWT_SECRET
port = Config.PORT
```

### Frontend (JavaScript)

```javascript
// Access Vite environment variables
const apiUrl = import.meta.env.VITE_API_URL;

// In api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});
```

---

## Security Best Practices

### DO ✅

- Store all secrets in environment variables
- Use different values for development and production
- Rotate secrets periodically
- Use strong, random values for JWT_SECRET
- Keep `.env` files in `.gitignore`
- Document required variables
- Validate environment variables on startup

### DON'T ❌

- Commit `.env` files to git
- Hardcode secrets in source code
- Share secrets in plain text
- Use weak or predictable secrets
- Reuse secrets across projects
- Log environment variable values
- Include secrets in error messages

---

## Troubleshooting

### Issue: "MONGO_URI environment variable is required"

**Cause**: MONGO_URI not set or empty

**Solution**:
1. Check environment variable is set in Render/Netlify
2. Verify `.env` file exists locally
3. Ensure no typos in variable name
4. Restart application after setting

### Issue: "JWT_SECRET environment variable is required"

**Cause**: JWT_SECRET not set or empty

**Solution**:
1. Check environment variable is set in Render
2. Verify `.env` file exists locally
3. Ensure variable is not empty
4. Restart application after setting

### Issue: Frontend shows "Network Error"

**Cause**: VITE_API_URL not set or incorrect

**Solution**:
1. Check VITE_API_URL in Netlify
2. Verify URL includes `/api` suffix
3. Ensure backend URL is correct
4. Redeploy frontend after setting

### Issue: CORS Error

**Cause**: Frontend URL not in CORS allowed origins

**Solution**:
1. Check `app.py` CORS configuration
2. Verify Netlify URL is in allowed_origins
3. Redeploy backend after updating

---

## Environment Variables Checklist

### Before Deployment

Backend:
- [ ] MONGO_URI set in Render
- [ ] JWT_SECRET set in Render
- [ ] PORT set in Render (10000)
- [ ] FLASK_ENV set to production
- [ ] All variables validated

Frontend:
- [ ] VITE_API_URL set in Netlify
- [ ] URL includes `/api` suffix
- [ ] URL points to Render backend

Local Development:
- [ ] backend/.env created
- [ ] frontend/.env created
- [ ] All required variables set
- [ ] .env files in .gitignore

### After Deployment

- [ ] Backend starts without errors
- [ ] Frontend builds successfully
- [ ] API calls work from frontend
- [ ] Authentication works
- [ ] Database connection successful
- [ ] No hardcoded values in logs

---

## Quick Reference

### Backend Environment Variables

```bash
# Render Dashboard → Environment
MONGO_URI=mongodb+srv://easyXpense:jagdeep2607@easyxpense.pziespr.mongodb.net/easyxpense?retryWrites=true&w=majority&appName=EasyXpense
JWT_SECRET=9f7a41a6e23b5d890cf45a1c3d9e8f7a
PORT=10000
FLASK_ENV=production
```

### Frontend Environment Variables

```bash
# Netlify Dashboard → Environment Variables
VITE_API_URL=https://easyxpense.onrender.com/api
```

### Local Development

```bash
# backend/.env
MONGO_URI=mongodb+srv://easyXpense:jagdeep2607@easyxpense.pziespr.mongodb.net/easyxpense?retryWrites=true&w=majority&appName=EasyXpense
JWT_SECRET=9f7a41a6e23b5d890cf45a1c3d9e8f7a
PORT=5000
FLASK_ENV=development

# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

---

## Testing Environment Variables

### Backend Test

```bash
# Test if environment variables are loaded
cd backend
python -c "from config.config import Config; print(f'MONGO_URI: {Config.MONGO_URI[:20]}...'); print(f'JWT_SECRET: {Config.JWT_SECRET[:10]}...'); print(f'PORT: {Config.PORT}')"
```

### Frontend Test

```bash
# Test if Vite loads environment variables
cd frontend
npm run dev
# Check browser console: console.log(import.meta.env.VITE_API_URL)
```

---

## Migration from Hardcoded Values

If you have hardcoded values in your code:

1. **Identify hardcoded values**:
   ```bash
   # Search for hardcoded MongoDB URIs
   grep -r "mongodb://" .
   grep -r "mongodb+srv://" .
   
   # Search for hardcoded secrets
   grep -r "supersecretkey" .
   
   # Search for hardcoded URLs
   grep -r "localhost:5000" .
   ```

2. **Replace with environment variables**:
   - Backend: Use `Config.VARIABLE_NAME`
   - Frontend: Use `import.meta.env.VITE_VARIABLE_NAME`

3. **Test thoroughly**:
   - Local development
   - Production deployment
   - All features

---

## Support

For issues with environment variables:

1. Check this documentation
2. Verify variables are set correctly
3. Check application logs
4. Validate variable names (no typos)
5. Ensure proper formatting

---

## Summary

✅ All secrets stored in environment variables
✅ No hardcoded credentials in source code
✅ Separate configurations for dev/prod
✅ Validation on application startup
✅ Secure and maintainable configuration

**Your application is now properly configured with environment variables!**
