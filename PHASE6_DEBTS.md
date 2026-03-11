# EasyXpense - Phase 6 Debt Tracking System

Automatic debt calculation system that dynamically computes who owes whom based on expenses.

## What's New in Phase 6

### Backend Features ✓
- Dynamic debt calculation from expenses
- No new database collection (calculated on-the-fly)
- Get user's total debts across all groups
- Get group-specific debts
- Debt netting (A owes B and B owes A = net amount)
- All routes protected with JWT authentication

### Frontend Features ✓
- Debt Summary card on dashboard
- "You Owe" section with red highlighting
- "Owed To You" section with green highlighting
- Real-time debt calculation
- Empty state messages
- Color-coded debt items

## Updated Project Structure

```
easyxpense/
│
├── backend/
│   ├── routes/
│   │   ├── health.py
│   │   ├── auth.py
│   │   ├── friends.py
│   │   ├── groups.py
│   │   ├── expenses.py
│   │   └── debts.py          ← NEW
│   │
│   ├── models/
│   │   ├── user_model.py
│   │   ├── friend_model.py
│   │   ├── group_model.py
│   │   └── expense_model.py
│   │
│   ├── app.py                ← UPDATED
│   └── ...
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx      ← UPDATED (Debt Summary)
    │   │   └── ...
    │   │
    │   └── styles.css        ← UPDATED
    └── ...
```

## Debt Calculation Logic

### Core Concept

Debts are **calculated dynamically** from the expenses collection. No separate debt collection is created.

### Calculation Rules

For each expense:
```
payer = paid_by
split_amount = amount / participants.length

For each participant:
  if participant != payer:
    participant owes payer split_amount
```

### Example Calculation

**Expense:**
```javascript
{
  description: "Dinner",
  amount: 1200,
  paid_by: Rahul,
  participants: [Rahul, Amit, Neha, Riya],
  split_amount: 300
}
```

**Debt Calculation:**
```
Amit owes Rahul: ₹300
Neha owes Rahul: ₹300
Riya owes Rahul: ₹300
```

### Debt Netting

If A owes B ₹500 and B owes A ₹200:
```
Net result: A owes B ₹300
```

This prevents showing both debts and simplifies the view.

## API Endpoints

### Debts Endpoints (All Protected)

#### 1. Get User's Debts
```
GET /api/debts
```

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "you_owe": [
    {
      "user_id": "507f1f77bcf86cd799439012",
      "name": "Rahul",
      "amount": 300
    },
    {
      "user_id": "507f1f77bcf86cd799439013",
      "name": "Neha",
      "amount": 150
    }
  ],
  "you_are_owed": [
    {
      "user_id": "507f1f77bcf86cd799439014",
      "name": "Amit",
      "amount": 200
    }
  ]
}
```

**Description:**
- Returns aggregated debts across all groups
- Includes debt netting
- Shows only net amounts

---

#### 2. Get Group Debts
```
GET /api/debts/groups/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "from": "Amit",
    "from_id": "507f1f77bcf86cd799439012",
    "to": "Rahul",
    "to_id": "507f1f77bcf86cd799439013",
    "amount": 300
  },
  {
    "from": "Neha",
    "from_id": "507f1f77bcf86cd799439014",
    "to": "Rahul",
    "to_id": "507f1f77bcf86cd799439013",
    "amount": 300
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

## Backend Implementation

### Debt Calculation Algorithm

```python
def calculate_debts_from_expenses(expenses):
    balances = {}
    
    for expense in expenses:
        payer_id = expense['paid_by']
        split_amount = expense['split_amount']
        
        for participant_id in expense['participants']:
            if participant_id == payer_id:
                continue
            
            # Participant owes payer
            if participant_id not in balances:
                balances[participant_id] = {}
            
            if payer_id not in balances[participant_id]:
                balances[participant_id][payer_id] = 0
            
            balances[participant_id][payer_id] += split_amount
    
    return balances
```

### Debt Netting Algorithm

```python
def aggregate_user_debts(balances, user_id):
    you_owe = {}
    you_are_owed = {}
    
    # What user owes to others
    if user_id in balances:
        for creditor_id, amount in balances[user_id].items():
            you_owe[creditor_id] = amount
    
    # What others owe to user
    for debtor_id, creditors in balances.items():
        if user_id in creditors:
            amount = creditors[user_id]
            
            # Net with existing debt
            if debtor_id in you_owe:
                net = you_owe[debtor_id] - amount
                if net > 0:
                    you_owe[debtor_id] = net
                elif net < 0:
                    you_are_owed[debtor_id] = -net
                    del you_owe[debtor_id]
                else:
                    del you_owe[debtor_id]
            else:
                you_are_owed[debtor_id] = amount
    
    return you_owe, you_are_owed
```

## Frontend Implementation

### Dashboard Debt Summary

The Home page now displays:

1. **You Owe Section** (Red theme)
   - Lists people user owes money to
   - Shows amount in red
   - Empty state: "You don't owe anyone!"

2. **Owed To You Section** (Green theme)
   - Lists people who owe user money
   - Shows amount in green
   - Empty state: "No one owes you!"

### API Integration

```javascript
const fetchDebts = async () => {
  try {
    const response = await api.get('/debts');
    setDebts(response.data);
  } catch (error) {
    console.error('Error fetching debts:', error);
  }
};
```

## Testing the Debt Tracking System

### Test Scenario 1: Single Expense

**Setup:**
- Group: Goa Trip
- Members: Rahul, Amit, Neha, Riya

**Expense:**
```
Description: Dinner
Amount: ₹1200
Paid by: Rahul
Participants: All 4
Split: ₹300 each
```

**Expected Debts:**

**Rahul's Dashboard:**
```
You Owe: (empty)
Owed To You:
  - Amit owes you ₹300
  - Neha owes you ₹300
  - Riya owes you ₹300
```

**Amit's Dashboard:**
```
You Owe:
  - You owe Rahul ₹300
Owed To You: (empty)
```

---

### Test Scenario 2: Multiple Expenses

**Expense 1:**
```
Dinner: ₹1200
Paid by: Rahul
Participants: All 4
Split: ₹300 each
```

**Expense 2:**
```
Movie: ₹800
Paid by: Amit
Participants: Rahul, Amit
Split: ₹400 each
```

**Expected Debts:**

**Rahul's Dashboard:**
```
You Owe:
  - You owe Amit ₹400
Owed To You:
  - Neha owes you ₹300
  - Riya owes you ₹300
```

**Amit's Dashboard:**
```
You Owe:
  - You owe Rahul ₹300
Owed To You:
  - Rahul owes you ₹400
```

**After Netting:**
```
Amit's Dashboard:
You Owe: (empty)
Owed To You:
  - Rahul owes you ₹100 (₹400 - ₹300)
```

---

### Test Scenario 3: Complex Netting

**Expense 1:**
```
Lunch: ₹600
Paid by: Amit
Participants: Amit, Rahul
Split: ₹300 each
```

**Expense 2:**
```
Dinner: ₹1200
Paid by: Rahul
Participants: Amit, Rahul, Neha, Riya
Split: ₹300 each
```

**Calculation:**
```
From Expense 1:
  Rahul owes Amit ₹300

From Expense 2:
  Amit owes Rahul ₹300
  Neha owes Rahul ₹300
  Riya owes Rahul ₹300

After Netting (Rahul & Amit):
  ₹300 - ₹300 = ₹0 (cancelled out)
```

**Expected Debts:**

**Rahul's Dashboard:**
```
You Owe: (empty)
Owed To You:
  - Neha owes you ₹300
  - Riya owes you ₹300
```

**Amit's Dashboard:**
```
You Owe: (empty)
Owed To You: (empty)
```

---

## UI Components

### Debt Summary Card

```
┌─────────────────────────────────────┐
│ Debt Summary                        │
│                                     │
│ You Owe                             │
│ ┌─────────────────────────────┐     │
│ │ You owe Rahul        ₹300   │ (Red)
│ └─────────────────────────────┘     │
│ ┌─────────────────────────────┐     │
│ │ You owe Neha         ₹150   │ (Red)
│ └─────────────────────────────┘     │
│                                     │
│ Owed To You                         │
│ ┌─────────────────────────────┐     │
│ │ Amit owes you        ₹200   │ (Green)
│ └─────────────────────────────┘     │
└─────────────────────────────────────┘
```

### Color Coding

- **You Owe**: Red background (#1E1B2E), Red border (#EF4444), Red amount
- **Owed To You**: Green background (#1A2E1E), Green border (#10B981), Green amount

### Hover Effects

- Lift animation: `translateY(-2px)`
- Border color brightens
- Box shadow appears

## Database Queries

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

**Note:** No debt collection exists. All calculations are done in-memory from expenses.

## Security Features

✓ All routes protected with JWT authentication
✓ Only group members can view group debts
✓ Users can only see their own debt summary
✓ Debt calculations based on actual expenses
✓ No manual debt manipulation possible

## Performance Considerations

### Calculation Efficiency

- Debts calculated on-demand (not stored)
- Uses in-memory dictionaries for fast aggregation
- O(n) complexity where n = number of expenses
- Efficient for typical use cases (< 1000 expenses per user)

### Optimization Tips

- Calculations are lightweight
- No database writes for debts
- Results can be cached on frontend
- Refresh on expense creation

## Phase 1-5 Compatibility

✓ All authentication features work
✓ Friends system functional
✓ Groups system functional
✓ Expenses system functional
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

### Issue: Debts not showing
**Solution:** Create some expenses first, debts are calculated from expenses

### Issue: Incorrect debt amounts
**Solution:** Check expense split amounts, verify participants list

### Issue: Debts not updating
**Solution:** Refresh the page or navigate away and back

### Issue: "You are not a member of this group"
**Solution:** Only group members can view group debts

## Example Scenarios

### Scenario 1: Trip Expenses

**Group:** Goa Trip (4 people)

**Expenses:**
1. Hotel: ₹4000 paid by Rahul, split 4 ways = ₹1000 each
2. Food: ₹1200 paid by Amit, split 4 ways = ₹300 each
3. Transport: ₹800 paid by Neha, split 4 ways = ₹200 each

**Debts:**
```
Amit owes Rahul: ₹1000
Amit owes Neha: ₹200
Net: Amit owes Rahul ₹700 (₹1000 - ₹300)

Neha owes Rahul: ₹1000
Neha owes Amit: ₹300
Net: Neha owes Rahul ₹800 (₹1000 - ₹200)

Riya owes Rahul: ₹1000
Riya owes Amit: ₹300
Riya owes Neha: ₹200
Total: Riya owes ₹1500
```

### Scenario 2: Roommate Expenses

**Group:** Roommates (3 people)

**Expenses:**
1. Rent: ₹15000 paid by A, split 3 ways = ₹5000 each
2. Groceries: ₹3000 paid by B, split 3 ways = ₹1000 each
3. Electricity: ₹1500 paid by C, split 3 ways = ₹500 each

**Debts:**
```
B owes A: ₹5000
B owes C: ₹500
Net: B owes A ₹4000 (₹5000 - ₹1000)

C owes A: ₹5000
C owes B: ₹1000
Net: C owes A ₹4500 (₹5000 - ₹500)
```

## Testing with cURL

### Get User Debts
```bash
curl -X GET http://localhost:5000/api/debts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Group Debts
```bash
curl -X GET http://localhost:5000/api/debts/groups/GROUP_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Next Steps (Future Enhancements)

Potential features:
- Settlement tracking (mark debts as paid)
- Debt simplification (minimize transactions)
- Payment reminders
- Debt history
- Export debt reports
- Multi-currency support

## Phase 6 Complete ✓

- ✓ Dynamic debt calculation from expenses
- ✓ No separate debt collection
- ✓ Get user's total debts
- ✓ Get group-specific debts
- ✓ Debt netting algorithm
- ✓ Dashboard debt summary
- ✓ Color-coded debt display
- ✓ JWT authentication on all routes
- ✓ Real-time calculation
- ✓ Phase 1-5 features preserved

**The debt tracking system is now complete!** 🎉
