# Friends System - Quick Reference

## 🚀 Quick Access

**Frontend:** http://localhost:3000/friends
**Requires:** JWT authentication

---

## 📡 API Endpoints

### Send Friend Request
```bash
POST /api/friends/request
Authorization: Bearer <token>
Body: {"email": "friend@email.com"}
```

### Accept Friend Request
```bash
POST /api/friends/accept
Authorization: Bearer <token>
Body: {"request_id": "REQUEST_ID"}
```

### Get Friends List
```bash
GET /api/friends
Authorization: Bearer <token>
```

### Get Pending Requests
```bash
GET /api/friends/requests/pending
Authorization: Bearer <token>
```

---

## 🗄️ Database Collections

### friend_requests
```javascript
{
  sender_id: ObjectId,
  receiver_id: ObjectId,
  status: "pending" | "accepted",
  created_at: Date
}
```

### friends
```javascript
{
  user1_id: ObjectId,
  user2_id: ObjectId,
  created_at: Date
}
```

---

## 🎯 User Flow

```
1. User A sends request to User B (by email)
   ↓
2. Request stored with status "pending"
   ↓
3. User B sees request in pending list
   ↓
4. User B clicks "Accept"
   ↓
5. Request status → "accepted"
   ↓
6. Friendship created in friends collection
   ↓
7. Both users see each other in friends list
```

---

## 🧪 Quick Test

```bash
# 1. Create two users
# User A: alice@test.com
# User B: bob@test.com

# 2. Login as Alice
# 3. Go to Friends page
# 4. Send request to bob@test.com

# 5. Login as Bob
# 6. Go to Friends page
# 7. Accept Alice's request

# 8. Both users now see each other as friends
```

---

## 🔍 MongoDB Queries

### View all friend requests
```javascript
db.friend_requests.find().pretty()
```

### View pending requests for user
```javascript
db.friend_requests.find({
  receiver_id: ObjectId("USER_ID"),
  status: "pending"
})
```

### View all friendships
```javascript
db.friends.find().pretty()
```

### View user's friends
```javascript
db.friends.find({
  $or: [
    {user1_id: ObjectId("USER_ID")},
    {user2_id: ObjectId("USER_ID")}
  ]
})
```

### Check if two users are friends
```javascript
db.friends.findOne({
  $or: [
    {user1_id: ObjectId("USER_A"), user2_id: ObjectId("USER_B")},
    {user1_id: ObjectId("USER_B"), user2_id: ObjectId("USER_A")}
  ]
})
```

---

## ⚠️ Validations

### Send Request
- ✓ Email required
- ✓ User must exist
- ✓ Cannot send to self
- ✓ Cannot send if already friends
- ✓ Cannot send duplicate request

### Accept Request
- ✓ Request ID required
- ✓ Request must exist
- ✓ Must be receiver
- ✓ Request must be pending

---

## 🎨 UI Components

### Friends Page Sections
1. **Add Friend** - Email input + Send button
2. **Pending Requests** - List with Accept buttons
3. **Your Friends** - List of friends

### Navigation
- Home → Friends (via "Friends" button)
- Friends → Home (via "Back to Home" button)

---

## 🐛 Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| User not found | Email doesn't exist | Check email spelling |
| Already friends | Friendship exists | View friends list |
| Request already sent | Pending request exists | Wait for acceptance |
| Cannot send to yourself | Same user | Use different email |
| Unauthorized | Not receiver | Login as correct user |
| Token missing | Not logged in | Login first |

---

## 💻 Code Snippets

### Backend - Check if Friends
```python
def are_friends(self, user1_id, user2_id):
    return self.friends_collection.find_one({
        '$or': [
            {'user1_id': ObjectId(user1_id), 'user2_id': ObjectId(user2_id)},
            {'user1_id': ObjectId(user2_id), 'user2_id': ObjectId(user1_id)}
        ]
    }) is not None
```

### Frontend - Send Request
```javascript
const handleSendRequest = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/friends/request', { email: friendEmail });
    setMessage(response.data.message);
  } catch (err) {
    setError(err.response?.data?.message);
  }
};
```

### Frontend - Accept Request
```javascript
const handleAcceptRequest = async (requestId) => {
  try {
    await api.post('/friends/accept', { request_id: requestId });
    fetchFriends();
    fetchPendingRequests();
  } catch (err) {
    setError(err.response?.data?.message);
  }
};
```

---

## 📊 Response Examples

### Success Responses
```json
// Send request
{"message": "Friend request sent"}

// Accept request
{"message": "Friend request accepted"}

// Get friends
[{"id": "...", "name": "John", "email": "john@email.com"}]

// Get pending
[{"request_id": "...", "name": "Jane", "email": "jane@email.com"}]
```

### Error Responses
```json
{"message": "User not found"}
{"message": "Already friends"}
{"message": "Friend request already sent"}
{"message": "Cannot send friend request to yourself"}
{"message": "Unauthorized"}
```

---

## 🔧 Debugging

### Check Backend Logs
```bash
# Terminal running backend
# Look for request logs and errors
```

### Check Frontend Console
```javascript
// Browser console (F12)
// Check for API errors
console.log(error.response?.data)
```

### Check Database
```javascript
mongosh
use easyxpense

// Check requests
db.friend_requests.find().pretty()

// Check friendships
db.friends.find().pretty()

// Check users
db.users.find({}, {name: 1, email: 1}).pretty()
```

---

## 🧹 Cleanup Commands

### Delete all friend requests
```javascript
db.friend_requests.deleteMany({})
```

### Delete all friendships
```javascript
db.friends.deleteMany({})
```

### Delete specific request
```javascript
db.friend_requests.deleteOne({_id: ObjectId("REQUEST_ID")})
```

### Delete specific friendship
```javascript
db.friends.deleteOne({_id: ObjectId("FRIENDSHIP_ID")})
```

---

## 📱 User Actions

### As Sender
1. Navigate to Friends page
2. Enter friend's email
3. Click "Send Request"
4. Wait for acceptance

### As Receiver
1. Navigate to Friends page
2. See pending request
3. Click "Accept"
4. Friend added to list

### View Friends
1. Navigate to Friends page
2. Scroll to "Your Friends"
3. See all friends listed

---

## 🎯 Key Features

✓ Email-based friend requests
✓ Real-time pending requests
✓ One-click accept
✓ Bidirectional friendships
✓ Duplicate prevention
✓ Self-friend prevention
✓ Authentication required
✓ Clean UI integration

---

## 📚 Related Documentation

- `PHASE3_FRIENDS.md` - Full documentation
- `PHASE3_TESTING.md` - Testing guide
- `PHASE3_SUMMARY.md` - Implementation summary
- `README.md` - Project overview

---

## ⚡ Quick Tips

💡 Use email addresses to send requests (not user IDs)
💡 Pending requests only visible to receiver
💡 Both users see each other after accepting
💡 Cannot send duplicate requests
💡 All routes require authentication
💡 Refresh page to see latest data

---

**Friends System Ready!** 🎉
