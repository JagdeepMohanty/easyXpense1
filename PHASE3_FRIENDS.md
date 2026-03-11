# EasyXpense - Phase 3 Friends System

Complete friends system allowing users to send friend requests, accept requests, and view their friends list.

## What's New in Phase 3

### Backend Features ✓
- Send friend requests by email
- Accept friend requests
- View friends list
- View pending friend requests
- Prevent duplicate requests
- Prevent self-friending
- All routes protected with JWT authentication

### Frontend Features ✓
- Friends page with three sections
- Add friend by email form
- Pending requests list with accept button
- Friends list display
- Navigation from home page
- Real-time updates after actions

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
│   │   ├── auth.py
│   │   └── friends.py          ← NEW
│   │
│   ├── models/
│   │   ├── user_model.py
│   │   └── friend_model.py     ← NEW
│   │
│   ├── middleware/
│   │   └── auth_middleware.py
│   │
│   ├── config/
│   │   └── config.py
│   │
│   ├── app.py                  ← UPDATED
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx        ← UPDATED
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Friends.jsx     ← NEW
    │   │
    │   ├── components/
    │   │   └── Card.jsx
    │   │
    │   ├── services/
    │   │   └── api.js
    │   │
    │   ├── App.jsx             ← UPDATED
    │   ├── main.jsx
    │   └── styles.css          ← UPDATED
    │
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Database Schema

### Friend Requests Collection

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  sender_id: ObjectId("507f1f77bcf86cd799439012"),
  receiver_id: ObjectId("507f1f77bcf86cd799439013"),
  status: "pending",  // or "accepted"
  created_at: ISODate("2024-01-15T10:30:00Z")
}
```

### Friends Collection

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439014"),
  user1_id: ObjectId("507f1f77bcf86cd799439012"),
  user2_id: ObjectId("507f1f77bcf86cd799439013"),
  created_at: ISODate("2024-01-15T10:35:00Z")
}
```

## API Endpoints

### Friends Endpoints (All Protected)

#### 1. Send Friend Request
```
POST /api/friends/request
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "friend@email.com"
}
```

**Success Response (201):**
```json
{
  "message": "Friend request sent"
}
```

**Error Responses:**
```json
// User not found
{
  "message": "User not found"
}

// Cannot friend yourself
{
  "message": "Cannot send friend request to yourself"
}

// Already friends
{
  "message": "Already friends"
}

// Duplicate request
{
  "message": "Friend request already sent"
}
```

---

#### 2. Accept Friend Request
```
POST /api/friends/accept
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "request_id": "507f1f77bcf86cd799439011"
}
```

**Success Response (200):**
```json
{
  "message": "Friend request accepted"
}
```

**Error Responses:**
```json
// Request not found
{
  "message": "Friend request not found"
}

// Not authorized
{
  "message": "Unauthorized"
}

// Already processed
{
  "message": "Request already processed"
}
```

---

#### 3. Get Friends List
```
GET /api/friends
```

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@email.com"
  },
  {
    "id": "507f1f77bcf86cd799439013",
    "name": "Jane Smith",
    "email": "jane@email.com"
  }
]
```

---

#### 4. Get Pending Requests
```
GET /api/friends/requests/pending
```

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "request_id": "507f1f77bcf86cd799439011",
    "sender_id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@email.com"
  }
]
```

---

## Frontend Implementation

### Friends Page Features

#### 1. Add Friend Section
- Email input field
- Send Request button
- Success/error message display
- Form validation

#### 2. Pending Requests Section
- Shows incoming friend requests
- Displays sender name and email
- Accept button for each request
- Auto-refresh after accepting

#### 3. Friends List Section
- Displays all friends
- Shows friend name and email
- Empty state message
- Friend count display

### Navigation
- "Friends" button on home page (when logged in)
- "Back to Home" button on friends page
- Automatic redirect to login if not authenticated

## Setup & Installation

No additional dependencies required. The friends system uses existing packages.

### Run the Application

```bash
# Backend
cd backend
python app.py

# Frontend
cd frontend
npm run dev
```

## Testing the Friends System

### Test Scenario 1: Send Friend Request

**Setup:**
1. Create two user accounts:
   - User A: alice@email.com
   - User B: bob@email.com

**Steps:**
1. Login as User A
2. Click "Friends" button
3. Enter bob@email.com in the email field
4. Click "Send Request"
5. Should see success message: "Friend request sent"

---

### Test Scenario 2: Accept Friend Request

**Steps:**
1. Logout from User A
2. Login as User B
3. Click "Friends" button
4. See pending request from Alice
5. Click "Accept" button
6. Should see success message: "Friend request accepted!"
7. Alice should now appear in "Your Friends" list

---

### Test Scenario 3: View Friends List

**Steps:**
1. As User B, check "Your Friends" section
2. Should see Alice in the list
3. Logout and login as User A
4. Click "Friends" button
5. Should see Bob in "Your Friends" list

---

### Test Scenario 4: Duplicate Request Prevention

**Steps:**
1. As User A, try to send another request to Bob
2. Should see error: "Already friends"

---

### Test Scenario 5: Self-Friend Prevention

**Steps:**
1. As User A, try to send request to alice@email.com
2. Should see error: "Cannot send friend request to yourself"

---

### Test Scenario 6: Non-existent User

**Steps:**
1. Try to send request to nonexistent@email.com
2. Should see error: "User not found"

---

## UI Components

### Friends Page Layout

```
┌─────────────────────────────────────┐
│          EasyXpense                 │
│                                     │
│  [Back to Home]                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Add Friend                    │ │
│  │ Email: [____________]         │ │
│  │ [Send Request]                │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Pending Requests (2)          │ │
│  │ ┌─────────────────────────┐   │ │
│  │ │ John Doe                │   │ │
│  │ │ john@email.com [Accept] │   │ │
│  │ └─────────────────────────┘   │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Your Friends (3)              │ │
│  │ ┌─────────────────────────┐   │ │
│  │ │ Jane Smith              │   │ │
│  │ │ jane@email.com          │   │ │
│  │ └─────────────────────────┘   │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Styling
- Same dark theme as Phase 1 & 2
- Card-based layout
- Hover effects on friend items
- Green primary buttons
- Gray secondary buttons

## Backend Logic

### Friend Request Flow

```
User A sends request to User B
    ↓
Check if User B exists
    ↓
Check if already friends
    ↓
Check if request already sent
    ↓
Create friend_request document
    ↓
Status: "pending"
```

### Accept Request Flow

```
User B accepts request
    ↓
Verify request exists
    ↓
Verify User B is receiver
    ↓
Update request status to "accepted"
    ↓
Create friendship document
    ↓
Both users are now friends
```

### Get Friends Flow

```
User requests friends list
    ↓
Find all friendships where user1_id or user2_id = user
    ↓
Extract friend IDs
    ↓
Fetch user details for each friend
    ↓
Return friends list
```

## Security Features

✓ All routes protected with JWT authentication
✓ Users can only accept requests sent to them
✓ Prevents duplicate friend requests
✓ Prevents self-friending
✓ Validates user existence before creating request
✓ Checks friendship status before allowing request

## Error Handling

### Backend Validation
- Email required for sending request
- Request ID required for accepting
- User existence validation
- Friendship status validation
- Request ownership validation

### Frontend Validation
- Email format validation
- Empty field prevention
- Error message display
- Success feedback
- Loading states

## Database Queries

### Check if Users are Friends
```javascript
db.friends.findOne({
  $or: [
    { user1_id: ObjectId(userA), user2_id: ObjectId(userB) },
    { user1_id: ObjectId(userB), user2_id: ObjectId(userA) }
  ]
})
```

### Get User's Friends
```javascript
db.friends.find({
  $or: [
    { user1_id: ObjectId(userId) },
    { user2_id: ObjectId(userId) }
  ]
})
```

### Get Pending Requests
```javascript
db.friend_requests.find({
  receiver_id: ObjectId(userId),
  status: "pending"
})
```

## Phase 1 & 2 Compatibility

✓ All authentication features work
✓ Health check endpoint functional
✓ Login/Signup pages unchanged
✓ User dashboard enhanced (not broken)
✓ JWT token management intact
✓ No breaking changes

## Technology Stack

Same as Phase 2:
- Flask 3.0.0
- PyMongo 4.6.1
- React 18.2.0
- Axios 1.6.2

No new dependencies added!

## Troubleshooting

### Issue: "User not found"
**Solution:** Verify the email address is correct and user is registered

### Issue: "Already friends"
**Solution:** Users are already friends, check friends list

### Issue: "Friend request already sent"
**Solution:** Wait for the other user to accept the pending request

### Issue: Pending requests not showing
**Solution:** Refresh the page or check if logged in as correct user

### Issue: Friends page redirects to login
**Solution:** Token may be expired, login again

## Testing with cURL

### Send Friend Request
```bash
curl -X POST http://localhost:5000/api/friends/request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"friend@email.com"}'
```

### Accept Friend Request
```bash
curl -X POST http://localhost:5000/api/friends/accept \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"request_id":"REQUEST_ID_HERE"}'
```

### Get Friends List
```bash
curl -X GET http://localhost:5000/api/friends \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Pending Requests
```bash
curl -X GET http://localhost:5000/api/friends/requests/pending \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Next Steps (Phase 4)

Potential features:
- Reject friend requests
- Remove friends
- Search friends
- Friend suggestions
- Shared expenses with friends
- Friend activity feed

## Phase 3 Complete ✓

- ✓ Send friend requests by email
- ✓ Accept friend requests
- ✓ View friends list
- ✓ View pending requests
- ✓ Prevent duplicate requests
- ✓ Prevent self-friending
- ✓ JWT authentication on all routes
- ✓ Friends page UI
- ✓ Navigation integration
- ✓ Real-time updates
- ✓ Phase 1 & 2 features preserved
