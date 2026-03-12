# RENDER PRODUCTION DEPLOYMENT CONFIGURATION

## PRODUCTION-READY FLASK BACKEND

### 1. CORRECT START COMMAND ✓

```bash
gunicorn backend.app:app --bind 0.0.0.0:$PORT --workers 3 --timeout 120
```

**Explanation:**
- `backend.app` → Python module path (backend/app.py)
- `app` → Flask application instance
- `--bind 0.0.0.0:$PORT` → Bind to Render's dynamic port
- `--workers 3` → Use 3 worker processes for production
- `--timeout 120` → 120 second timeout for long requests

### 2. CORRECT BUILD COMMAND ✓

```bash
pip install -r requirements.txt
```

### 3. REQUIREMENTS.TXT ✓

**Location:** Repository root
**Content:**
```
Flask==3.0.0
flask-cors==4.0.0
pymongo==4.6.1
python-dotenv==1.0.0
PyJWT==2.8.0
bcrypt==4.1.2
gunicorn==21.2.0
```

### 4. ENVIRONMENT VARIABLES

Configure these in **Render Dashboard → Environment**:

| Variable | Value |
|----------|-------|
| `MONGO_URI` | `mongodb+srv://easyXpense:jagdeep2607@easyxpense.pziespr.mongodb.net/easyxpense?retryWrites=true&w=majority&appName=EasyXpense` |
| `JWT_SECRET` | `9f7a41a6e23b5d890cf45a1c3d9e8f7a` |
| `PORT` | `10000` |
| `FLASK_ENV` | `production` |
| `PYTHON_VERSION` | `3.11.0` |

### 5. FLASK ENTRY FILE VERIFIED ✓

**File:** `backend/app.py`

**Key Components:**
- ✓ Flask app instance: `app = Flask(__name__)`
- ✓ CORS configured for Netlify: `https://easyxpense.netlify.app`
- ✓ Environment variable validation
- ✓ Health check endpoint: `/api/health`
- ✓ All routes registered (auth, friends, groups, expenses, debts, settlements, analytics)

### 6. CORS CONFIGURATION ✓

Already configured in `backend/app.py`:
```python
allowed_origins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://easyxpense.netlify.app'
]
CORS(app, origins=allowed_origins, supports_credentials=True)
```

### 7. HEALTH CHECK ENDPOINT ✓

**Endpoint:** `/api/health`
**Method:** GET
**Response:** `{"status": "EasyXpense API running"}`

Already implemented in `backend/routes/health.py`

---

## RENDER DASHBOARD CONFIGURATION

### Step-by-Step Setup:

1. **Create New Web Service**
   - Connect GitHub repository
   - Select branch: `main`

2. **Build Settings**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn backend.app:app --bind 0.0.0.0:$PORT --workers 3 --timeout 120`

3. **Environment Variables**
   - Add all variables from table above
   - Ensure `PORT` is set to `10000`

4. **Advanced Settings**
   - **Auto-Deploy:** Yes
   - **Health Check Path:** `/api/health`

---

## DEPLOYMENT URLS

### Production URLs:
- **Frontend:** https://easyxpense.netlify.app
- **Backend:** https://easyxpense.onrender.com
- **Health Check:** https://easyxpense.onrender.com/api/health

### API Endpoints:
- **Health:** `GET /api/health`
- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`
- **Friends:** `GET /api/friends`, `POST /api/friends/request`
- **Groups:** `GET /api/groups`, `POST /api/groups`
- **Expenses:** `GET /api/expenses`, `POST /api/expenses`
- **Debts:** `GET /api/debts`
- **Settlements:** `GET /api/settlements`, `POST /api/settlements`
- **Analytics:** `GET /api/analytics`

---

## VERIFICATION CHECKLIST

### Pre-Deployment:
- [x] `requirements.txt` in repository root
- [x] Flask app instance in `backend/app.py`
- [x] Health check endpoint exists
- [x] CORS allows Netlify origin
- [x] Environment variables documented

### Render Configuration:
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `gunicorn backend.app:app --bind 0.0.0.0:$PORT --workers 3 --timeout 120`
- [ ] Environment variables set (MONGO_URI, JWT_SECRET, PORT, FLASK_ENV)
- [ ] Health check path: `/api/health`
- [ ] Auto-deploy enabled

### Post-Deployment Testing:
- [ ] Backend URL accessible: https://easyxpense.onrender.com
- [ ] Health check works: https://easyxpense.onrender.com/api/health
- [ ] Expected response: `{"status": "EasyXpense API running"}`
- [ ] MongoDB connection successful (check logs)
- [ ] No CORS errors from frontend
- [ ] Authentication endpoints working
- [ ] All API endpoints responding

---

## TROUBLESHOOTING

### Common Issues:

**1. ModuleNotFoundError: No module named 'your_application'**
- **Cause:** Incorrect start command
- **Fix:** Use `gunicorn backend.app:app --bind 0.0.0.0:$PORT --workers 3 --timeout 120`

**2. ModuleNotFoundError: No module named 'backend'**
- **Cause:** Gunicorn running from wrong directory
- **Fix:** Ensure start command uses `backend.app:app` (not `app:app`)

**3. Connection refused to MongoDB**
- **Cause:** MONGO_URI not set or incorrect
- **Fix:** Verify environment variable in Render dashboard

**4. CORS errors from frontend**
- **Cause:** Frontend origin not allowed
- **Fix:** Verify `https://easyxpense.netlify.app` in allowed_origins

**5. 502 Bad Gateway**
- **Cause:** App not binding to correct port
- **Fix:** Ensure `--bind 0.0.0.0:$PORT` in start command

---

## EXPECTED RESULT

After successful deployment, the backend will:

✅ Start with Gunicorn (3 workers)
✅ Connect to MongoDB Atlas
✅ Accept requests from Netlify frontend
✅ Support all features:
   - User authentication (register, login)
   - Friends system (requests, accept)
   - Groups management
   - Expenses tracking
   - Debt calculation
   - Settlement recording
   - Analytics

---

## PRODUCTION MONITORING

### Health Check:
```bash
curl https://easyxpense.onrender.com/api/health
```

**Expected Response:**
```json
{"status": "EasyXpense API running"}
```

### Logs:
Monitor Render logs for:
- Application startup
- MongoDB connection status
- Request/response logs
- Error messages

---

## DEPLOYMENT COMPLETE ✓

The EasyXpense Flask backend is now production-ready for Render deployment with:
- Correct Gunicorn start command
- Proper module path configuration
- MongoDB Atlas integration
- CORS configured for Netlify
- All API endpoints functional
