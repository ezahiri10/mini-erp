# Client Portal - Complete Implementation Guide

## 🎯 Overview

The Client Portal is a comprehensive full-stack system enabling CLIENT role users to manage their claims, view products, and interact with the support system. Built with Next.js 14 (frontend), Express + Prisma (backend), and PostgreSQL database.

**Status**: ✅ **FULLY IMPLEMENTED** - Backend & Frontend complete, ready for testing

---

## 📁 Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── middlewares/
│   │   └── clientMiddleware.ts        ✅ JWT validation + CLIENT role check
│   ├── controllers/
│   │   └── clientController.ts        ✅ 9 endpoint handlers
│   ├── routes/
│   │   └── clientRoutes.ts            ✅ API route definitions
│   ├── utils/
│   │   └── multer.ts                  ✅ File upload configuration
│   └── app.ts                         ✅ Routes registered at /api/client
```

### Frontend Structure
```
fronend/app/client/
├── layout.tsx                         ✅ Client portal wrapper
├── login/
│   └── page.tsx                       ✅ Authentication form
├── dashboard/
│   └── page.tsx                       ✅ Stats overview
├── claims/
│   ├── page.tsx                       ✅ Claims list with filters
│   ├── new/
│   │   └── page.tsx                   ✅ Create claim form
│   └── [id]/
│       └── page.tsx                   ✅ Claim details + comments
├── products/
│   └── page.tsx                       ✅ Products & services listing
└── hooks/
    ├── index.ts                       ✅ Hook exports
    ├── useClientLogin.ts              ✅ Authentication hook
    ├── useClientClaims.ts             ✅ Claims list hook
    ├── useClientClaim.ts              ✅ Single claim hook
    ├── useCreateClaim.ts              ✅ Create claim hook
    ├── useUploadFiles.ts              ✅ File upload hook
    └── useClientProducts.ts           ✅ Products hook
```

---

## 🔑 Key Features

### 1. Authentication
- **POST /api/client/login** - Client login endpoint
- JWT token generation and storage
- CLIENT role enforcement
- Automatic redirect to login if unauthorized

### 2. Claims Management
- **GET /api/client/claims** - List claims with pagination & filtering
- **GET /api/client/claims/:id** - Fetch single claim details
- **POST /api/client/claims** - Create new claim
- **POST /api/client/claims/:id/upload** - Upload files to claim
- **POST /api/client/claims/:id/comments** - Add comments

### 3. Products Listing
- **GET /api/client/products** - List available products
- **GET /api/client/products/:id** - Single product details

### 4. Dashboard
- **GET /api/client/dashboard** - Statistics overview
- Total claims count
- Status breakdown (SUBMITTED, IN_REVIEW, RESOLVED)
- Product count

---

## 🎨 Frontend Pages

### 1. Login Page (`/client/login`)
**Purpose**: Authenticate CLIENT users
**Features**:
- Email/password form
- Error messaging
- Auto-redirect to dashboard on success
- Demo credentials display

**File**: `/fronend/app/client/login/page.tsx`

### 2. Dashboard Page (`/client/dashboard`)
**Purpose**: Overview and quick actions
**Features**:
- Statistics cards (total claims, submitted, resolved)
- Quick navigation links
- Logout button
- Responsive grid layout

**File**: `/fronend/app/client/dashboard/page.tsx`

### 3. Claims List Page (`/client/claims`)
**Purpose**: View and manage all claims
**Features**:
- Paginated list view
- Status filters (ALL, SUBMITTED, IN_REVIEW, RESOLVED)
- Status-colored badges
- Date information
- Empty state messaging
- New claim button

**File**: `/fronend/app/client/claims/page.tsx`

### 4. New Claim Form Page (`/client/claims/new`)
**Purpose**: Submit new claims
**Features**:
- Title and description inputs
- Multi-file upload with drag-and-drop
- File validation and sizing
- Form submission with loading state
- Success feedback
- Validation requirements

**File**: `/fronend/app/client/claims/new/page.tsx`

### 5. Claim Details Page (`/client/claims/[id]`)
**Purpose**: View claim details and interact
**Features**:
- Full claim information display
- Status badge with color coding
- Attached files with download links
- Comments section with threading
- Add new comment form
- Claim metadata (created, updated, assigned user)
- Responsive sidebar layout

**File**: `/fronend/app/client/claims/[id]/page.tsx`

### 6. Products Page (`/client/products`)
**Purpose**: Browse available products
**Features**:
- Grid layout for product cards
- Product information (name, type, price, description)
- Type badges with color coding
- Pagination controls
- Empty state messaging
- View details button

**File**: `/fronend/app/client/products/page.tsx`

---

## 🪝 React Hooks

### useClientLogin
**Purpose**: Handle client authentication
```typescript
const { login, logout, getToken, getUser, loading, error } = useClientLogin();

// Login
await login(email, password);

// Logout
logout();

// Get stored data
const token = getToken();
const user = getUser();
```

### useClientClaims
**Purpose**: Fetch paginated claims list
```typescript
const { claims, loading, error, pagination, refetch } = useClientClaims(
  page,
  status // optional
);
```

### useClientClaim
**Purpose**: Fetch single claim details
```typescript
const { claim, loading, error, refetch, addComment } = useClientClaim(claimId);

// Add comment
await addComment("Comment text");
```

### useCreateClaim
**Purpose**: Create new claim
```typescript
const { createClaim, loading, error } = useCreateClaim();

// Create
const claim = await createClaim(title, description);
```

### useUploadFiles
**Purpose**: Upload files to claim
```typescript
const { uploadFiles, loading, error, progress } = useUploadFiles();

// Upload
await uploadFiles(claimId, files);
```

### useClientProducts
**Purpose**: Fetch products list
```typescript
const { products, loading, error, pagination, refetch } = useClientProducts(page);
```

---

## 🛠️ Backend Endpoints

### Authentication
| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| POST | `/api/client/login` | ❌ | `{ token, user }` |

### Claims
| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| GET | `/api/client/claims` | ✅ | `{ claims[], pagination }` |
| POST | `/api/client/claims` | ✅ | `{ claim }` |
| GET | `/api/client/claims/:id` | ✅ | `{ claim }` |
| POST | `/api/client/claims/:id/upload` | ✅ | `{ claim, uploadedFiles[] }` |
| POST | `/api/client/claims/:id/comments` | ✅ | `{ comment }` |

### Products
| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| GET | `/api/client/products` | ✅ | `{ products[], pagination }` |
| GET | `/api/client/products/:id` | ✅ | `{ product }` |

### Dashboard
| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| GET | `/api/client/dashboard` | ✅ | `{ totalClaims, totalProducts, claimsByStatus }` |

---

## 📊 Data Models

### Claim Status
- `SUBMITTED` - Claim just created
- `IN_REVIEW` - Under review by support team
- `RESOLVED` - Issue resolved

### Product Types
- `INSURANCE` - Insurance products
- `SERVICE` - Services offered
- `PRODUCT` - Physical products

---

## 🔐 Security Features

### 1. JWT Authentication
- Token stored in localStorage
- Validated on each protected request
- CLIENT role enforcement via middleware

### 2. Middleware Chain
```typescript
// Protected routes flow:
authMiddleware (validates JWT) 
  → clientMiddleware (checks CLIENT role)
  → handler (executes endpoint)
```

### 3. File Upload Security
- Allowed MIME types only (PDF, images, documents)
- Max 10MB per file
- Max 10 files per upload
- Stored in claim-specific folders

### 4. Authorization
- Clients can only access their own claims
- Ownership verification before any operation
- 403 Forbidden response for unauthorized access

---

## 📋 API Request Examples

### Login
```bash
curl -X POST http://localhost:3001/api/client/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "password123"
  }'
```

### Create Claim
```bash
curl -X POST http://localhost:3001/api/client/claims \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Claim Title",
    "description": "Detailed description..."
  }'
```

### Upload Files
```bash
curl -X POST http://localhost:3001/api/client/claims/CLAIM_ID/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "files=@document.pdf" \
  -F "files=@photo.jpg"
```

### Get Claims
```bash
curl http://localhost:3001/api/client/claims?page=1&limit=10&status=SUBMITTED \
  -H "Authorization: Bearer TOKEN"
```

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Run migrations (if schema was updated)
npm run prisma:migrate

# Start server
npm run dev
```

### 2. Frontend Setup
```bash
cd fronend

# Install dependencies
npm install

# Start Next.js dev server
npm run dev
```

### 3. Access Portal
- **Login**: http://localhost:3000/client/login
- **Dashboard**: http://localhost:3000/client/dashboard
- **Claims**: http://localhost:3000/client/claims
- **Products**: http://localhost:3000/client/products

---

## 🧪 Testing Workflow

### Complete User Journey
1. ✅ Navigate to `/client/login`
2. ✅ Enter client credentials
3. ✅ View dashboard at `/client/dashboard`
4. ✅ Navigate to `/client/claims`
5. ✅ Create new claim at `/client/claims/new`
6. ✅ Upload supporting documents
7. ✅ View claim details at `/client/claims/[id]`
8. ✅ Add comments to claim
9. ✅ Browse products at `/client/products`
10. ✅ Logout and verify redirect

### Test Data
Use existing CLIENT role users from your database, or create:
```sql
INSERT INTO "User" (id, email, password, name, role)
VALUES (uuid(), 'client@test.com', 'password123', 'Test Client', 'CLIENT');
```

---

## 🎯 File Upload Feature

### Upload Workflow
1. User selects files in new claim form
2. Form submitted with claim title/description
3. Claim created first (gets ID)
4. Files uploaded to `/uploads/claims/{claimId}/`
5. File paths stored in claim record

### Supported File Types
- **Documents**: PDF, DOC, DOCX, XLS, XLSX
- **Images**: JPG, JPEG, PNG, GIF
- **Max Size**: 10MB per file
- **Max Files**: 10 per upload

---

## 🎨 UI/UX Features

### Design System
- **Dark Theme**: Gray-900 primary, Gray-800 secondary
- **Status Colors**: Yellow (Submitted), Blue (In Review), Green (Resolved)
- **Responsive**: Mobile-first Tailwind CSS
- **Accessibility**: Semantic HTML, clear labels

### Key Components
- Status badges with color coding
- Pagination controls
- Empty state messaging
- Loading indicators
- Error notifications
- Success confirmations

---

## 📝 Notes

### Implementation Decisions
1. **localStorage for tokens** - Simple for demo/development (use HttpOnly cookies for production)
2. **Mock data fallback** - Not needed for Client Portal (vs Operator Panel)
3. **Pagination** - 10 items per page for better UX
4. **Comments** - Threaded support for claim discussions
5. **File storage** - Disk-based for development (cloud storage like S3 for production)

### Future Enhancements
- Real-time notifications for claim updates
- Email notifications on claim status change
- Advanced search and filtering
- Bulk file upload
- Claim templates
- Mobile app
- Two-factor authentication
- API webhook support

---

## ✅ Implementation Checklist

- [x] Backend middleware created
- [x] Prisma schema validated
- [x] Controllers with 9 endpoints
- [x] Routes configured with middleware
- [x] Multer file upload setup
- [x] App.ts routes registered
- [x] Login page
- [x] Dashboard page
- [x] Claims list page
- [x] New claim form page
- [x] Claim details page
- [x] Products page
- [x] All 6 React hooks
- [x] Hook index exports
- [ ] Integration testing (pending)
- [ ] Production deployment

---

## 🔗 Related Documentation

- **Admin Panel**: ADMIN_PANEL_SUMMARY.md
- **Supervisor Panel**: (available in codebase)
- **Operator Panel**: OPERATOR_PANEL_FIXES_SUMMARY.md
- **API Specification**: backend/API_SPECIFICATION.md

---

**Last Updated**: 2024
**Status**: ✅ Complete and Ready for Testing
**Estimated Testing Time**: 30-45 minutes for full workflow
