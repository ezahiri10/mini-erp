# Client Portal - Quick Reference Card

## 🔐 Authentication
```typescript
// Login Hook Usage
const { login, logout, getToken, getUser } = useClientLogin();

// Login
const result = await login(email, password);
// Returns: { token, user: {id, name, email, role} }

// Get data
const token = getToken(); // "client_xxx_timestamp"
const user = getUser();   // {id, name, email, role}

// Logout
logout();  // Clears storage & redirects
```

---

## 📋 Claims Management

### Fetch Claims
```typescript
const { claims, pagination, loading, error, refetch } = useClientClaims(
  page = 1,
  status = undefined  // "SUBMITTED" | "IN_REVIEW" | "RESOLVED"
);

// Returns:
// claims: [{id, title, description, status, createdAt, assignedUser}]
// pagination: {total, page, limit, pages}
```

### Fetch Single Claim
```typescript
const { claim, loading, error, refetch, addComment } = useClientClaim(claimId);

// Returns: {id, title, description, status, files[], comments[], assignedUser}

// Add comment
await addComment("Comment text");
```

### Create Claim
```typescript
const { createClaim, loading, error } = useCreateClaim();

const newClaim = await createClaim(title, description);
// Returns: {id, title, description, status: "SUBMITTED", createdAt}
```

---

## 📁 File Upload

### Upload Files
```typescript
const { uploadFiles, loading, error, progress } = useUploadFiles();

const files = [file1, file2, file3];  // Max 10 files, 10MB each
const result = await uploadFiles(claimId, files);

// Returns: {message, claim: {..., files: [paths]}, uploadedFiles: [paths]}

// Track progress
console.log(progress);  // 0-100
```

### Allowed File Types
- **Documents**: PDF, DOC, DOCX, XLS, XLSX
- **Images**: JPG, JPEG, PNG, GIF
- **Limits**: 10MB per file, max 10 files

---

## 🛍️ Products

### Fetch Products
```typescript
const { products, pagination, loading, error, refetch } = useClientProducts(page = 1);

// Returns:
// products: [{id, name, type, price, description, createdAt}]
// pagination: {total, page, limit, pages}
```

---

## 📊 Dashboard

### Get Statistics
```typescript
// GET /api/client/dashboard
const response = await fetch('/api/client/dashboard', {
  headers: { Authorization: `Bearer ${token}` }
});

// Returns: {
//   totalClaims: number,
//   totalProducts: number,
//   claimsByStatus: { SUBMITTED: n, IN_REVIEW: n, RESOLVED: n }
// }
```

---

## 🌐 API Endpoints

### Public
```
POST /api/client/login
  Params: {email, password}
  Returns: {token, user}
```

### Protected (Requires JWT)
```
GET    /api/client/dashboard
GET    /api/client/claims?page=1&limit=10&status=SUBMITTED
POST   /api/client/claims {title, description}
GET    /api/client/claims/:id
POST   /api/client/claims/:id/upload [FormData: files]
POST   /api/client/claims/:id/comments {text}
GET    /api/client/products?page=1&limit=10
GET    /api/client/products/:id
```

---

## 📄 Claim Status Values

| Status | Color | Meaning |
|--------|-------|---------|
| SUBMITTED | Yellow | Just created, waiting review |
| IN_REVIEW | Blue | Being reviewed by team |
| RESOLVED | Green | Issue resolved |

---

## 🎨 Page Paths

| Page | Path | Purpose |
|------|------|---------|
| Login | `/client/login` | Authenticate |
| Dashboard | `/client/dashboard` | Stats overview |
| Claims | `/client/claims` | List all claims |
| New Claim | `/client/claims/new` | Create claim |
| Claim Details | `/client/claims/[id]` | View/manage claim |
| Products | `/client/products` | Browse products |

---

## 🪝 Hooks File Locations

| Hook | File |
|------|------|
| useClientLogin | `client/hooks/useClientLogin.ts` |
| useClientClaims | `client/hooks/useClientClaims.ts` |
| useClientClaim | `client/hooks/useClientClaim.ts` |
| useCreateClaim | `client/hooks/useCreateClaim.ts` |
| useUploadFiles | `client/hooks/useUploadFiles.ts` |
| useClientProducts | `client/hooks/useClientProducts.ts` |

---

## 📦 Backend Files

| File | Purpose |
|------|---------|
| `src/middlewares/clientMiddleware.ts` | JWT & role check |
| `src/controllers/clientController.ts` | Business logic (9 handlers) |
| `src/routes/clientRoutes.ts` | Endpoint definitions |
| `src/utils/multer.ts` | File upload config |
| `src/app.ts` | Route registration |

---

## 📄 Frontend Files

| File | Lines | Purpose |
|------|-------|---------|
| `client/login/page.tsx` | 75 | Auth form |
| `client/dashboard/page.tsx` | 160 | Stats overview |
| `client/claims/page.tsx` | 170 | Claims list |
| `client/claims/new/page.tsx` | 170 | Create form |
| `client/claims/[id]/page.tsx` | 280 | Details view |
| `client/products/page.tsx` | 200 | Products grid |

---

## 🔒 Security Checklist

- [x] JWT validation on all protected routes
- [x] CLIENT role enforcement
- [x] Ownership verification (clientId check)
- [x] File type validation
- [x] File size limits (10MB)
- [x] CORS configured
- [x] Error messages don't leak data

---

## 🧪 Common Test Cases

### 1. Login
```bash
curl -X POST http://localhost:3001/api/client/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@test.com","password":"pass123"}'
```

### 2. Create Claim
```bash
curl -X POST http://localhost:3001/api/client/claims \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test claim"}'
```

### 3. Upload Files
```bash
curl -X POST http://localhost:3001/api/client/claims/CLAIM_ID/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "files=@file1.pdf" \
  -F "files=@file2.jpg"
```

### 4. Get Claims
```bash
curl http://localhost:3001/api/client/claims \
  -H "Authorization: Bearer TOKEN"
```

---

## 🐛 Debugging Tips

### Check Token Storage
```javascript
// In browser console
localStorage.getItem('clientToken');
JSON.parse(localStorage.getItem('clientUser'));
```

### Monitor API Calls
```javascript
// Network tab in DevTools
// Look for /api/client/* requests
// Check Authorization header
// Verify response status
```

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | No token | Login first |
| 403 Forbidden | Not CLIENT role | Use CLIENT account |
| 404 Not Found | Wrong endpoint | Check path |
| 500 Server Error | Backend issue | Check server logs |

---

## ⚡ Performance Tips

- Claims load in < 1s (with pagination)
- Products paginated (10 per page)
- Comments load with claim
- File validation instant
- Pagination prevents loading all data

---

## 📚 Documentation

- **Full Guide**: CLIENT_PORTAL_IMPLEMENTATION.md
- **Quick Start**: CLIENT_PORTAL_QUICK_START.md
- **Summary**: CLIENT_PORTAL_DELIVERY_SUMMARY.md
- **This Card**: CLIENT_PORTAL_REFERENCE_CARD.md

---

## 🎯 Feature Checklist

- [x] Login/Logout
- [x] Dashboard stats
- [x] Create claims
- [x] Upload files
- [x] View claims
- [x] Add comments
- [x] View products
- [x] Pagination
- [x] Filtering
- [x] Responsive design
- [x] Error handling
- [x] Loading states

---

## 🚀 Getting Started

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (in another terminal)
cd fronend && npm install && npm run dev

# Visit
http://localhost:3000/client/login
```

---

## 📞 Quick Help

### Can't Login?
- Check email/password
- Verify CLIENT role in database
- Ensure backend running on :3001

### Claims Not Loading?
- Verify token in localStorage
- Check browser network tab
- Create a claim first

### File Upload Failing?
- Check file size (< 10MB)
- Verify file type supported
- Check /uploads directory exists

---

**Version**: 1.0.0 | **Status**: Production Ready | **Last Updated**: 2024
