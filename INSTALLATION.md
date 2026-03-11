# 🚀 EasyXpense - Installation & Run Guide

## Prerequisites Check

Before starting, ensure you have:

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] MongoDB installed and running
- [ ] Git (optional, for version control)

### Verify Installations

```bash
# Check Python
python --version

# Check Node.js
node --version

# Check npm
npm --version

# Check MongoDB
mongosh --version
```

---

## 📥 Installation Steps

### Step 1: Start MongoDB

**Windows:**
```bash
net start MongoDB
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**Verify MongoDB is running:**
```bash
mongosh
# Should connect successfully
```

---

### Step 2: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed Flask-3.0.0 flask-cors-4.0.0 pymongo-4.6.1 PyJWT-2.8.0 bcrypt-4.1.2 python-dotenv-1.0.0
```

---

### Step 3: Verify Backend Environment

Check that `.env` file exists in `backend/` folder:

```bash
# Should contain:
MONGO_URI=mongodb://localhost:27017/easyxpense
JWT_SECRET=supersecretkey
PORT=5000
```

---

### Step 4: Install Frontend Dependencies

```bash
cd frontend
npm install
```

**Expected output:**
```
added 200+ packages
```

---

## ▶️ Running the Application

### Option 1: Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Expected output:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

### Option 2: Background Processes

**Windows (PowerShell):**
```powershell
# Start backend in background
Start-Process python -ArgumentList "app.py" -WorkingDirectory "backend"

# Start frontend in background
Start-Process npm -ArgumentList "run dev" -WorkingDirectory "frontend"
```

**macOS/Linux:**
```bash
# Start backend in background
cd backend && python app.py &

# Start frontend in background
cd frontend && npm run dev &
```

---

## 🌐 Access the Application

Once both servers are running:

1. **Open your browser**
2. **Navigate to:** `http://localhost:3000`
3. **You should see:** EasyXpense title and backend status

---

## ✅ Verification Steps

### 1. Check Backend Health

**Browser:** Navigate to `http://localhost:5000/api/health`

**Expected response:**
```json
{"status": "EasyXpense API running"}
```

**Or use cURL:**
```bash
curl http://localhost:5000/api/health
```

---

### 2. Check Frontend

**Browser:** Navigate to `http://localhost:3000`

**You should see:**
- ✓ "EasyXpense" title in green
- ✓ "Backend Status: EasyXpense API running" card
- ✓ "Login" and "Sign Up" buttons

---

### 3. Test Registration

1. Click "Sign Up"
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Sign Up"
4. Should see success message and redirect to login

---

### 4. Test Login

1. On login page, enter:
   - Email: test@example.com
   - Password: password123
2. Click "Login"
3. Should redirect to home page
4. Should see "Welcome, Test User!"

---

## 🛑 Stopping the Application

### Stop Backend
- Press `Ctrl + C` in backend terminal

### Stop Frontend
- Press `Ctrl + C` in frontend terminal

### Stop MongoDB (Optional)
```bash
# Windows
net stop MongoDB

# macOS/Linux
sudo systemctl stop mongod
```

---

## 🔄 Restart Instructions

### Quick Restart

**Backend:**
```bash
cd backend
python app.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

No need to reinstall dependencies unless you update them.

---

## 🐛 Troubleshooting

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

**Or change port in `.env`:**
```
PORT=8000
```

---

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**Or change port in `vite.config.js`:**
```javascript
server: {
  port: 3001
}
```

---

### Issue: "MongoDB connection failed"

**Check if MongoDB is running:**
```bash
mongosh
```

**If not running, start it:**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

---

### Issue: "Module not found" (Backend)

**Solution:**
```bash
cd backend
pip install -r requirements.txt --force-reinstall
```

---

### Issue: "Module not found" (Frontend)

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: CORS Error

**Check:**
1. Backend is running
2. Backend URL in `frontend/src/services/api.js` is correct:
   ```javascript
   baseURL: 'http://localhost:5000/api'
   ```

---

### Issue: "Invalid token" or "Token expired"

**Solution:**
1. Open browser console
2. Run: `localStorage.removeItem('easyxpense_token')`
3. Login again

---

## 📊 System Status Check

### Check All Services

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check if frontend is running
curl http://localhost:3000

# Check MongoDB
mongosh --eval "db.adminCommand('ping')"
```

**All should return successful responses.**

---

## 🔧 Development Mode

### Backend with Auto-reload

Flask debug mode is enabled by default in `app.py`:
```python
app.run(debug=True, port=Config.PORT)
```

Changes to Python files will auto-reload the server.

### Frontend with Hot Reload

Vite has hot module replacement (HMR) enabled by default.

Changes to React files will auto-update in browser.

---

## 📦 Production Build

### Build Frontend for Production

```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/`

### Preview Production Build

```bash
npm run preview
```

---

## 🗄️ Database Management

### View Database

```bash
mongosh
use easyxpense
db.users.find().pretty()
```

### Clear Database

```bash
mongosh
use easyxpense
db.users.deleteMany({})
```

### Backup Database

```bash
mongodump --db easyxpense --out ./backup
```

### Restore Database

```bash
mongorestore --db easyxpense ./backup/easyxpense
```

---

## 📝 Environment Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
# MongoDB connection
MONGO_URI=mongodb://localhost:27017/easyxpense

# JWT secret (change in production!)
JWT_SECRET=your_super_secret_key_here

# Server port
PORT=5000
```

### Frontend API Configuration

Edit `frontend/src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000/api'  // Change for production
});
```

---

## 🎯 Quick Commands Reference

```bash
# Start everything
cd backend && python app.py &
cd frontend && npm run dev &

# Stop everything
# Press Ctrl+C in both terminals

# Reinstall backend
cd backend && pip install -r requirements.txt

# Reinstall frontend
cd frontend && npm install

# Clear database
mongosh easyxpense --eval "db.users.deleteMany({})"

# Check logs
# Backend: Terminal output
# Frontend: Browser console (F12)
```

---

## ✅ Installation Complete!

You should now have:

- [x] Backend running on http://localhost:5000
- [x] Frontend running on http://localhost:3000
- [x] MongoDB running on mongodb://localhost:27017
- [x] Able to register users
- [x] Able to login users
- [x] Able to view user dashboard

---

## 📚 Next Steps

1. **Read Documentation:**
   - `README.md` - Project overview
   - `PHASE2_AUTH.md` - Authentication details
   - `TESTING_GUIDE.md` - Testing procedures

2. **Test Features:**
   - Register a new user
   - Login with credentials
   - View user dashboard
   - Test logout

3. **Explore Code:**
   - Backend routes in `backend/routes/`
   - Frontend pages in `frontend/src/pages/`
   - API client in `frontend/src/services/api.js`

---

## 🆘 Need Help?

### Check Documentation
- `DEV_REFERENCE.md` - Developer quick reference
- `TESTING_GUIDE.md` - Comprehensive testing guide
- `PHASE2_SUMMARY.md` - Implementation summary

### Common Issues
- Port conflicts → Change ports in config
- MongoDB not running → Start MongoDB service
- Dependencies missing → Reinstall packages
- CORS errors → Check backend is running first

---

## 🎉 Ready to Code!

Your EasyXpense application is now running with:
- ✅ Full authentication system
- ✅ User registration and login
- ✅ JWT token management
- ✅ Protected routes
- ✅ Beautiful dark theme UI

**Happy coding!** 🚀
