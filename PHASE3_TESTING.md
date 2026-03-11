# Phase 3 Friends System - Testing Guide

## Prerequisites

- Backend running on http://localhost:5000
- Frontend running on http://localhost:3000
- MongoDB running on mongodb://localhost:27017
- At least 2 user accounts created

## Quick Test Setup

### Create Test Users

**User A:**
- Name: Alice
- Email: alice@test.com
- Password: password123

**User B:**
- Name: Bob
- Email: bob@test.com
- Password: password123

## Test Scenarios

### Test 1: Send Friend Request

**Purpose:** Verify user can send friend request by email

**Steps:**
1. Login as Alice (alice@test.com)
2. Click "Friends" button on home page
3. In "Add Friend" section, enter: bob@test.com
4. Click "Send Request"

**Expected Result:**
- ✓ Success message: "Friend request sent"
- ✓ Email field clears
- ✓ No errors displayed

**Backend Verification:**
```javascript
// In MongoDB
use easyxpense
db.friend_requests.find({status: "pending"}).pretty()
// Should show request from Alice to Bob
```

---

### Test 2: View Pending Requests

**Purpose:** Verify receiver can see pending friend requests

**Steps:**
1. Logout from Alice's account
2. Login as Bob (bob@test.com)
3. Click "Friends" button
4. Look at "Pending Requests" section

**Expected Result:**
- ✓ Section shows "Pending Requests (1)"
- ✓ Alice's name and email displayed
- ✓ "Accept" button visible

---

### Test 3: Accept Friend Request

**Purpose:** Verify user can accept friend request

**Steps:**
1. As Bob, in "Pending Requests" section
2. Click "Accept" button next to Alice's request
3. Wait for response

**Expected Result:**
- ✓ Success message: "Friend request accepted!"
- ✓ Pending request disappears
- ✓ Alice appears in "Your Friends" section
- ✓ Friend count updates to (1)

**Backend Verification:**
```javascript
// Check request status changed
db.friend_requests.find({status: "accepted"}).pretty()

// Check friendship created
db.friends.find().pretty()
// Should show friendship between Alice and Bob
```

---

### Test 4: View Friends List

**Purpose:** Verify both users see each other as friends

**Steps:**
1. As Bob, check "Your Friends" section
2. Should see Alice listed
3. Logout and login as Alice
4. Click "Friends" button
5. Check "Your Friends" section

**Expected Result:**
- ✓ Bob sees Alice in friends list
- ✓ Alice sees Bob in friends list
- ✓ Both show correct name and email
- ✓ Friend count is (1) for both

---

### Test 5: Prevent Duplicate Request

**Purpose:** Verify system prevents duplicate friend requests

**Steps:**
1. As Alice, try to send another request to bob@test.com
2. Click "Send Request"

**Expected Result:**
- ✓ Error message: "Already friends"
- ✓ No new request created

---

### Test 6: Prevent Self-Friending

**Purpose:** Verify user cannot send request to themselves

**Steps:**
1. As Alice, enter alice@test.com in email field
2. Click "Send Request"

**Expected Result:**
- ✓ Error message: "Cannot send friend request to yourself"
- ✓ No request created

---

### Test 7: Non-existent User

**Purpose:** Verify error handling for invalid email

**Steps:**
1. As Alice, enter nonexistent@test.com
2. Click "Send Request"

**Expected Result:**
- ✓ Error message: "User not found"
- ✓ No request created

---

### Test 8: Multiple Friends

**Purpose:** Verify user can have multiple friends

**Setup:**
Create User C:
- Name: Charlie
- Email: charlie@test.com
- Password: password123

**Steps:**
1. As Alice, send request to charlie@test.com
2. Logout and login as Charlie
3. Accept Alice's request
4. Login as Alice
5. Check friends list

**Expected Result:**
- ✓ Alice has 2 friends (Bob and Charlie)
- ✓ Friend count shows (2)
- ✓ Both friends displayed correctly

---

### Test 9: Multiple Pending Requests

**Purpose:** Verify user can receive multiple requests

**Setup:**
Create User D:
- Name: David
- Email: david@test.com
- Password: password123

**Steps:**
1. As Alice, send request to david@test.com
2. As Bob, send request to david@test.com
3. Login as David
4. Check pending requests

**Expected Result:**
- ✓ Shows "Pending Requests (2)"
- ✓ Both Alice and Bob listed
- ✓ Each has "Accept" button
- ✓ Can accept both independently

---

### Test 10: Navigation Flow

**Purpose:** Verify navigation works correctly

**Steps:**
1. Login as any user
2. From home page, click "Friends"
3. On friends page, click "Back to Home"
4. Should return to home page
5. Click "Friends" again

**Expected Result:**
- ✓ Navigation works smoothly
- ✓ No page errors
- ✓ Data persists across navigation

---

### Test 11: Authentication Required

**Purpose:** Verify friends page requires login

**Steps:**
1. Logout completely
2. Manually navigate to http://localhost:3000/friends

**Expected Result:**
- ✓ Automatically redirects to /login
- ✓ Cannot access friends page without auth

---

### Test 12: Token Persistence

**Purpose:** Verify friends data persists after page refresh

**Steps:**
1. Login and navigate to friends page
2. View your friends list
3. Refresh the page (F5)

**Expected Result:**
- ✓ Still logged in
- ✓ Friends list still displayed
- ✓ Pending requests still shown
- ✓ No data loss

---

## API Testing with cURL

### Test Send Request API

```bash
# Login first to get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"password123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Send friend request
curl -X POST http://localhost:5000/api/friends/request \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@test.com"}'
```

**Expected Response:**
```json
{"message": "Friend request sent"}
```

---

### Test Get Pending Requests API

```bash
curl -X GET http://localhost:5000/api/friends/requests/pending \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
[
  {
    "request_id": "...",
    "sender_id": "...",
    "name": "Alice",
    "email": "alice@test.com"
  }
]
```

---

### Test Accept Request API

```bash
curl -X POST http://localhost:5000/api/friends/accept \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"request_id":"REQUEST_ID_HERE"}'
```

**Expected Response:**
```json
{"message": "Friend request accepted"}
```

---

### Test Get Friends API

```bash
curl -X GET http://localhost:5000/api/friends \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
[
  {
    "id": "...",
    "name": "Bob",
    "email": "bob@test.com"
  }
]
```

---

## Database Verification

### Check Friend Requests

```javascript
mongosh
use easyxpense

// View all friend requests
db.friend_requests.find().pretty()

// View pending requests only
db.friend_requests.find({status: "pending"}).pretty()

// View accepted requests
db.friend_requests.find({status: "accepted"}).pretty()

// Count requests
db.friend_requests.countDocuments()
```

---

### Check Friendships

```javascript
// View all friendships
db.friends.find().pretty()

// Count friendships
db.friends.countDocuments()

// Find specific user's friendships
db.friends.find({
  $or: [
    {user1_id: ObjectId("USER_ID_HERE")},
    {user2_id: ObjectId("USER_ID_HERE")}
  ]
}).pretty()
```

---

### Check Users

```javascript
// View all users
db.users.find({}, {name: 1, email: 1}).pretty()

// Find user by email
db.users.findOne({email: "alice@test.com"})
```

---

## UI/UX Testing

### Form Validation
- [ ] Email field requires valid email format
- [ ] Cannot submit empty email
- [ ] Error messages display in red
- [ ] Success messages display in green

### Button States
- [ ] "Send Request" button is green
- [ ] "Accept" button is green
- [ ] "Back to Home" button is gray
- [ ] Buttons have hover effects

### Card Layout
- [ ] Three cards displayed vertically
- [ ] Cards have dark background
- [ ] Cards have rounded corners
- [ ] Cards lift on hover

### Friend Items
- [ ] Friend name displayed in white
- [ ] Friend email displayed in gray
- [ ] Items have hover effect
- [ ] Accept button aligned right

### Responsive Design
- [ ] Page centered on screen
- [ ] Cards have consistent width
- [ ] Text is readable
- [ ] Buttons are clickable

---

## Performance Testing

### Load Time
- Friends page should load < 1 second
- API calls should complete < 500ms
- No lag when clicking buttons

### Data Updates
- Friends list updates immediately after accept
- Pending requests disappear after accept
- Success messages appear instantly

---

## Error Handling Testing

### Network Errors
1. Stop backend server
2. Try to send friend request
3. Should show error message

### Invalid Token
1. Manually edit token in localStorage
2. Try to access friends page
3. Should redirect to login

### Invalid Request ID
1. Try to accept with fake request_id
2. Should show error message

---

## Integration Testing

### Full User Journey

**Scenario:** Two new users become friends

1. **User Registration**
   - Register Alice
   - Register Bob

2. **Send Request**
   - Alice logs in
   - Alice sends request to Bob
   - Verify request created in DB

3. **Accept Request**
   - Bob logs in
   - Bob sees pending request
   - Bob accepts request
   - Verify friendship created in DB

4. **View Friends**
   - Both users see each other in friends list
   - Friend counts are correct
   - Names and emails displayed correctly

**Expected Result:**
- ✓ Complete flow works end-to-end
- ✓ No errors at any step
- ✓ Data consistent across users

---

## Cleanup After Testing

### Clear Test Data

```javascript
mongosh
use easyxpense

// Delete all friend requests
db.friend_requests.deleteMany({})

// Delete all friendships
db.friends.deleteMany({})

// Delete test users (optional)
db.users.deleteMany({email: {$regex: "@test.com"}})
```

---

## Common Issues & Solutions

### Issue: "User not found"
**Cause:** Email doesn't exist in database
**Solution:** Verify email is correct and user is registered

### Issue: "Already friends"
**Cause:** Friendship already exists
**Solution:** Check friends list, users are already friends

### Issue: "Friend request already sent"
**Cause:** Pending request exists
**Solution:** Wait for other user to accept or check pending requests

### Issue: Pending requests not showing
**Cause:** Logged in as wrong user
**Solution:** Ensure logged in as receiver, not sender

### Issue: Friends page blank
**Cause:** Not authenticated
**Solution:** Login first, check token exists

### Issue: Accept button not working
**Cause:** Request already processed
**Solution:** Refresh page, check if already accepted

---

## Test Checklist

### Backend Tests
- [ ] Send friend request creates DB entry
- [ ] Accept request updates status
- [ ] Accept request creates friendship
- [ ] Duplicate requests prevented
- [ ] Self-friending prevented
- [ ] Non-existent user handled
- [ ] All routes require authentication
- [ ] Error responses correct

### Frontend Tests
- [ ] Friends page loads
- [ ] Add friend form works
- [ ] Pending requests display
- [ ] Accept button works
- [ ] Friends list displays
- [ ] Navigation works
- [ ] Error messages show
- [ ] Success messages show
- [ ] Authentication required

### Integration Tests
- [ ] Full friend request flow works
- [ ] Multiple friends supported
- [ ] Multiple pending requests work
- [ ] Data syncs between users
- [ ] Page refresh maintains state
- [ ] Logout clears access

---

## Phase 3 Testing Complete ✓

All tests passing means:
- ✓ Friends system fully functional
- ✓ All validations working
- ✓ UI/UX working correctly
- ✓ Phase 1 & 2 features intact
- ✓ Ready for Phase 4 development

**Friends System is production-ready!** 🎉
