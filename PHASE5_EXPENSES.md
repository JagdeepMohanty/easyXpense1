# EasyXpense - Phase 5 Expenses System (Core Feature)

Complete expense splitting system allowing users to create expenses, split them equally, and track payments within groups.

## What's New in Phase 5

### Backend Features ✓
- Create expenses within groups
- Equal split calculation
- Track who paid the expense
- Track participants in expense
- View user's expenses
- View group expenses
- All routes protected with JWT authentication

### Frontend Features ✓
- Expenses page with three sections
- Create expense form with group selector
- Member selection for payer
- Participant checkboxes
- Group expenses list
- User expenses list
- Real-time split calculation display
- Navigation from home page

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
│   │   ├── groups.py
│   │   └── expenses.py       ← NEW
│   │
│   ├── models/
│   │   ├── user_model.py
│   │   ├── friend_model.py
│   │   ├── group_model.py
│   │   └── expense_model.py  ← NEW
│   │
│   ├── middleware/
│   │   └── auth_middleware.py
│   │
│   ├── config/
│   │   └── config.py
│   │
│   ├── app.py                ← UPDATED
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx      ← UPDATED
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Friends.jsx
    │   │   ├── Groups.jsx
    │   │   └── Expenses.jsx  ← NEW
    │   │
    │   ├── components/
    │   │   └── Card.jsx
    │   │
    │   ├── services/
    │   │   └── api.js
    │   │
    │   ├── App.jsx           ← UPDATED
    │   ├── main.jsx
    │   └── styles.css        ← UPDATED
    │
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Database Schema

### Expenses Collection

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  group_id: ObjectId("507f1f77bcf86cd799439012"),
  description: "Dinner",
  amount: 1200,
  paid_by: ObjectId("507f1f77bcf86cd799439013"),
  participants: [
    ObjectId("507f1f77bcf86cd799439013"),
    ObjectId("507f1f77bcf86cd799439014"),
    ObjectId("507f1f77bcf86cd799439015"),
    ObjectId("507f1f77bcf86cd799439016")
  ],
  split_amount: 300,
  created_at: ISODate("2024-01-15T10:30:00Z")
}
```

**Rules:**
- Expense must belong to a group
- Paid by must be a group member
- All participants must be group members
- Split amount = amount / participants.length
- Equal split only (for now)

## API Endpoints

### Expenses Endpoints (All Protected)

#### 1. Create Expense
```
POST /api/expenses
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "group_id": "507f1f77bcf86cd799439012",
  "description": "Dinner",
  "amount": 1200,
  "paid_by": "507f1f77bcf86cd799439013",
  "participants": [
    "507f1f77bcf86cd799439013",
    "507f1f77bcf86cd799439014",
    "507f1f77bcf86cd799439015",
    "507f1f77bcf86cd799439016"
  ]
}
```

**Success Response (201):**
```json
{
  "message": "Expense created",
  "expense_id": "507f1f77bcf86cd799439011",
  "split_amount": 300
}
```

**Error Responses:**
```json
// Missing fields
{
  "message": "All fields are required"
}

// Invalid amount
{
  "message": "Amount must be greater than 0"
}

// Not a group member
{
  "message": "You are not a member of this group"
}

// Payer not a member
{
  "message": "Payer must be a group member"
}

// Participant not a member
{
  "message": "All participants must be group members"
}
```

---

#### 2. Get User's Expenses
```
GET /api/expenses
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
    "description": "Dinner",
    "amount": 1200,
    "split_amount": 300,
    "paid_by": "John Doe",
    "group_name": "Goa Trip",
    "created_at": "2024-01-15T10:30:00"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "description": "Movie",
    "amount": 800,
    "split_amount": 200,
    "paid_by": "Jane Smith",
    "group_name": "Roommates",
    "created_at": "2024-01-14T18:00:00"
  }
]
```

---

#### 3. Get Group Expenses
```
GET /api/expenses/groups/:id
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
    "description": "Dinner",
    "amount": 1200,
    "split_amount": 300,
    "paid_by": "John Doe",
    "participants": ["John Doe", "Jane Smith", "Bob Wilson", "Alice Brown"],
    "created_at": "2024-01-15T10:30:00"
  }
]
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

## Frontend Implementation

### Expenses Page Features

#### 1. Create Expense Section
- Group selector dropdown
- Description input field
- Amount input field
- Paid by dropdown (group members)
- Participants checkboxes (group members)
- Create Expense button
- Success/error message display
- Split amount calculation display

#### 2. Group Expenses Section
- Shows after selecting a group
- List of all expenses in the group
- Displays description, amount, payer, split amount
- Shows participants list
- Sorted by creation date (newest first)

#### 3. Your Expenses Section
- List of all expenses user is involved in
- Shows description, amount, group name, payer
- Displays user's share (split amount)
- Sorted by creation date (newest first)
- Empty state message

### Navigation
- "Expenses" button on home page (when logged in)
- "Back to Home" button on expenses page
- Automatic redirect to login if not authenticated

## Setup & Installation

No additional dependencies required. The expenses system uses existing packages.

### Run the Application

```bash
# Backend
cd backend
python app.py

# Frontend
cd frontend
npm run dev
```

## Testing the Expenses System

### Test Scenario 1: Create Expense

**Setup:**
1. Create group "Goa Trip" with 4 members:
   - John (creator)
   - Jane
   - Bob
   - Alice

**Steps:**
1. Login as John
2. Click "Expenses" button
3. Select "Goa Trip" from group dropdown
4. Enter description: "Dinner"
5. Enter amount: 1200
6. Select "John" as paid by
7. Check all 4 members as participants
8. Click "Create Expense"

**Expected Result:**
- ✓ Success message: "Expense created! Split: ₹300 per person"
- ✓ Expense appears in "Group Expenses" section
- ✓ Expense appears in "Your Expenses" section
- ✓ Form fields clear

**Calculation:**
```
Amount: ₹1200
Participants: 4
Split: ₹1200 / 4 = ₹300 per person
```

---

### Test Scenario 2: View Group Expenses

**Steps:**
1. As John, select "Goa Trip" from dropdown
2. View "Group Expenses" section

**Expected Result:**
- ✓ Shows "Dinner" expense
- ✓ Amount: ₹1200
- ✓ Paid by: John
- ✓ Split: ₹300 each
- ✓ Participants: John, Jane, Bob, Alice

---

### Test Scenario 3: View as Participant

**Steps:**
1. Logout from John
2. Login as Jane
3. Click "Expenses"
4. Check "Your Expenses" section

**Expected Result:**
- ✓ Jane sees "Dinner" expense
- ✓ Group: Goa Trip
- ✓ Amount: ₹1200
- ✓ Paid by: John
- ✓ Your share: ₹300

---

### Test Scenario 4: Multiple Expenses

**Steps:**
1. As Jane, create another expense:
   - Group: Goa Trip
   - Description: Movie
   - Amount: 800
   - Paid by: Jane
   - Participants: John, Jane (only 2)
2. View group expenses

**Expected Result:**
- ✓ Both expenses listed
- ✓ Movie split: ₹400 each (800/2)
- ✓ Sorted by newest first

---

### Test Scenario 5: Validation - Non-member Payer

**Steps:**
1. Try to create expense with invalid data
2. System should validate

**Expected Result:**
- ✓ Cannot select non-member as payer
- ✓ Cannot select non-member as participant
- ✓ Must select at least one participant
- ✓ Amount must be greater than 0

---

## UI Components

### Expenses Page Layout

```
┌─────────────────────────────────────┐
│          EasyXpense                 │
│                                     │
│  [Back to Home]                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Create Expense                │ │
│  │ Group: [Goa Trip ▼]           │ │
│  │ Description: [Dinner]         │ │
│  │ Amount: [1200]                │ │
│  │ Paid By: [John ▼]             │ │
│  │ Participants:                 │ │
│  │ ☑ John                        │ │
│  │ ☑ Jane                        │ │
│  │ ☑ Bob                         │ │
│  │ ☑ Alice                       │ │
│  │ [Create Expense]              │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Group Expenses (2)            │ │
│  │ ┌─────────────────────────┐   │ │
│  │ │ Dinner                  │   │ │
│  │ │ ₹1200 | John | ₹300 each│   │ │
│  │ │ John, Jane, Bob, Alice  │   │ │
│  │ └─────────────────────────┘   │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Your Expenses (3)             │ │
│  │ ┌─────────────────────────┐   │ │
│  │ │ Dinner                  │   │ │
│  │ │ Goa Trip | ₹1200 | John │   │ │
│  │ │ Your share: ₹300        │   │ │
│  │ └─────────────────────────┘   │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Styling
- Same dark theme as previous phases
- Card-based layout
- Dropdown selects for group and payer
- Checkboxes for participants
- Hover effects on expense items
- Green primary buttons

## Backend Logic

### Create Expense Flow

```
User creates expense
    ↓
Validate all fields present
    ↓
Validate amount > 0
    ↓
Verify group exists
    ↓
Verify user is group member
    ↓
Verify payer is group member
    ↓
Verify all participants are group members
    ↓
Calculate split amount (amount / participants.length)
    ↓
Create expense document
    ↓
Return expense ID and split amount
```

### Equal Split Calculation

```javascript
split_amount = amount / participants.length

Example:
amount = 1200
participants = 4
split_amount = 1200 / 4 = 300
```

### Get User Expenses Flow

```
User requests expenses
    ↓
Find expenses where user is paid_by OR in participants
    ↓
Fetch payer and group details
    ↓
Return expenses list
```

## Security Features

✓ All routes protected with JWT authentication
✓ Only group members can create expenses
✓ Only group members can be payer
✓ Only group members can be participants
✓ Only group members can view group expenses
✓ Validates group existence
✓ Validates amount is positive

## Error Handling

### Backend Validation
- All fields required
- Amount must be positive number
- Group must exist
- User must be group member
- Payer must be group member
- All participants must be group members
- At least one participant required

### Frontend Validation
- Group selection required
- Description required
- Amount required and must be positive
- Payer selection required
- At least one participant required
- Error message display
- Success feedback with split amount

## Database Queries

### Create Expense
```javascript
db.expenses.insertOne({
  group_id: ObjectId(groupId),
  description: "Dinner",
  amount: 1200,
  paid_by: ObjectId(userId),
  participants: [ObjectId(id1), ObjectId(id2)],
  split_amount: 300,
  created_at: new Date()
})
```

### Get User Expenses
```javascript
db.expenses.find({
  $or: [
    { paid_by: ObjectId(userId) },
    { participants: ObjectId(userId) }
  ]
}).sort({ created_at: -1 })
```

### Get Group Expenses
```javascript
db.expenses.find({
  group_id: ObjectId(groupId)
}).sort({ created_at: -1 })
```

## Phase 1-4 Compatibility

✓ All authentication features work
✓ Friends system functional
✓ Groups system functional
✓ Health check endpoint functional
✓ All previous pages unchanged
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

### Issue: "You are not a member of this group"
**Solution:** Only group members can create expenses in that group

### Issue: "Payer must be a group member"
**Solution:** Select a member from the group as payer

### Issue: "All participants must be group members"
**Solution:** Only select members who belong to the group

### Issue: "Amount must be greater than 0"
**Solution:** Enter a positive amount

### Issue: Expenses page redirects to login
**Solution:** Token may be expired, login again

## Example Scenarios

### Scenario 1: Dinner Split
```
Group: Goa Trip
Members: 4 (Amit, Rahul, Neha, Riya)

Expense:
- Description: Dinner
- Amount: ₹1200
- Paid by: Rahul
- Participants: All 4

Result:
- Split: ₹300 each
- Rahul paid ₹1200
- Each person owes Rahul ₹300
```

### Scenario 2: Movie (Partial Group)
```
Group: Roommates
Members: 5 (A, B, C, D, E)

Expense:
- Description: Movie
- Amount: ₹600
- Paid by: A
- Participants: A, B, C (only 3 went)

Result:
- Split: ₹200 each
- A paid ₹600
- B owes A ₹200
- C owes A ₹200
```

## Testing with cURL

### Create Expense
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": "GROUP_ID",
    "description": "Dinner",
    "amount": 1200,
    "paid_by": "USER_ID",
    "participants": ["USER_ID_1", "USER_ID_2"]
  }'
```

### Get User Expenses
```bash
curl -X GET http://localhost:5000/api/expenses \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Group Expenses
```bash
curl -X GET http://localhost:5000/api/expenses/groups/GROUP_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Next Steps (Phase 6)

Potential features:
- Unequal splits
- Percentage-based splits
- Expense categories
- Expense editing/deletion
- Settlement calculations
- Payment tracking
- Expense reports
- Export functionality

## Phase 5 Complete ✓

- ✓ Create expenses in groups
- ✓ Equal split calculation
- ✓ Track who paid
- ✓ Track participants
- ✓ View group expenses
- ✓ View user expenses
- ✓ JWT authentication on all routes
- ✓ Expenses page UI
- ✓ Navigation integration
- ✓ Real-time updates
- ✓ Phase 1-4 features preserved

**The core expense splitting feature is now complete!** 🎉
