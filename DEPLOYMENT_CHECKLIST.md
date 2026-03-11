# EasyXpense - Deployment Verification Checklist

## Pre-Deployment Verification

### Backend Configuration ✅

- [x] `.env` file updated with production values
- [x] MONGO_URI set to MongoDB Atlas connection string
- [x] JWT_SECRET set to production secret
- [x] CORS configured with Netlify URL
- [x] All routes prefixed with `/api/`
- [x] Database connection uses `os.getenv('MONGO_URI')`
- [x] JWT config uses `os.getenv('JWT_SECRET')`
- [x] gunicorn added to requirements.txt
- [x] Flask app binds to 0.0.0.0 for Render

### Frontend Configuration ✅

- [x] `.env` file created with VITE_API_URL
- [x] API client uses `import.meta.env.VITE_API_URL`
- [x] netlify.toml created with SPA redirects
- [x] No hardcoded localhost URLs
- [x] Build command: `npm run build`
- [x] Publish directory: `dist`

### Database Configuration ✅

- [x] MongoDB Atlas cluster created
- [x] Database user created (easyXpense)
- [x] Network access: 0.0.0.0/0 (allow all)
- [x] Connection string obtained
- [x] Database name: easyxpense

---

## Render Deployment Steps

### 1. Create Web Service

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect GitHub repository (backend)
4. Configure:
   - **Name**: easyxpense-api
   - **Environment**: Python 3
   - **Region**: Choose closest to users
   - **Branch**: main
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

### 2. Set Environment Variables

In Render Dashboard → Environment:

```
MONGO_URI=mongodb+srv://easyXpense:jagdeep2607@easyxpense.pziespr.mongodb.net/easyxpense?retryWrites=true&w=majority&appName=EasyXpense
JWT_SECRET=9f7a41a6e23b5d890cf45a1c3d9e8f7a
PORT=10000
```

### 3. Deploy

- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Check logs for errors
- Note the URL: https://easyxpense.onrender.com

### 4. Verify Backend

Test health endpoint:
```bash
curl https://easyxpense.onrender.com/api/health
```

Expected: `{"status": "EasyXpense API running"}`

---

## Netlify Deployment Steps

### 1. Create New Site

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository (frontend)
4. Configure:
   - **Branch**: main
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### 2. Set Environment Variables

In Netlify Dashboard → Site settings → Environment variables:

```
VITE_API_URL=https://easyxpense.onrender.com/api
```

### 3. Deploy

- Click "Deploy site"
- Wait for build (2-5 minutes)
- Check build logs for errors
- Note the URL: https://easyxpense.netlify.app

### 4. Verify Frontend

- Visit https://easyxpense.netlify.app
- Check browser console for errors
- Verify API calls work

---

## Post-Deployment Testing

### Test 1: Health Check ✅

**Endpoint**: GET /api/health

```bash
curl https://easyxpense.onrender.com/api/health
```

**Expected Response**:
```json
{"status": "EasyXpense API running"}
```

**Status**: [ ] Pass [ ] Fail

---

### Test 2: User Registration ✅

**Endpoint**: POST /api/auth/register

**Steps**:
1. Visit https://easyxpense.netlify.app
2. Click "Sign Up"
3. Enter:
   - Name: Test User
   - Email: test@production.com
   - Password: TestPass123
4. Click "Sign Up"

**Expected**: Success message, redirect to login

**Status**: [ ] Pass [ ] Fail

---

### Test 3: User Login ✅

**Endpoint**: POST /api/auth/login

**Steps**:
1. On login page, enter:
   - Email: test@production.com
   - Password: TestPass123
2. Click "Login"

**Expected**: 
- JWT token stored in localStorage
- Redirect to dashboard
- Welcome message displayed

**Status**: [ ] Pass [ ] Fail

---

### Test 4: JWT Authentication ✅

**Endpoint**: GET /api/auth/me

**Steps**:
1. After login, check browser console
2. Verify token in localStorage: `easyxpense_token`
3. Dashboard should show user info

**Expected**: User details displayed

**Status**: [ ] Pass [ ] Fail

---

### Test 5: Friends System ✅

**Endpoint**: POST /api/friends/request

**Steps**:
1. Create second user account
2. Login as first user
3. Click "Friends"
4. Send friend request to second user's email
5. Login as second user
6. Accept friend request

**Expected**: Both users see each other as friends

**Status**: [ ] Pass [ ] Fail

---

### Test 6: Groups System ✅

**Endpoint**: POST /api/groups

**Steps**:
1. Login as user
2. Click "Groups"
3. Create group: "Test Group"
4. View group details
5. Add friend to group

**Expected**: Group created, friend added successfully

**Status**: [ ] Pass [ ] Fail

---

### Test 7: Expenses System ✅

**Endpoint**: POST /api/expenses

**Steps**:
1. Login as user
2. Click "Expenses"
3. Select group
4. Create expense:
   - Description: Test Expense
   - Amount: 1000
   - Paid by: Current user
   - Participants: Select all
5. Submit

**Expected**: 
- Expense created
- Split amount calculated
- Expense visible in list

**Status**: [ ] Pass [ ] Fail

---

### Test 8: Debt Tracking ✅

**Endpoint**: GET /api/debts

**Steps**:
1. After creating expense, go to dashboard
2. Check "Debt Summary" section

**Expected**: 
- Debts calculated correctly
- "You Owe" or "Owed To You" displayed
- Amounts match expense splits

**Status**: [ ] Pass [ ] Fail

---

### Test 9: Settlement System ✅

**Endpoint**: POST /api/settlements

**Steps**:
1. If you owe money, click "Settle Debts"
2. Select group
3. Select person to pay
4. Enter amount
5. Click "Settle Payment"

**Expected**:
- Settlement recorded
- Debt reduced
- Settlement in history

**Status**: [ ] Pass [ ] Fail

---

### Test 10: Analytics ✅

**Endpoint**: GET /api/analytics

**Steps**:
1. Create multiple expenses
2. Check if analytics endpoint works

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://easyxpense.onrender.com/api/analytics
```

**Expected**: Statistics returned

**Status**: [ ] Pass [ ] Fail

---

## Browser Compatibility Testing

### Desktop Browsers

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers

- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet

---

## Performance Testing

### Backend Response Times

- [ ] Health check: < 200ms
- [ ] Login: < 500ms
- [ ] Get expenses: < 1s
- [ ] Create expense: < 1s

### Frontend Load Times

- [ ] Initial load: < 3s
- [ ] Page navigation: < 500ms
- [ ] API calls: < 2s

---

## Security Testing

### Authentication

- [ ] Cannot access protected routes without token
- [ ] Invalid token returns 401
- [ ] Expired token returns 401
- [ ] Token refresh works

### Authorization

- [ ] Users can only see their own data
- [ ] Cannot access other users' groups
- [ ] Cannot modify other users' expenses

### Data Validation

- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] CSRF protection enabled
- [ ] Input validation working

---

## Error Handling Testing

### Backend Errors

- [ ] 400 for bad requests
- [ ] 401 for unauthorized
- [ ] 403 for forbidden
- [ ] 404 for not found
- [ ] 500 for server errors

### Frontend Errors

- [ ] Network errors displayed
- [ ] Validation errors shown
- [ ] Success messages displayed
- [ ] Loading states working

---

## Monitoring Setup

### Render Monitoring

- [ ] Logs accessible
- [ ] Metrics visible
- [ ] Alerts configured
- [ ] Health checks enabled

### Netlify Monitoring

- [ ] Deploy logs accessible
- [ ] Build status visible
- [ ] Analytics enabled
- [ ] Error tracking setup

### MongoDB Atlas Monitoring

- [ ] Connection metrics visible
- [ ] Query performance tracked
- [ ] Storage usage monitored
- [ ] Alerts configured

---

## Rollback Plan

### If Deployment Fails

1. **Backend Issues**:
   - Check Render logs
   - Verify environment variables
   - Test MongoDB connection
   - Rollback to previous deployment

2. **Frontend Issues**:
   - Check Netlify build logs
   - Verify environment variables
   - Test API connectivity
   - Rollback to previous deployment

3. **Database Issues**:
   - Check MongoDB Atlas status
   - Verify connection string
   - Check network access
   - Restore from backup if needed

---

## Final Verification

### All Systems Operational

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Database connected and working
- [ ] All features tested and working
- [ ] No console errors
- [ ] No network errors
- [ ] Performance acceptable
- [ ] Security measures in place

---

## Sign-Off

**Deployment Date**: _______________

**Deployed By**: _______________

**Backend URL**: https://easyxpense.onrender.com

**Frontend URL**: https://easyxpense.netlify.app

**Status**: [ ] Production Ready [ ] Issues Found

**Notes**:
_______________________________________
_______________________________________
_______________________________________

---

## 🎉 Deployment Complete!

Your EasyXpense application is now live and accessible at:

**https://easyxpense.netlify.app**

All systems are configured and ready for production use!
