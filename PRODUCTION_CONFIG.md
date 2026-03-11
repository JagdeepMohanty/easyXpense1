# EasyXpense - Production Configuration Guide

## Production URLs

- **Frontend (Netlify)**: https://easyxpense.netlify.app
- **Backend (Render)**: https://easyxpense.onrender.com
- **Database**: MongoDB Atlas

---

## Backend Configuration (Render)

### Environment Variables

Set these in Render Dashboard → Environment:

```
MONGO_URI=mongodb+srv://easyXpense:jagdeep2607@easyxpense.pziespr.mongodb.net/easyxpense?retryWrites=true&w=majority&appName=EasyXpense
JWT_SECRET=9f7a41a6e23b5d890cf45a1c3d9e8f7a
PORT=10000
```

### Build Settings

- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`
- **Python Version**: 3.11

### CORS Configuration

The backend is configured to accept requests from:
- http://localhost:3000 (development)
- http://localhost:5173 (Vite dev server)
- https://easyxpense.netlify.app (production)

---

## Frontend Configuration (Netlify)

### Environment Variables

Set these in Netlify Dashboard → Site settings → Environment variables:

```
VITE_API_URL=https://easyxpense.onrender.com/api
```

### Build Settings

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18

### Local Development

Create `frontend/.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

For production testing, create `frontend/.env.production`:
```
VITE_API_URL=https://easyxpense.onrender.com/api
```

---

## MongoDB Atlas Configuration

### Connection String

```
mongodb+srv://easyXpense:jagdeep2607@easyxpense.pziespr.mongodb.net/easyxpense?retryWrites=true&w=majority&appName=EasyXpense
```

### Database Name

`easyxpense`

### Collections

- users
- friend_requests
- friends
- groups
- expenses
- settlements

### Network Access

Ensure IP whitelist includes:
- `0.0.0.0/0` (Allow from anywhere) - Required for Render

---

## Deployment Checklist

### Backend (Render)

- [x] Environment variables set
- [x] MONGO_URI configured
- [x] JWT_SECRET configured
- [x] PORT configured
- [x] CORS origins include Netlify URL
- [x] gunicorn in requirements.txt
- [x] Start command: `gunicorn app:app`
- [x] All routes start with `/api/`

### Frontend (Netlify)

- [x] Environment variable VITE_API_URL set
- [x] Build command: `npm run build`
- [x] Publish directory: `dist`
- [x] netlify.toml created
- [x] SPA redirects configured
- [x] API client uses environment variable

### Database (MongoDB Atlas)

- [x] Cluster created
- [x] Database user created
- [x] Network access configured (0.0.0.0/0)
- [x] Connection string obtained
- [x] Database name: easyxpense

---

## API Endpoints

All endpoints are prefixed with `/api/`:

### Health
- GET `/api/health`

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Friends
- POST `/api/friends/request`
- POST `/api/friends/accept`
- GET `/api/friends`
- GET `/api/friends/requests/pending`

### Groups
- POST `/api/groups`
- GET `/api/groups`
- GET `/api/groups/:id`
- POST `/api/groups/:id/members`

### Expenses
- POST `/api/expenses`
- GET `/api/expenses`
- GET `/api/expenses/groups/:id`

### Debts
- GET `/api/debts`
- GET `/api/debts/groups/:id`

### Settlements
- POST `/api/settlements`
- GET `/api/settlements`
- GET `/api/settlements/groups/:id`

### Analytics
- GET `/api/analytics`

---

## Testing Production Deployment

### 1. Health Check

```bash
curl https://easyxpense.onrender.com/api/health
```

Expected response:
```json
{"status": "EasyXpense API running"}
```

### 2. User Registration

```bash
curl -X POST https://easyxpense.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

Expected response:
```json
{"message": "User registered successfully"}
```

### 3. User Login

```bash
curl -X POST https://easyxpense.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### 4. Frontend Test

1. Visit https://easyxpense.netlify.app
2. Register a new account
3. Login with credentials
4. Create a group
5. Add expenses
6. Check debts
7. Settle payments

---

## Troubleshooting

### Issue: CORS Error

**Symptom**: Frontend shows CORS error in console

**Solution**:
1. Verify backend CORS configuration includes Netlify URL
2. Check Render logs for CORS errors
3. Ensure frontend is using correct API URL

### Issue: MongoDB Connection Failed

**Symptom**: Backend logs show "MongoServerError"

**Solution**:
1. Verify MONGO_URI is set correctly in Render
2. Check MongoDB Atlas network access (0.0.0.0/0)
3. Verify database user credentials
4. Check connection string format

### Issue: JWT Token Invalid

**Symptom**: "Invalid token" or "Token expired" errors

**Solution**:
1. Verify JWT_SECRET is set in Render
2. Check JWT_SECRET matches between environments
3. Clear browser localStorage and login again

### Issue: API Calls Failing

**Symptom**: Frontend shows "Network Error"

**Solution**:
1. Verify VITE_API_URL is set in Netlify
2. Check backend is running on Render
3. Test API directly with curl
4. Check browser console for errors

### Issue: 404 on Page Refresh

**Symptom**: Netlify shows 404 when refreshing non-root pages

**Solution**:
1. Verify netlify.toml exists
2. Check redirects configuration
3. Ensure publish directory is `dist`

---

## Environment Variables Summary

### Backend (Render)

| Variable | Value |
|----------|-------|
| MONGO_URI | mongodb+srv://easyXpense:jagdeep2607@easyxpense.pziespr.mongodb.net/easyxpense?retryWrites=true&w=majority&appName=EasyXpense |
| JWT_SECRET | 9f7a41a6e23b5d890cf45a1c3d9e8f7a |
| PORT | 10000 |

### Frontend (Netlify)

| Variable | Value |
|----------|-------|
| VITE_API_URL | https://easyxpense.onrender.com/api |

---

## Security Notes

### JWT Secret

- Current secret: `9f7a41a6e23b5d890cf45a1c3d9e8f7a`
- Length: 32 characters (hexadecimal)
- Never commit to git
- Rotate periodically for security

### MongoDB Credentials

- Username: `easyXpense`
- Password: `jagdeep2607`
- Never commit to git
- Use environment variables only

### CORS

- Restricted to specific origins
- Does not allow all origins (*)
- Supports credentials for cookies

---

## Monitoring

### Render Dashboard

- View logs: Service → Logs tab
- Monitor health: Events tab
- Check metrics: Metrics tab

### Netlify Dashboard

- View deployments: Deploys tab
- Check build logs: Click on deployment
- Monitor analytics: Analytics tab

### MongoDB Atlas

- Monitor connections: Metrics tab
- View operations: Real-time Performance
- Check storage: Collections tab

---

## Backup Strategy

### Database Backups

MongoDB Atlas provides automated backups (paid feature).

For manual backups:
```bash
mongodump --uri="mongodb+srv://easyXpense:jagdeep2607@easyxpense.pziespr.mongodb.net/easyxpense" --out=./backup
```

### Code Backups

- GitHub repository serves as version control
- Tag releases for important versions
- Keep deployment configurations documented

---

## Performance Optimization

### Backend

1. **Database Indexing**
   - Ensure indexes on frequently queried fields
   - MongoDB Atlas provides index recommendations

2. **Connection Pooling**
   - PyMongo handles automatically
   - Default pool size: 100

3. **Caching**
   - Consider Redis for session storage
   - Cache frequently accessed data

### Frontend

1. **Code Splitting**
   - Vite handles automatically
   - Lazy load routes if needed

2. **Asset Optimization**
   - Vite optimizes during build
   - Images compressed
   - CSS minified

3. **CDN**
   - Netlify provides global CDN
   - Assets served from edge locations

---

## Scaling Considerations

### When to Scale

- Response time > 2 seconds
- Error rate > 1%
- CPU usage > 80%
- Memory usage > 80%

### Scaling Options

**Render:**
- Upgrade to paid plan ($7/month)
- Increase instance size
- Add horizontal scaling

**MongoDB Atlas:**
- Upgrade cluster tier (M10: $57/month)
- Enable sharding
- Add read replicas

**Netlify:**
- Automatic scaling included
- No action needed

---

## Cost Estimation

### Current Setup (Free Tier)

- **Render**: Free (with limitations)
- **Netlify**: Free (100GB bandwidth/month)
- **MongoDB Atlas**: Free (512MB storage)

**Total**: $0/month

### Recommended Production Setup

- **Render Starter**: $7/month
- **Netlify Pro**: $19/month (optional)
- **MongoDB M10**: $57/month

**Total**: $64-83/month

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Vite Docs**: https://vitejs.dev
- **Flask Docs**: https://flask.palletsprojects.com

---

## Production Ready! ✅

Your EasyXpense application is now configured for production deployment with:

- ✅ Production URLs configured
- ✅ MongoDB Atlas connection
- ✅ JWT authentication
- ✅ CORS properly configured
- ✅ Environment variables set
- ✅ Deployment configurations ready

**Frontend**: https://easyxpense.netlify.app
**Backend**: https://easyxpense.onrender.com
