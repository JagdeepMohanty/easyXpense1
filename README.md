# EasyXpense - Full-Stack Expense Tracking Application

A complete full-stack expense tracking application with React frontend, Flask backend, and MongoDB database.

## Current Status: Phase 7 Complete ✓ - Production Ready!

### Phase 1 - Foundation ✓
- Flask backend with CORS
- MongoDB connection
- React frontend with Vite
- Health check API
- Dark theme UI

### Phase 2 - Authentication ✓
- User registration
- User login with JWT
- Password hashing (bcrypt)
- Protected routes
- Token management
- Login/Signup pages

### Phase 3 - Friends System ✓
- Send friend requests
- Accept friend requests
- View friends list
- View pending requests
- Prevent duplicate requests
- Friends page UI

### Phase 4 - Groups System ✓
- Create groups
- View groups
- View group details
- Add members to groups
- Groups page UI

### Phase 5 - Expenses System ✓
- Create expenses
- Equal split calculation
- Track who paid
- View group expenses
- View user expenses
- Expenses page UI

### Phase 6 - Debt Tracking ✓
- Automatic debt calculation
- Dynamic calculation from expenses
- Debt netting
- View user debts
- View group debts
- Dashboard debt summary

### Phase 7 - Settlement + Deployment ✓
- Debt settlement system
- Settlement history tracking
- Analytics endpoint
- Production deployment ready
- Render + Netlify configuration
- MongoDB Atlas integration

## Project Structure

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
│   │   └── expenses.py
│   │
│   ├── models/
│   │   ├── user_model.py
│   │   ├── friend_model.py
│   │   ├── group_model.py
│   │   └── expense_model.py
│   │
│   ├── middleware/
│   │   └── auth_middleware.py
│   │
│   ├── config/
│   │   └── config.py
│   │
│   ├── app.py
│   ├── requirements.txt
│   ├── .env
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Friends.jsx
    │   │   ├── Groups.jsx
    │   │   └── Expenses.jsx
    │   │
    │   ├── components/
    │   │   └── Card.jsx
    │   │
    │   ├── services/
    │   │   └── api.js
    │   │
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── styles.css
    │
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (running locally on port 27017)

## Setup Instructions

### 1. Install MongoDB

Make sure MongoDB is installed and running on `mongodb://localhost:27017`

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend will run on: **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: **http://localhost:3000**

## Testing the Application

### Phase 1 - Health Check
1. Open your browser and navigate to `http://localhost:3000`
2. You should see the EasyXpense title
3. The page will display "Backend Status: EasyXpense API running"

### Phase 2 - Authentication
1. Click "Sign Up" to create a new account
2. Fill in name, email, and password
3. After registration, login with your credentials
4. Home page will show "Welcome, [Your Name]!"
5. Click "Logout" to sign out

### Phase 3 - Friends System
1. Login with your account
2. Click "Friends" button on home page
3. Enter a friend's email and click "Send Request"
4. Login as the friend to see pending request
5. Click "Accept" to become friends
6. Both users will see each other in friends list

### Phase 4 - Groups System
1. Login with your account
2. Click "Groups" button on home page
3. Create a group with a name
4. Click "View" to see group details
5. Add friends to the group by email
6. All group members can see the group

### Phase 5 - Expenses System
1. Login with your account
2. Click "Expenses" button on home page
3. Select a group from dropdown
4. Enter expense details (description, amount)
5. Select who paid and participants
6. View split amount per person
7. See expenses in group and your expenses list

## API Endpoints

### Health Check
- **GET** `/api/health`
- Response: `{"status": "EasyXpense API running"}`

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/me` - Get current user (protected)

### Friends
- **POST** `/api/friends/request` - Send friend request (protected)
- **POST** `/api/friends/accept` - Accept friend request (protected)
- **GET** `/api/friends` - Get friends list (protected)
- **GET** `/api/friends/requests/pending` - Get pending requests (protected)

### Groups
- **POST** `/api/groups` - Create group (protected)
- **GET** `/api/groups` - Get user's groups (protected)
- **GET** `/api/groups/:id` - Get group details (protected)
- **POST** `/api/groups/:id/members` - Add member to group (protected)

### Expenses
- **POST** `/api/expenses` - Create expense (protected)
- **GET** `/api/expenses` - Get user's expenses (protected)
- **GET** `/api/expenses/groups/:id` - Get group expenses (protected)

### Debts
- **GET** `/api/debts` - Get user's debts (protected)
- **GET** `/api/debts/groups/:id` - Get group debts (protected)

### Settlements
- **POST** `/api/settlements` - Settle debt (protected)
- **GET** `/api/settlements` - Get user's settlements (protected)
- **GET** `/api/settlements/groups/:id` - Get group settlements (protected)

### Analytics
- **GET** `/api/analytics` - Get user analytics (protected)

## Technology Stack

### Backend
- Flask 3.0.0
- Flask-CORS 4.0.0
- PyMongo 4.6.1
- PyJWT 2.8.0
- Python-dotenv 1.0.0
- bcrypt 4.1.2
- Gunicorn 21.2.0 (Production)

### Frontend
- React 18.2.0
- Vite 5.0.8
- React Router DOM 6.20.0
- Axios 1.6.2

## Environment Variables

Backend `.env` file:
```
MONGO_URI=mongodb://localhost:27017/easyxpense
JWT_SECRET=supersecretkey
PORT=5000
```

## Color Theme

- Background: #020617
- Card: #0F172A
- Primary: #10B981
- Accent: #34D399
- Text: #E2E8F0
- Secondary Text: #94A3B8

## Phase 1 Complete ✓

- ✓ Flask backend with CORS enabled
- ✓ MongoDB connection setup
- ✓ JWT configuration
- ✓ Health check API endpoint
- ✓ React frontend with Vite
- ✓ React Router setup
- ✓ Axios API client
- ✓ Frontend successfully calls backend
- ✓ Dark theme UI with internal CSS
- ✓ Reusable Card component

## Phase 2 Complete ✓

- ✓ User registration with bcrypt
- ✓ User login with JWT tokens
- ✓ Protected routes middleware
- ✓ Token-based authentication
- ✓ Login/Signup pages
- ✓ User dashboard
- ✓ Logout functionality
- ✓ Automatic token management
- ✓ Form validation and error handling

## Phase 3 Complete ✓

- ✓ Send friend requests by email
- ✓ Accept friend requests
- ✓ View friends list
- ✓ View pending requests
- ✓ Prevent duplicate requests
- ✓ Prevent self-friending
- ✓ Friends page UI
- ✓ Navigation integration
- ✓ Real-time updates

## Phase 4 Complete ✓

- ✓ Create groups
- ✓ View user's groups
- ✓ View group details with members
- ✓ Add members to groups
- ✓ Validate friendship before adding
- ✓ Groups page UI
- ✓ Navigation integration
- ✓ Real-time updates

## Phase 5 Complete ✓

- ✓ Create expenses in groups
- ✓ Equal split calculation
- ✓ Track who paid the expense
- ✓ Track participants
- ✓ View group expenses
- ✓ View user expenses
- ✓ Expenses page UI
- ✓ Navigation integration
- ✓ Real-time updates

## Phase 6 Complete ✓

- ✓ Automatic debt calculation from expenses
- ✓ Dynamic calculation (no debt collection)
- ✓ Debt netting algorithm
- ✓ View user's total debts
- ✓ View group-specific debts
- ✓ Dashboard debt summary
- ✓ Color-coded debt display
- ✓ Real-time updates

## Phase 7 Complete ✓

- ✓ Debt settlement system
- ✓ Record payments between users
- ✓ Settlement history tracking
- ✓ Debt calculations updated with settlements
- ✓ Analytics endpoint
- ✓ Production deployment configuration
- ✓ Gunicorn for production
- ✓ Render deployment ready
- ✓ Netlify deployment ready
- ✓ MongoDB Atlas integration

## Deployment

The application is production-ready and can be deployed to:

- **Backend**: Render (https://render.com)
- **Frontend**: Netlify (https://netlify.com)
- **Database**: MongoDB Atlas (https://mongodb.com/cloud/atlas)

See `DEPLOYMENT.md` for detailed deployment instructions.

## Documentation

- `README.md` - Main project documentation
- `PHASE2_AUTH.md` - Detailed Phase 2 authentication guide
- `PHASE3_FRIENDS.md` - Detailed Phase 3 friends system guide
- `PHASE4_GROUPS.md` - Detailed Phase 4 groups system guide
- `PHASE5_EXPENSES.md` - Detailed Phase 5 expenses system guide
- `PHASE6_DEBTS.md` - Detailed Phase 6 debt tracking guide
- `PHASE7_SETTLEMENT.md` - Detailed Phase 7 settlement + deployment guide
- `DEPLOYMENT.md` - Complete deployment guide for production
- `QUICKSTART.md` - Quick start guide
