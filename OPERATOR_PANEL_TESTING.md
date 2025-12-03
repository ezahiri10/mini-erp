# 🧪 Operator Panel - Quick Testing Guide

## Prerequisites
1. Backend running on `http://localhost:4000`
2. Frontend running on `http://localhost:3000`
3. PostgreSQL database connected
4. At least one operator user created with role `OPERATOR`

## Setting Up Test Data

### 1. Create Test Operator (via Admin or SQL)
```sql
INSERT INTO "User" (id, name, email, password, role, status, "createdAt")
VALUES (
  'operator-test-id',
  'John Operator',
  'operator@test.com',
  'hashed_password',
  'OPERATOR',
  'active',
  NOW()
);
```

### 2. Create Test Leads
```sql
INSERT INTO "Lead" (id, name, email, phone, status, "assignedTo", "createdAt")
VALUES
  ('lead-1', 'Alice Johnson', 'alice@example.com', '555-0001', 'NEW', 'operator-test-id', NOW()),
  ('lead-2', 'Bob Smith', 'bob@example.com', '555-0002', 'CONTACTED', 'operator-test-id', NOW());
```

### 3. Create Test Clients
```sql
INSERT INTO "User" (id, name, email, password, role, status, "createdAt")
VALUES
  ('client-1', 'ABC Corporation', 'info@abc.com', 'pwd', 'CLIENT', 'active', NOW()),
  ('client-2', 'XYZ Industries', 'info@xyz.com', 'pwd', 'CLIENT', 'active', NOW());
```

### 4. Create Test Claims
```sql
INSERT INTO "Claim" (id, title, description, status, "assignedTo", "clientId", "createdAt")
VALUES
  ('claim-1', 'Damage Claim #001', 'Roof damage from storm', 'SUBMITTED', 'operator-test-id', 'client-1', NOW()),
  ('claim-2', 'Insurance Claim #002', 'Vehicle accident', 'IN_REVIEW', 'operator-test-id', 'client-2', NOW());
```

### 5. Add Test Comments
```sql
INSERT INTO "Comment" (id, text, "authorId", "leadId", "claimId", "createdAt")
VALUES
  ('comment-1', 'Initial contact made', 'operator-test-id', 'lead-1', NULL, NOW()),
  ('comment-2', 'Awaiting additional documentation', 'operator-test-id', NULL, 'claim-2', NOW());
```

## Testing Workflow

### 1. Login
- Go to `http://localhost:3000/login`
- Use operator credentials (email: `operator@test.com`, password: your_password)
- Verify token is stored in localStorage

### 2. Test Dashboard (`/operator/dashboard`)
✅ **Should see:**
- Total Leads: 2
- Total Claims: 2
- Total Clients: 2
- Claims breakdown by status
- Quick action buttons

### 3. Test Leads Page (`/operator/leads`)
✅ **Should see:**
- Table with 2 leads
- Columns: Name, Email, Phone, Status, Created
- Status filter dropdown
- Pagination controls (if > 10 items)

**Test Status Filter:**
- Select "NEW" → Should show only `lead-1`
- Select "CONTACTED" → Should show only `lead-2`
- Select "All Status" → Should show both

### 4. Test Lead Detail (`/operator/leads/lead-1`)
✅ **Should see:**
- Lead name and email
- Phone number
- Status badge (NEW)
- Notes field
- Created date
- Comments section
- "Update Status" button

**Test Update Status:**
1. Click "Update Status"
2. Select "CONTACTED" from dropdown
3. Click "Confirm"
4. Page should refresh
5. Status should change to "CONTACTED"

**Test Add Comment:**
1. Scroll to "Add Comment" section
2. Type: "Following up with customer"
3. Click "Add Comment"
4. Comment should appear in Comments section immediately

### 5. Test Claims Page (`/operator/claims`)
✅ **Should see:**
- Table with 2 claims
- Columns: Title, Client, Status, Comments, Created
- Status filter dropdown

**Test Status Filter:**
- Select "SUBMITTED" → Shows `claim-1` only
- Select "IN_REVIEW" → Shows `claim-2` only

### 6. Test Claim Detail (`/operator/claims/claim-2`)
✅ **Should see:**
- Claim title and description
- Client name and email
- Status badge (IN_REVIEW)
- Claim Progress timeline showing: SUBMITTED → **IN_REVIEW** ← RESOLVED
- Comments section
- Quick Info sidebar showing: 1 comment, 0 files

**Test Claim Progress:**
- For `claim-1` (SUBMITTED): Timeline shows SUBMITTED as current
- For `claim-2` (IN_REVIEW): Timeline shows IN_REVIEW as current

**Test Update Status:**
1. Click "Update Status"
2. Change from "IN_REVIEW" to "RESOLVED"
3. Confirm
4. Progress timeline should update
5. Status badge should change

### 7. Test Clients Page (`/operator/clients`)
✅ **Should see:**
- Table with 2 clients
- Columns: Name, Email, Status, Created
- Both clients listed

### 8. Test Client Detail (`/operator/clients/client-1`)
✅ **Should see:**
- Client name and email
- Status badge
- Associated Claims table
- Should show `claim-1` (assigned to this client)

---

## API Endpoint Testing (Using Postman/cURL)

### Get Leads List
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/operator/leads?page=1&limit=10
```

**Expected Response:**
```json
{
  "leads": [...],
  "pagination": { "total": 2, "page": 1, "limit": 10, "pages": 1 }
}
```

### Get Lead Detail
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/operator/leads/lead-1
```

### Update Lead Status
```bash
curl -X PATCH \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"CONVERTED"}' \
  http://localhost:4000/api/operator/leads/lead-1/status
```

### Add Lead Comment
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Customer very interested"}' \
  http://localhost:4000/api/operator/leads/lead-1/comments
```

### Get Claims List
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/operator/claims?page=1&limit=10
```

### Get Claim Detail
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/operator/claims/claim-1
```

### Update Claim Status
```bash
curl -X PATCH \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"RESOLVED"}' \
  http://localhost:4000/api/operator/claims/claim-1/status
```

### Add Claim Comment
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Documentation received and verified"}' \
  http://localhost:4000/api/operator/claims/claim-1/comments
```

### Get Dashboard Stats
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/operator/dashboard
```

---

## Error Scenarios to Test

### 1. Unauthorized Access (No Token)
```bash
curl http://localhost:4000/api/operator/leads
# Expected: 401 Unauthorized
```

### 2. Non-Operator User
- Create a CLIENT or ADMIN user
- Try accessing `/operator/leads`
- Expected: 403 Forbidden

### 3. Access Another Operator's Resources
- Try accessing a lead assigned to different operator
- Expected: 403 Forbidden

### 4. Invalid Resource ID
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/operator/leads/invalid-id
# Expected: 404 Not Found
```

### 5. Empty Comment
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":""}' \
  http://localhost:4000/api/operator/claims/claim-1/comments
# Expected: 400 Bad Request
```

---

## Performance Testing

### Load Test: Fetch 100 Leads
```bash
for i in {1..100}; do
  curl -H "Authorization: Bearer YOUR_TOKEN" \
    http://localhost:4000/api/operator/leads?page=1 &
done
```

Monitor response times in browser DevTools.

### Pagination Test
1. Visit `/operator/leads`
2. Test next/previous buttons
3. Verify correct data for each page

---

## UI/UX Checklist

- [ ] Dark mode theme applied correctly
- [ ] All buttons are clickable and responsive
- [ ] Loading spinners show during data fetching
- [ ] Error messages are visible and helpful
- [ ] Empty states show appropriate messages
- [ ] Tables are responsive
- [ ] Comments display with author names and dates
- [ ] Status badges have correct colors
- [ ] Pagination controls work correctly
- [ ] Back buttons navigate correctly
- [ ] Forms have proper validation

---

## Browser DevTools Checks

### Network Tab
- Verify all API calls include `Authorization` header
- Check response status codes (200, 201, 401, 403, 404)
- Verify response data matches expected schema

### Console Tab
- No JavaScript errors
- No CORS errors
- Auth errors logged appropriately

### Application Tab
- Token stored in `localStorage`
- Token updates after actions
- No sensitive data exposed

---

## Final Checklist

✅ Backend API responds correctly  
✅ Frontend loads without errors  
✅ Authentication works  
✅ Authorization enforced  
✅ All CRUD operations work  
✅ Pagination functions correctly  
✅ Comments feature works  
✅ Status updates persist  
✅ UI is responsive  
✅ Error handling is graceful  

---

**Last Updated:** December 3, 2025  
**Status:** Ready for Testing
