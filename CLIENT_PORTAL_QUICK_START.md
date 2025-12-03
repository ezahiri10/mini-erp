# Client Portal - Quick Start Guide

## 🚀 10-Minute Setup

### Backend (5 minutes)

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Start server (assumes DB is configured)
npm run dev
```

**Verify**: Open http://localhost:3001/api/client/login (should show 405 or error)

### Frontend (5 minutes)

```bash
cd fronend

# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

**Verify**: Open http://localhost:3000/client/login

---

## 🔐 Quick Login Test

### Option 1: Using Existing Client User
```
Email: [your-client-email]@example.com
Password: [your-client-password]
```

### Option 2: Create Test User (SQL)
```sql
-- Create a test CLIENT user
INSERT INTO "User" (id, email, password, name, role, createdAt, updatedAt)
VALUES (
  gen_random_uuid(),
  'testclient@example.com',
  'TestPassword123!',
  'Test Client User',
  'CLIENT',
  NOW(),
  NOW()
);
```

---

## 📱 Test All Features (15 minutes)

### 1. Login & Dashboard (2 min)
- [ ] Go to http://localhost:3000/client/login
- [ ] Enter credentials and click "Login"
- [ ] Verify redirect to dashboard
- [ ] Check stats cards load correctly

### 2. View Claims (3 min)
- [ ] Click "View Claims" from dashboard
- [ ] Verify claims list displays
- [ ] Test status filters (ALL, SUBMITTED, IN_REVIEW, RESOLVED)
- [ ] Click on a claim to view details

### 3. Create Claim (5 min)
- [ ] Click "New Claim" button
- [ ] Fill in title and description
- [ ] Upload 1-2 test files
- [ ] Submit claim
- [ ] Verify success message
- [ ] Check claim appears in list

### 4. Manage Claim (3 min)
- [ ] Open claim details page
- [ ] View files and metadata
- [ ] Add a test comment
- [ ] Verify comment appears

### 5. Browse Products (2 min)
- [ ] Navigate to Products page
- [ ] Verify product grid displays
- [ ] Test pagination if available
- [ ] Check product information displays

---

## 🛠️ Common Issues & Solutions

### Issue: Login Returns 401
**Solution**: 
- Verify email/password are correct
- Check user has CLIENT role in database
- Ensure backend is running on port 3001

### Issue: Claims Page Shows Empty
**Solution**:
- Create a claim first via "/claims/new" form
- Verify token is being sent (check browser console)
- Check backend logs for errors

### Issue: File Upload Fails
**Solution**:
- Check file size (max 10MB)
- Verify file type is allowed (PDF, images, docs)
- Check `/uploads` directory exists on backend

### Issue: CORS Errors
**Solution**:
- Ensure backend CORS is configured for http://localhost:3000
- Check app.ts CORS settings
- Restart backend server

---

## 📊 What Gets Tested

| Feature | Location | Test |
|---------|----------|------|
| Login | /client/login | POST /api/client/login |
| Dashboard | /client/dashboard | GET /api/client/dashboard |
| Claims List | /client/claims | GET /api/client/claims |
| Create Claim | /client/claims/new | POST /api/client/claims |
| Upload Files | /client/claims/[id] | POST /api/client/claims/:id/upload |
| Add Comments | /client/claims/[id] | POST /api/client/claims/:id/comments |
| View Products | /client/products | GET /api/client/products |

---

## 🔍 Browser DevTools Checks

### Network Tab
- [ ] Login request returns token
- [ ] Dashboard fetches stats successfully
- [ ] Claims endpoints return data
- [ ] File uploads show FormData in request
- [ ] No 401/403 errors after login

### Console Tab
- [ ] No TypeScript/React errors
- [ ] No CORS warnings
- [ ] Authentication errors logged clearly
- [ ] Network errors show helpful messages

### Application Tab (Storage)
- [ ] `clientToken` stored in localStorage
- [ ] `clientUser` contains user JSON
- [ ] Tokens persist across page refresh

---

## ⚡ Performance Tips

### Frontend Optimization
- Pages load in <1s (excluding API calls)
- Claim list pagination prevents loading all claims
- Hooks use proper dependency arrays to avoid re-renders

### Backend Optimization
- Database queries include proper indexes
- Pagination limits results (max 10 items)
- File uploads use proper MIME type validation

---

## 🎯 Success Criteria

✅ **Complete When**:
1. Login works with valid credentials
2. Dashboard shows correct stats
3. Can create new claim
4. Can upload files
5. Can add comments to claim
6. Can view products list
7. Pagination works
8. Filters/search work
9. Logout redirects to login
10. No errors in browser console

---

## 📞 Quick Reference

### Ports
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Database**: Configured in `.env`

### Key Endpoints (Backend)
```
POST   /api/client/login                    # 401 if invalid credentials
GET    /api/client/dashboard                # 401 if no token
GET    /api/client/claims                   # 401 if no token
POST   /api/client/claims                   # Create new claim
POST   /api/client/claims/:id/upload        # Upload files
POST   /api/client/claims/:id/comments      # Add comment
GET    /api/client/products                 # List products
```

### Key Pages (Frontend)
```
/client/login                     # Login form
/client/dashboard                 # Main dashboard
/client/claims                    # Claims list
/client/claims/new                # Create claim form
/client/claims/[id]               # Claim details
/client/products                  # Products listing
```

---

## 📚 Documentation Files

- **Full Implementation**: CLIENT_PORTAL_IMPLEMENTATION.md
- **Backend API**: backend/API_SPECIFICATION.md
- **Operator Panel Fixes**: OPERATOR_PANEL_FIXES_SUMMARY.md
- **Admin Panel**: ADMIN_PANEL_SUMMARY.md

---

**Status**: ✅ Ready for Testing
**Estimated Time**: 30-45 minutes for complete workflow
**Next Steps**: Run through test workflow above and report any issues
