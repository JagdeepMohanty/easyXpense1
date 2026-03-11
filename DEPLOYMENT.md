# EasyXpense - Deployment Guide

Complete guide for deploying EasyXpense to production using Render (backend) and Netlify (frontend).

## Prerequisites

- GitHub account
- Render account (https://render.com)
- Netlify account (https://netlify.com)
- MongoDB Atlas account (for production database)

---

## Part 1: MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Click "Build a Database"
4. Choose "FREE" tier (M0)
5. Select a cloud provider and region
6. Click "Create Cluster"

### Step 2: Create Database User

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### Step 3: Configure Network Access

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 4: Get Connection String

1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `easyxpense`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/easyxpense?retryWrites=true&w=majority
```

---

## Part 2: Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. Ensure `requirements.txt` includes gunicorn:
```
Flask==3.0.0
flask-cors==4.0.0
pymongo==4.6.1
python-dotenv==1.0.0
PyJWT==2.8.0
bcrypt==4.1.2
gunicorn==21.2.0
```

2. Create `.gitignore` in backend folder:
```
.env
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
venv/
```

### Step 2: Push Backend to GitHub

1. Create a new GitHub repository (e.g., `easyxpense-backend`)
2. Initialize git in backend folder:
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/easyxpense-backend.git
git push -u origin main
```

### Step 3: Deploy to Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: easyxpense-api
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: Free

5. Add Environment Variables:
   - Click "Advanced" → "Add Environment Variable"
   - Add the following:
     ```
     MONGO_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_super_secret_jwt_key_here
     PORT=10000
     ```

6. Click "Create Web Service"

7. Wait for deployment (5-10 minutes)

8. Copy your backend URL (e.g., `https://easyxpense-api.onrender.com`)

---

## Part 3: Frontend Deployment (Netlify)

### Step 1: Update API Configuration

1. Update `frontend/src/services/api.js`:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('easyxpense_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
```

2. Create `.env.production` in frontend folder:
```
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

3. Create `.gitignore` in frontend folder:
```
node_modules/
dist/
.env
.env.local
.env.production.local
```

### Step 2: Create Netlify Configuration

Create `netlify.toml` in frontend folder:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 3: Push Frontend to GitHub

1. Create a new GitHub repository (e.g., `easyxpense-frontend`)
2. Initialize git in frontend folder:
```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/easyxpense-frontend.git
git push -u origin main
```

### Step 4: Deploy to Netlify

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Select your frontend repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: (leave empty)

6. Add Environment Variables:
   - Click "Site settings" → "Environment variables"
   - Add:
     ```
     VITE_API_URL=https://your-render-backend-url.onrender.com/api
     ```

7. Click "Deploy site"

8. Wait for deployment (2-5 minutes)

9. Your site will be live at `https://random-name.netlify.app`

### Step 5: Custom Domain (Optional)

1. Go to "Domain settings"
2. Click "Add custom domain"
3. Follow instructions to configure DNS

---

## Part 4: Post-Deployment Configuration

### Update CORS Settings

If you encounter CORS errors, update backend `app.py`:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    'http://localhost:3000',
    'https://your-netlify-site.netlify.app'
])
```

### Test the Deployment

1. Visit your Netlify URL
2. Register a new user
3. Login
4. Create a group
5. Add expenses
6. Check debts
7. Settle payments

---

## Part 5: Environment Variables Summary

### Backend (Render)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/easyxpense
JWT_SECRET=your_super_secret_key_minimum_32_characters
PORT=10000
```

### Frontend (Netlify)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Part 6: Monitoring & Maintenance

### Render Dashboard

- View logs: Click on your service → "Logs"
- Monitor health: Check "Events" tab
- Restart service: Click "Manual Deploy" → "Deploy latest commit"

### Netlify Dashboard

- View deployments: "Deploys" tab
- Check build logs: Click on a deployment
- Rollback: Click "..." on a deployment → "Publish deploy"

### MongoDB Atlas

- Monitor usage: "Metrics" tab
- View collections: "Browse Collections"
- Backup: "Backup" tab (paid feature)

---

## Part 7: Troubleshooting

### Backend Issues

**Issue: Service won't start**
- Check logs in Render dashboard
- Verify environment variables are set
- Ensure MongoDB connection string is correct

**Issue: 502 Bad Gateway**
- Check if service is running
- Verify start command: `gunicorn app:app`
- Check for Python errors in logs

**Issue: Database connection failed**
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Check connection string format
- Ensure database user has correct permissions

### Frontend Issues

**Issue: API calls failing**
- Check VITE_API_URL is set correctly
- Verify CORS is configured on backend
- Check browser console for errors

**Issue: 404 on page refresh**
- Ensure `netlify.toml` has redirect rules
- Verify publish directory is `dist`

**Issue: Environment variables not working**
- Redeploy after adding variables
- Check variable names start with `VITE_`
- Clear browser cache

---

## Part 8: Performance Optimization

### Backend

1. **Enable Caching**:
```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@cache.cached(timeout=300)
def expensive_operation():
    pass
```

2. **Database Indexing**:
- Ensure indexes on frequently queried fields
- MongoDB Atlas provides index recommendations

3. **Connection Pooling**:
- PyMongo handles this automatically
- Configure max pool size if needed

### Frontend

1. **Code Splitting**:
- Vite handles this automatically
- Use dynamic imports for large components

2. **Image Optimization**:
- Compress images before upload
- Use WebP format

3. **Lazy Loading**:
```javascript
const Settlement = lazy(() => import('./pages/Settlement'));
```

---

## Part 9: Security Best Practices

### Backend

1. **Strong JWT Secret**:
```
Use minimum 32 characters
Mix uppercase, lowercase, numbers, symbols
Never commit to git
```

2. **Rate Limiting**:
```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=get_remote_address)

@app.route('/api/auth/login')
@limiter.limit("5 per minute")
def login():
    pass
```

3. **HTTPS Only**:
- Render provides HTTPS automatically
- Enforce HTTPS in production

### Frontend

1. **Secure Token Storage**:
- Use httpOnly cookies (more secure than localStorage)
- Or keep using localStorage with XSS protection

2. **Input Validation**:
- Validate all user inputs
- Sanitize data before display

3. **Content Security Policy**:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```

---

## Part 10: Backup Strategy

### Database Backups

1. **MongoDB Atlas Automated Backups** (Paid):
- Enable in Atlas dashboard
- Configure retention period

2. **Manual Backups**:
```bash
mongodump --uri="mongodb+srv://..." --out=./backup
```

3. **Restore**:
```bash
mongorestore --uri="mongodb+srv://..." ./backup
```

### Code Backups

- GitHub serves as version control
- Tag releases: `git tag v1.0.0`
- Create releases on GitHub

---

## Part 11: Scaling Considerations

### When to Scale

- Response time > 2 seconds
- Error rate > 1%
- CPU usage > 80%
- Memory usage > 80%

### Scaling Options

**Render:**
- Upgrade to paid plan
- Increase instance size
- Add more instances (horizontal scaling)

**MongoDB Atlas:**
- Upgrade cluster tier
- Enable sharding
- Add read replicas

**Netlify:**
- Automatic scaling (included)
- CDN distribution (included)

---

## Part 12: Cost Estimation

### Free Tier Limits

**Render Free:**
- 750 hours/month
- Sleeps after 15 min inactivity
- 512 MB RAM
- Shared CPU

**Netlify Free:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

**MongoDB Atlas Free:**
- 512 MB storage
- Shared cluster
- No backups

### Paid Plans (Approximate)

**Render:**
- Starter: $7/month
- Standard: $25/month

**Netlify:**
- Pro: $19/month

**MongoDB Atlas:**
- M10: $57/month
- M20: $116/month

---

## Part 13: Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables documented
- [ ] .gitignore configured
- [ ] Dependencies updated
- [ ] Security review completed

### Backend Deployment

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist configured
- [ ] Connection string obtained
- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Environment variables set
- [ ] Service deployed successfully
- [ ] Health check passing

### Frontend Deployment

- [ ] API URL updated
- [ ] Environment variables set
- [ ] Code pushed to GitHub
- [ ] Netlify site created
- [ ] Build successful
- [ ] Site accessible
- [ ] API calls working

### Post-Deployment

- [ ] User registration tested
- [ ] Login tested
- [ ] All features tested
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Documentation updated

---

## Deployment Complete! 🎉

Your EasyXpense application is now live and accessible worldwide!

**Backend**: https://your-backend.onrender.com
**Frontend**: https://your-site.netlify.app

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Flask Docs**: https://flask.palletsprojects.com
- **React Docs**: https://react.dev
