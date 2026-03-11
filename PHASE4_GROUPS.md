# EasyXpense - Phase 4 Groups System

Complete groups system allowing users to create groups, view groups, and manage members.

## What's New in Phase 4

### Backend Features ✓
- Create groups
- View user's groups
- View group details with members
- Add members to groups
- Validate member is a friend before adding
- All routes protected with JWT authentication

### Frontend Features ✓
- Groups page with three sections
- Create group form
- Groups list with view buttons
- Group details with members list
- Add member to group form
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
│   │   ├── friends.py
│   │   └── groups.py          ← NEW
│   │
│   ├── models/
│   │   ├── user_model.py
│   │   ├── friend_model.py
│   │   └── group_model.py     ← NEW
│   │
│   ├── middleware/
│   │   └── auth_middleware.py
│   │
│   ├── config/
│   │   └── config.py
│   │
│   ├── app.py                 ← UPDATED
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx       ← UPDATED
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Friends.jsx
    │   │   └── Groups.jsx     ← NEW
    │   │
    │   ├── components/
    │   │   └── Card.jsx
    │   │
    │   ├── services/
    │   │   └── api.js
    │   │
    │   ├── App.jsx            ← UPDATED
    │   ├── main.jsx
    │   └── styles.css         ← UPDATED
    │
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Database Schema

### Groups Collection

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "Goa Trip",
  created_by: ObjectId("507f1f77bcf86cd799439012"),
  members: [
    ObjectId("507f1f77bcf86cd799439012"),
    ObjectId("507f1f77bcf86cd799439013")
  ],
  created_at: ISODate("2024-01-15T10:30:00Z")
}
```

**Rules:**
- Creator automatically becomes a member
- Members array contains user ObjectIds
- Members must be friends of existing members to be added

## API Endpoints

### Groups Endpoints (All Protected)

#### 1. Create Group
```
POST /api/groups
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Goa Trip"
}
```

**Success Response (201):**
```json
{
  "message": "Group created",
  "group_id": "507f1f77bcf86cd799439011"
}
```

**Error Response (400):**
```json
{
  "message": "Group name is required"
}
```

---

#### 2. Get User's Groups
```
GET /api/groups
```

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Goa Trip"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "name": "Roommates"
  }
]
```

---

#### 3. Get Group Details
```
GET /api/groups/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Goa Trip",
  "members": [
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
}
```

**Error Responses:**
```json
// Group not found
{
  "message": "Group not found"
}

// Not a member
{
  "message": "You are not a member of this group"
}
```

---

#### 4. Add Member to Group
```
POST /api/groups/:id/members
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

**Success Response (200):**
```json
{
  "message": "Member added"
}
```

**Error Responses:**
```json
// User not found
{
  "message": "User not found"
}

// Not friends
{
  "message": "You can only add friends to the group"
}

// Already a member
{
  "message": "User is already a member"
}

// Not a group member
{
  "message": "You are not a member of this group"
}
```

---

## Frontend Implementation

### Groups Page Features

#### 1. Create Group Section
- Group name input field
- Create Group button
- Success/error message display
- Form validation

#### 2. Your Groups Section
- List of all groups user belongs to
- Group name display
- View button for each group
- Group count display
- Empty state message

#### 3. Group Details Section
- Group name header
- Members list with names and emails
- Member count display
- Add member form
- Friend email input
- Add Member button

### Navigation
- "Groups" button on home page (when logged in)
- "Back to Home" button on groups page
- Automatic redirect to login if not authenticated

## Setup & Installation

No additional dependencies required. The groups system uses existing packages.

### Run the Application

```bash
# Backend
cd backend
python app.py

# Frontend
cd frontend
npm run dev
```

## Testing the Groups System

### Test Scenario 1: Create Group

**Setup:**
1. Login as User A

**Steps:**
1. Click "Groups" button on home page
2. In "Create Group" section, enter: "Goa Trip"
3. Click "Create Group"

**Expected Result:**
- ✓ Success message: "Group created"
- ✓ Group appears in "Your Groups" list
- ✓ Group name field clears

---

### Test Scenario 2: View Group Details

**Steps:**
1. In "Your Groups" section, find "Goa Trip"
2. Click "View" button

**Expected Result:**
- ✓ Group details card appears
- ✓ Shows "Group: Goa Trip"
- ✓ Shows "Members (1)"
- ✓ User A listed as member

---

### Test Scenario 3: Add Friend to Group

**Setup:**
1. User A and User B are friends (from Phase 3)

**Steps:**
1. As User A, view "Goa Trip" group details
2. In "Add Member" section, enter: bob@email.com
3. Click "Add Member"

**Expected Result:**
- ✓ Success message: "Member added"
- ✓ Bob appears in members list
- ✓ Member count updates to (2)
- ✓ Email field clears

---

### Test Scenario 4: View Group as Added Member

**Steps:**
1. Logout from User A
2. Login as User B
3. Click "Groups" button
4. Should see "Goa Trip" in groups list
5. Click "View" button

**Expected Result:**
- ✓ Bob sees "Goa Trip" in his groups
- ✓ Group details show both User A and Bob
- ✓ Bob can also add members

---

### Test Scenario 5: Add Non-Friend to Group

**Setup:**
1. User C exists but is not friends with User A

**Steps:**
1. As User A, try to add charlie@email.com to group
2. Click "Add Member"

**Expected Result:**
- ✓ Error message: "You can only add friends to the group"
- ✓ User C not added to group

---

### Test Scenario 6: Add Existing Member

**Steps:**
1. As User A, try to add bob@email.com again
2. Click "Add Member"

**Expected Result:**
- ✓ Error message: "User is already a member"
- ✓ No duplicate member added

---

### Test Scenario 7: Multiple Groups

**Steps:**
1. As User A, create another group "Roommates"
2. View groups list

**Expected Result:**
- ✓ Both "Goa Trip" and "Roommates" listed
- ✓ Group count shows (2)
- ✓ Can view details of each separately

---

## UI Components

### Groups Page Layout

```
┌─────────────────────────────────────┐
│          EasyXpense                 │
│                                     │
│  [Back to Home]                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Create Group                  │ │
│  │ Name: [____________]          │ │
│  │ [Create Group]                │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Your Groups (2)               │ │
│  │ ┌─────────────────────────┐   │ │
│  │ │ Goa Trip         [View] │   │ │
│  │ └─────────────────────────┘   │ │
│  │ ┌─────────────────────────┐   │ │
│  │ │ Roommates        [View] │   │ │
│  │ └─────────────────────────┘   │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Group: Goa Trip               │ │
│  │ ─────────────────────────────│ │
│  │ Members (2)                   │ │
│  │ ┌─────────────────────────┐   │ │
│  │ │ John Doe                │   │ │
│  │ │ john@email.com          │   │ │
│  │ └─────────────────────────┘   │ │
│  │ ─────────────────────────────│ │
│  │ Add Member                    │ │
│  │ Email: [____________]         │ │
│  │ [Add Member]                  │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Styling
- Same dark theme as previous phases
- Card-based layout
- Hover effects on group items
- Green primary buttons
- Section dividers

## Backend Logic

### Create Group Flow

```
User creates group
    ↓
Validate group name
    ↓
Create group document
    ↓
Add creator to members array
    ↓
Return group ID
```

### Add Member Flow

```
User adds member by email
    ↓
Verify group exists
    ↓
Verify requester is member
    ↓
Find user by email
    ↓
Check if users are friends
    ↓
Check if not already member
    ↓
Add to members array
    ↓
Success
```

### Get Groups Flow

```
User requests groups
    ↓
Find groups where user in members array
    ↓
Return group list
```

## Security Features

✓ All routes protected with JWT authentication
✓ Only group members can view details
✓ Only group members can add new members
✓ Can only add friends to groups
✓ Prevents duplicate members
✓ Validates group existence
✓ Validates user existence

## Error Handling

### Backend Validation
- Group name required
- Email required for adding member
- Group existence validation
- Membership validation
- Friendship validation
- Duplicate member prevention

### Frontend Validation
- Text input validation
- Email format validation
- Empty field prevention
- Error message display
- Success feedback
- Loading states

## Database Queries

### Get User's Groups
```javascript
db.groups.find({
  members: ObjectId(userId)
})
```

### Check if User is Member
```javascript
db.groups.findOne({
  _id: ObjectId(groupId),
  members: ObjectId(userId)
})
```

### Add Member to Group
```javascript
db.groups.updateOne(
  { _id: ObjectId(groupId) },
  { $addToSet: { members: ObjectId(userId) } }
)
```

## Phase 1, 2 & 3 Compatibility

✓ All authentication features work
✓ Friends system functional
✓ Health check endpoint functional
✓ Login/Signup pages unchanged
✓ User dashboard enhanced (not broken)
✓ JWT token management intact
✓ No breaking changes

## Technology Stack

Same as previous phases:
- Flask 3.0.0
- PyMongo 4.6.1
- React 18.2.0
- Axios 1.6.2

No new dependencies added!

## Troubleshooting

### Issue: "Group not found"
**Solution:** Verify group ID is correct

### Issue: "You are not a member of this group"
**Solution:** Only group members can view details or add members

### Issue: "You can only add friends to the group"
**Solution:** Become friends first (Phase 3), then add to group

### Issue: "User is already a member"
**Solution:** User is already in the group, check members list

### Issue: Groups page redirects to login
**Solution:** Token may be expired, login again

## Testing with cURL

### Create Group
```bash
curl -X POST http://localhost:5000/api/groups \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Goa Trip"}'
```

### Get Groups
```bash
curl -X GET http://localhost:5000/api/groups \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Group Details
```bash
curl -X GET http://localhost:5000/api/groups/GROUP_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Add Member
```bash
curl -X POST http://localhost:5000/api/groups/GROUP_ID/members \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"friend@email.com"}'
```

## Next Steps (Phase 5)

Potential features:
- Remove members from groups
- Delete groups
- Edit group name
- Group expenses
- Split bills within groups
- Group activity feed

## Phase 4 Complete ✓

- ✓ Create groups
- ✓ View user's groups
- ✓ View group details
- ✓ Add members to groups
- ✓ Validate friendship before adding
- ✓ JWT authentication on all routes
- ✓ Groups page UI
- ✓ Navigation integration
- ✓ Real-time updates
- ✓ Phase 1, 2 & 3 features preserved
