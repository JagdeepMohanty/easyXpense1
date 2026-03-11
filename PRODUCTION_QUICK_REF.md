# EasyXpense - Production Quick Reference

## 🌐 Production URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://easyxpense.netlify.app |
| **Backend API** | https://easyxpense.onrender.com |
| **API Base** | https://easyxpense.onrender.com/api |

---

## 🔑 Environment Variables

### Backend (Render)

```env
MONGO_URI=mongodb+srv://easyXpense:jagdeep2607@easyxpense.pziespr.mongodb.net/easyxpense?retryWrites=true&w=majority&appName=EasyXpense
JWT_SECRET=9f7a41a6e23b5d890cf45a1c3d9e8f7a
PORT=10000
```

### Frontend (Netlify)

```env
VITE_API_URL=https://easyxpense.onrender.com/api
```

---

## 📡 API Endpoints

All endpoints prefixed with `/api/`

### Health
```
GET /api/health
```

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Friends
```
POST /api/friends/request
POST /api/friends/accept
GET  /api/friends
GET  /api/friends/requests/pending
```

### Groups
```
POST /api/groups
GET  /api/groups
GET  /api/groups/:id
POST /api/groups/:id/members
```

### Expenses
```
POST /api/expenses
GET  /api/expenses
GET  /api/expenses/groups/:id
```

### Debts
```
GET /api/debts
GET /api/debts/groups/:id
```

### Settlements
```
POST /api/settlements
GET  /api/settlements
GET  /api/settlements/groups/:id
```

### Analytics
```
GET /api/analytics
```

---

## 🧪 Quick Tests

### Health Check
```bash
curl https://easyxpense.onrender.com/api/health
```

### Register User
```bash
curl -X POST https://easyxpense.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

### Login
```bash
curl -X POST https://easyxpense.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

---

## 🗄️ Database

**Provider**: MongoDB Atlas

**Connection String**:
```
mongodb+srv://easyXpense:jagdeep2607@easyxpense.pziespr.mongodb.net/easyxpense?retryWrites=true&w=majority&appName=EasyXpense
```

**Database Name**: `easyxpense`

**Collections**:
- users
- friend_requests
- friends
- groups
- expenses
- settlements

---

## 🚀 Deployment Commands

### Backend (Render)

**Build**: `pip install -r requirements.txt`

**Start**: `gunicorn app:app`

### Frontend (Netlify)

**Build**: `npm run build`

**Publish**: `dist`

---

## 🔧 Configuration Files

### Backend

- `backend/.env` - Environment variables
- `backend/app.py` - CORS configuration
- `backend/requirements.txt` - Dependencies

### Frontend

- `frontend/.env` - Environment variables
- `frontend/netlify.toml` - Netlify configuration
- `frontend/src/services/api.js` - API client

---

## 📊 Monitoring

### Render Dashboard
https://dashboard.render.com

### Netlify Dashboard
https://app.netlify.com

### MongoDB Atlas
https://cloud.mongodb.com

---

## 🆘 Troubleshooting

### CORS Error
- Check backend CORS configuration
- Verify Netlify URL in allowed origins

### MongoDB Connection Error
- Check MONGO_URI in Render
- Verify network access (0.0.0.0/0)

### JWT Error
- Check JWT_SECRET in Render
- Clear browser localStorage

### API Not Found
- Verify VITE_API_URL in Netlify
- Check backend is running

---

## 📞 Support

**Documentation**: See PRODUCTION_CONFIG.md

**Deployment Guide**: See DEPLOYMENT_CHECKLIST.md

**Full Deployment**: See DEPLOYMENT.md

---

## ✅ Status

- **Backend**: ✅ Deployed
- **Frontend**: ✅ Deployed
- **Database**: ✅ Connected
- **Authentication**: ✅ Working
- **All Features**: ✅ Operational

**Production Ready!** 🎉
