# EasyXpense - Phase 2 Authentication System

Complete authentication system with user registration, login, and JWT-based protected routes.

## What's New in Phase 2

### Backend Features ✓
- User registration with bcrypt password hashing
- User login with JWT token generation
- Protected routes middleware
- User authentication endpoints
- MongoDB user collection with unique email index

### Frontend Features ✓
- Login page with form validation
- Signup page with success feedback
- JWT token storage in localStorage
- Automatic token attachment to API requests
- Protected user dashboard
- Logout functionality

## Updated Project Structure

```
easyxpense/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   └── jwt_config.py
│   │
│   ├── routes/
│   │   ├── health.py
│   │   └── auth.py          ← NEW
│   │
│   ├── models/
│   │   └── user_model.py    ← UPDATED
│   │
│   ├── middleware/
│   │   └── auth_middleware.py  ← NEW
│   │
│   ├── config/
│   │   └── config.py
│   │
│   ├── app.py               ← UPDATED
│   ├── requirements.txt     ← UPDATED
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx     ← UPDATED
    │   │   ├── Login.jsx    ← NEW
    │   │   └── Signup.jsx   ← NEW
    │   │
    │   ├── components/
    │   │   └── Card.jsx
    │   │
    │   ├── services/
    │   │   └── api.js       ← UPDATED
    │   │
    │   ├── App.jsx          ← UPDATED
    │   ├── main.jsx
    │   └── styles.css       ← UPDATED
    │
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## API Endpoints

### Authentication Endpoints

#### 1. Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@email.com",
  "password": "123456"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully"
}
```

**Error Response (400):**
```json
{
  "message": "Email already exists"
}
```

---

#### 2. Login User
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@email.com",
  "password": "123456"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@email.com"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid email or password"
}
```

---

#### 3. Get Current User (Protected)
```
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@email.com"
}
```

**Error Response (401):**
```json
{
  "message": "Token is missing"
}
```

---

### Health Check (Phase 1)
```
GET /api/health
```

**Response:**
```json
{
  "status": "EasyXpense API running"
}
```

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Doe",
  email: "john@email.com",
  password: "$2b$12$hashed_password_here",
  created_at: ISODate("2024-01-15T10:30:00Z")
}
```

**Indexes:**
- `email` (unique)

## Setup & Installation

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**New dependency added:**
- bcrypt==4.1.2

### 2. Start Backend Server

```bash
python app.py
```

Backend runs on: **http://localhost:5000**

### 3. Start Frontend Server

```bash
cd frontend
npm run dev
```

Frontend runs on: **http://localhost:3000**

## Testing the Authentication System

### Test Flow 1: User Registration

1. Navigate to `http://localhost:3000`
2. Click "Sign Up" button
3. Fill in the form:
   - Name: John Doe
   - Email: john@email.com
   - Password: 123456
4. Click "Sign Up"
5. You'll see success message and redirect to login

### Test Flow 2: User Login

1. On login page, enter:
   - Email: john@email.com
   - Password: 123456
2. Click "Login"
3. You'll be redirected to home page
4. Home page now shows: "Welcome, John Doe!"

### Test Flow 3: Protected Route

1. After login, the home page calls `/api/auth/me`
2. Your user info is displayed
3. JWT token is automatically sent with the request

### Test Flow 4: Logout

1. Click "Logout" button on home page
2. Token is removed from localStorage
3. Page shows login/signup buttons again

## Frontend Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home.jsx | Main dashboard (shows user info if logged in) |
| `/login` | Login.jsx | User login form |
| `/signup` | Signup.jsx | User registration form |

## JWT Token Management

### Token Storage
- Stored in: `localStorage`
- Key: `easyxpense_token`
- Expiry: 24 hours

### Token Usage
- Automatically attached to all API requests via Axios interceptor
- Format: `Authorization: Bearer <token>`

### Token Validation
- Backend middleware validates token on protected routes
- Invalid/expired tokens return 401 error
- Frontend removes invalid tokens and shows login

## Security Features

✓ Password hashing with bcrypt (salt rounds: 12)
✓ JWT token with expiration (24 hours)
✓ Protected routes middleware
✓ Unique email constraint
✓ Token validation on every protected request
✓ Automatic token cleanup on invalid auth

## UI Components

### Form Styles
- Dark theme inputs with focus states
- Error/success message display
- Hover animations on buttons
- Responsive form layout

### Button Styles
- Primary: Green (#10B981)
- Secondary: Gray (#334155)
- Hover effects with lift animation

### Card Component
- Reusable across all pages
- Consistent padding and border radius
- Hover glow effect

## Phase 1 Compatibility

✓ All Phase 1 features remain functional
✓ Health check endpoint still works
✓ Original home page enhanced (not replaced)
✓ No breaking changes to existing code

## Technology Stack

### Backend (Updated)
- Flask 3.0.0
- Flask-CORS 4.0.0
- PyMongo 4.6.1
- PyJWT 2.8.0
- Python-dotenv 1.0.0
- **bcrypt 4.1.2** ← NEW

### Frontend (Same)
- React 18.2.0
- Vite 5.0.8
- React Router DOM 6.20.0
- Axios 1.6.2

## Troubleshooting

### Issue: "Email already exists"
**Solution:** Use a different email or check MongoDB for existing users

### Issue: "Invalid email or password"
**Solution:** Verify credentials or register a new account

### Issue: "Token is missing"
**Solution:** Login again to get a new token

### Issue: "Token has expired"
**Solution:** Token expires after 24 hours, login again

### Issue: MongoDB connection error
**Solution:** Ensure MongoDB is running on `mongodb://localhost:27017`

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@email.com","password":"123456"}'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@email.com","password":"123456"}'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Next Steps (Phase 3)

Potential features for future phases:
- Expense tracking functionality
- User profile management
- Password reset
- Email verification
- Refresh tokens
- Role-based access control

## Phase 2 Complete ✓

- ✓ User registration with validation
- ✓ User login with JWT tokens
- ✓ Password hashing with bcrypt
- ✓ Protected routes middleware
- ✓ Token-based authentication
- ✓ Login/Signup UI pages
- ✓ User dashboard with logout
- ✓ Automatic token management
- ✓ Error handling and validation
- ✓ Phase 1 features preserved
