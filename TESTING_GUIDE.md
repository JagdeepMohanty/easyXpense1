# EasyXpense - Phase 2 Testing Guide

## Prerequisites

1. MongoDB running on `mongodb://localhost:27017`
2. Backend server running on `http://localhost:5000`
3. Frontend server running on `http://localhost:3000`

## Start the Application

### Terminal 1 - Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

## Test Scenarios

### Test 1: Health Check (Phase 1 Verification)

**Purpose:** Verify Phase 1 functionality still works

**Steps:**
1. Open browser: `http://localhost:3000`
2. Verify page shows "EasyXpense" title
3. Verify "Backend Status: EasyXpense API running" is displayed

**Expected Result:** ✓ Phase 1 health check works

---

### Test 2: User Registration

**Purpose:** Test new user signup

**Steps:**
1. On home page, click "Sign Up" button
2. Fill in the form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Sign Up" button
4. Wait for success message

**Expected Result:**
- ✓ Success message: "Registration successful! Redirecting to login..."
- ✓ Automatic redirect to login page after 2 seconds

**Backend Verification:**
```bash
# Check MongoDB
mongosh
use easyxpense
db.users.find({email: "test@example.com"})
```

---

### Test 3: Duplicate Email Registration

**Purpose:** Test email uniqueness validation

**Steps:**
1. Try to register again with same email: `test@example.com`
2. Click "Sign Up"

**Expected Result:**
- ✓ Error message: "Email already exists"
- ✓ User stays on signup page

---

### Test 4: User Login

**Purpose:** Test user authentication

**Steps:**
1. Navigate to login page: `http://localhost:3000/login`
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Login" button

**Expected Result:**
- ✓ Redirect to home page
- ✓ Home page shows: "Welcome, Test User!"
- ✓ User email displayed
- ✓ "Logout" button visible

**Browser Storage Check:**
```javascript
// Open browser console
localStorage.getItem('easyxpense_token')
// Should return JWT token string
```

---

### Test 5: Invalid Login

**Purpose:** Test authentication failure

**Steps:**
1. Logout if logged in
2. Try to login with wrong password:
   - Email: `test@example.com`
   - Password: `wrongpassword`
3. Click "Login"

**Expected Result:**
- ✓ Error message: "Invalid email or password"
- ✓ User stays on login page

---

### Test 6: Protected Route Access

**Purpose:** Test JWT token validation

**Steps:**
1. Login successfully
2. Open browser console
3. Check network tab for `/api/auth/me` request
4. Verify Authorization header is present

**Expected Result:**
- ✓ Request includes: `Authorization: Bearer <token>`
- ✓ Response returns user data
- ✓ Status code: 200

---

### Test 7: Logout Functionality

**Purpose:** Test token removal

**Steps:**
1. While logged in, click "Logout" button
2. Check home page content

**Expected Result:**
- ✓ "Welcome" card disappears
- ✓ "Login" and "Sign Up" buttons appear
- ✓ Token removed from localStorage

**Browser Console Check:**
```javascript
localStorage.getItem('easyxpense_token')
// Should return null
```

---

### Test 8: Token Persistence

**Purpose:** Test if user stays logged in after page refresh

**Steps:**
1. Login successfully
2. Refresh the page (F5)
3. Wait for page to load

**Expected Result:**
- ✓ User still logged in
- ✓ "Welcome, Test User!" still displayed
- ✓ No redirect to login page

---

### Test 9: Manual Token Removal

**Purpose:** Test behavior when token is invalid

**Steps:**
1. Login successfully
2. Open browser console
3. Run: `localStorage.removeItem('easyxpense_token')`
4. Refresh the page

**Expected Result:**
- ✓ User logged out
- ✓ Login/Signup buttons appear
- ✓ No error messages

---

### Test 10: Direct Route Access

**Purpose:** Test routing without authentication

**Steps:**
1. Logout completely
2. Navigate to: `http://localhost:3000/login`
3. Navigate to: `http://localhost:3000/signup`
4. Navigate to: `http://localhost:3000/`

**Expected Result:**
- ✓ All routes accessible
- ✓ No crashes or errors
- ✓ Proper page content displayed

---

## API Testing with cURL

### Test Registration API
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"API Test User","email":"apitest@example.com","password":"test123"}'
```

**Expected Response:**
```json
{"message": "User registered successfully"}
```

---

### Test Login API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"apitest@example.com","password":"test123"}'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "API Test User",
    "email": "apitest@example.com"
  }
}
```

---

### Test Protected Route
```bash
# Replace YOUR_TOKEN with actual token from login response
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "id": "...",
  "name": "API Test User",
  "email": "apitest@example.com"
}
```

---

### Test Invalid Token
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected Response:**
```json
{"message": "Invalid token"}
```

---

## UI/UX Testing

### Form Validation
- ✓ Empty fields show browser validation
- ✓ Email format validated
- ✓ Password field masked

### Button States
- ✓ Buttons have hover effects
- ✓ Primary button is green
- ✓ Secondary button is gray

### Card Animations
- ✓ Cards lift on hover
- ✓ Smooth transitions
- ✓ Glow effect on hover

### Responsive Design
- ✓ Forms centered on page
- ✓ Cards have minimum width
- ✓ Text readable on all screens

---

## Database Verification

### Check Users Collection
```javascript
mongosh
use easyxpense
db.users.find().pretty()
```

**Expected Output:**
```javascript
{
  _id: ObjectId("..."),
  name: "Test User",
  email: "test@example.com",
  password: "$2b$12$...", // Hashed password
  created_at: ISODate("2024-01-15T10:30:00Z")
}
```

### Verify Email Index
```javascript
db.users.getIndexes()
```

**Expected Output:**
```javascript
[
  { v: 2, key: { _id: 1 }, name: "_id_" },
  { v: 2, key: { email: 1 }, name: "email_1", unique: true }
]
```

---

## Common Issues & Solutions

### Issue: "Email already exists"
**Solution:** Use a different email or delete the user from MongoDB:
```javascript
db.users.deleteOne({email: "test@example.com"})
```

### Issue: "Token is missing"
**Solution:** Login again to get a new token

### Issue: "Invalid token"
**Solution:** Token may be expired (24h), login again

### Issue: CORS error
**Solution:** Ensure backend is running and CORS is enabled

### Issue: MongoDB connection error
**Solution:** Start MongoDB service:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

---

## Test Checklist

### Backend Tests
- [ ] Health check endpoint works
- [ ] User registration creates user in DB
- [ ] Password is hashed (not plain text)
- [ ] Duplicate email returns error
- [ ] Login returns JWT token
- [ ] Invalid credentials return error
- [ ] Protected route requires token
- [ ] Invalid token returns 401
- [ ] Token expiry works (after 24h)

### Frontend Tests
- [ ] Home page loads
- [ ] Signup page accessible
- [ ] Login page accessible
- [ ] Registration form submits
- [ ] Login form submits
- [ ] Token stored in localStorage
- [ ] Token sent with API requests
- [ ] User info displayed after login
- [ ] Logout removes token
- [ ] Page refresh maintains login

### Integration Tests
- [ ] Frontend → Backend communication works
- [ ] Backend → MongoDB communication works
- [ ] JWT flow works end-to-end
- [ ] Error messages display correctly
- [ ] Success messages display correctly
- [ ] Redirects work properly

---

## Performance Testing

### Token Size
```javascript
// Check token size in browser console
const token = localStorage.getItem('easyxpense_token');
console.log('Token length:', token.length);
// Should be around 150-200 characters
```

### API Response Time
- Registration: < 500ms
- Login: < 300ms
- Get user: < 100ms

---

## Security Testing

### Password Hashing
```javascript
// In MongoDB, verify password is hashed
db.users.findOne({email: "test@example.com"}).password
// Should start with "$2b$12$" (bcrypt hash)
```

### JWT Token
```javascript
// Decode token (use jwt.io)
// Should contain: user_id, email, exp
// Should NOT contain: password
```

### Protected Routes
- Try accessing `/api/auth/me` without token → 401
- Try with invalid token → 401
- Try with expired token → 401

---

## Phase 2 Testing Complete ✓

All tests passing means:
- ✓ Authentication system fully functional
- ✓ Security measures in place
- ✓ UI/UX working as expected
- ✓ Phase 1 features still working
- ✓ Ready for Phase 3 development
