# EasyXpense - Developer Quick Reference

## 🚀 Quick Start

```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
python app.py

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

---

## 📁 Project Structure

```
backend/
├── app/              # Core app modules
├── routes/           # API endpoints
├── models/           # Database models
├── middleware/       # Auth middleware
└── config/           # Configuration

frontend/
├── pages/            # Route pages
├── components/       # Reusable UI
└── services/         # API client
```

---

## 🔌 API Endpoints

### Public Routes
```
GET  /api/health              # Health check
POST /api/auth/register       # User signup
POST /api/auth/login          # User login
```

### Protected Routes
```
GET  /api/auth/me             # Get current user
```

**Auth Header:**
```
Authorization: Bearer <token>
```

---

## 💾 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  created_at: Date
}
```

---

## 🔐 Authentication Flow

### Registration
```
User → POST /auth/register → Hash Password → Save to DB → Success
```

### Login
```
User → POST /auth/login → Verify Password → Generate JWT → Return Token
```

### Protected Access
```
User → Request + Token → Verify JWT → Allow Access → Return Data
```

---

## 🎨 Color Theme

```css
Background:    #020617
Card:          #0F172A
Primary:       #10B981
Accent:        #34D399
Text:          #E2E8F0
Secondary:     #94A3B8
```

---

## 📦 Dependencies

### Backend
- Flask 3.0.0
- flask-cors 4.0.0
- pymongo 4.6.1
- PyJWT 2.8.0
- bcrypt 4.1.2
- python-dotenv 1.0.0

### Frontend
- React 18.2.0
- Vite 5.0.8
- React Router 6.20.0
- Axios 1.6.2

---

## 🛠️ Common Commands

### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python app.py

# Run with specific port
PORT=8000 python app.py
```

### Frontend
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### MongoDB
```bash
# Start MongoDB
mongosh

# Use database
use easyxpense

# View users
db.users.find().pretty()

# Delete user
db.users.deleteOne({email: "user@example.com"})

# Clear all users
db.users.deleteMany({})
```

---

## 🔑 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/easyxpense
JWT_SECRET=supersecretkey
PORT=5000
```

---

## 🧪 Testing

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### Test Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify .env file exists
- Check port 5000 is available

### Frontend won't start
- Run `npm install`
- Check port 3000 is available
- Clear node_modules and reinstall

### CORS errors
- Ensure backend is running first
- Check CORS is enabled in app.py
- Verify API baseURL in api.js

### Authentication fails
- Check token in localStorage
- Verify JWT_SECRET matches
- Check token hasn't expired (24h)

### Database errors
- Start MongoDB service
- Check MONGO_URI in .env
- Verify database name is correct

---

## 📝 Code Snippets

### Create New Route (Backend)
```python
# routes/example.py
from flask import Blueprint, jsonify
from middleware.auth_middleware import token_required

example_bp = Blueprint('example', __name__)

@example_bp.route('/data', methods=['GET'])
@token_required
def get_data(current_user):
    return jsonify({'message': 'Protected data'}), 200
```

### Register Route in app.py
```python
from routes.example import example_bp
app.register_blueprint(example_bp, url_prefix='/api/example')
```

### Create New Page (Frontend)
```jsx
// pages/NewPage.jsx
import Card from '../components/Card';

const NewPage = () => {
  return (
    <div className="container">
      <h1 className="title">New Page</h1>
      <Card>
        <h2 className="card-title">Content</h2>
        <p className="card-text">Your content here</p>
      </Card>
    </div>
  );
};

export default NewPage;
```

### Add Route in App.jsx
```jsx
import NewPage from './pages/NewPage';

<Route path="/new" element={<NewPage />} />
```

### Make API Call
```javascript
// In any component
import api from '../services/api';

const fetchData = async () => {
  try {
    const response = await api.get('/endpoint');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
```

---

## 🔒 Security Best Practices

✓ Passwords hashed with bcrypt
✓ JWT tokens expire after 24 hours
✓ Protected routes require authentication
✓ Email uniqueness enforced
✓ CORS properly configured
✓ Environment variables for secrets

---

## 📚 Documentation Files

- `README.md` - Main documentation
- `PHASE2_AUTH.md` - Authentication details
- `TESTING_GUIDE.md` - Testing procedures
- `QUICKSTART.md` - Quick start guide
- `DEV_REFERENCE.md` - This file

---

## 🎯 Next Steps

### Phase 3 Ideas
- Expense CRUD operations
- Categories management
- Budget tracking
- Reports and analytics
- Export functionality
- Profile management

---

## 💡 Tips

- Always start backend before frontend
- Check browser console for errors
- Use MongoDB Compass for DB visualization
- Test API with Postman or cURL
- Keep token in localStorage for persistence
- Use React DevTools for debugging

---

## 🆘 Support

### Check Logs
- Backend: Terminal output
- Frontend: Browser console
- MongoDB: mongod.log

### Common Error Codes
- 400: Bad Request (validation error)
- 401: Unauthorized (auth error)
- 404: Not Found (wrong endpoint)
- 500: Server Error (backend issue)

---

## ✅ Phase 2 Complete

- [x] User registration
- [x] User login
- [x] JWT authentication
- [x] Protected routes
- [x] Token management
- [x] Login/Signup UI
- [x] User dashboard
- [x] Logout functionality

**Ready for Phase 3!** 🚀
