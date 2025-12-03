# ⚡ Operator Panel - Quick Reference Card

## 🔗 URLs & Routes

### Frontend Pages
| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/operator/dashboard` | Overview with stats |
| Leads | `/operator/leads` | List of assigned leads |
| Lead Detail | `/operator/leads/:id` | Single lead with comments |
| Claims | `/operator/claims` | List of assigned claims |
| Claim Detail | `/operator/claims/:id` | Single claim with comments |
| Clients | `/operator/clients` | List of assigned clients |
| Client Detail | `/operator/clients/:id` | Single client with claims |

### Backend API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/operator/dashboard` | Get dashboard stats |
| GET | `/api/operator/leads` | List leads (paginated) |
| GET | `/api/operator/leads/:id` | Get lead detail |
| PATCH | `/api/operator/leads/:id/status` | Update lead status |
| POST | `/api/operator/leads/:id/comments` | Add lead comment |
| GET | `/api/operator/claims` | List claims (paginated) |
| GET | `/api/operator/claims/:id` | Get claim detail |
| PATCH | `/api/operator/claims/:id/status` | Update claim status |
| POST | `/api/operator/claims/:id/comments` | Add claim comment |
| GET | `/api/operator/clients` | List clients (paginated) |
| GET | `/api/operator/clients/:id` | Get client detail |

---

## 🎨 Component Imports

### All Components in One Place
```tsx
import StatusBadge from '@/app/operator/components/StatusBadge';
import PageHeader from '@/app/operator/components/PageHeader';
import Card from '@/app/operator/components/Card';
import DataTable from '@/app/operator/components/DataTable';
import CommentList from '@/app/operator/components/CommentList';
import CommentForm from '@/app/operator/components/CommentForm';
import ClaimProgress from '@/app/operator/components/ClaimProgress';
```

---

## 🪝 Hook Imports & Usage

```tsx
import {
  useOperatorLeads,
  useOperatorLeadById,
  useOperatorClaims,
  useOperatorClaimById,
  useOperatorClients,
  useOperatorClientById,
  useUpdateLeadStatus,
  useUpdateClaimStatus,
  useAddLeadComment,
  useAddClaimComment
} from '@/app/operator/hooks/useOperator';
```

### Example Usage
```tsx
// Fetch leads
const { leads, loading, error, pagination } = useOperatorLeads(1, 'NEW');

// Update status
const { updateStatus } = useUpdateLeadStatus();
await updateStatus(leadId, 'CONVERTED');

// Add comment
const { addComment } = useAddClaimComment();
await addComment(claimId, 'Comment text');
```

---

## 📊 Data Structures

### Lead
```typescript
{
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'LOST';
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  comments: Comment[];
}
```

### Claim
```typescript
{
  id: string;
  title: string;
  description?: string;
  status: 'SUBMITTED' | 'IN_REVIEW' | 'RESOLVED';
  assignedTo?: string;
  clientId: string;
  files: string[];
  createdAt: string;
  client: { id, name, email };
  comments: Comment[];
}
```

### Comment
```typescript
{
  id: string;
  text: string;
  author: { id, name, email };
  createdAt: string;
}
```

---

## 🎯 Common Tasks

### Display a List with Pagination
```tsx
const { leads, loading, pagination } = useOperatorLeads(page);

<DataTable
  headers={['Name', 'Email', 'Status']}
  data={leads}
  isLoading={loading}
  renderRow={(lead) => (
    <>
      <td>{lead.name}</td>
      <td>{lead.email}</td>
      <td><StatusBadge status={lead.status} variant="lead" /></td>
    </>
  )}
/>
```

### Add a Comment
```tsx
const { addComment, loading } = useAddClaimComment();

const handleSubmit = async (text) => {
  await addComment(claimId, text);
  refetch(); // Refresh data
};

<CommentForm onSubmit={handleSubmit} isLoading={loading} />
```

### Update Status
```tsx
const { updateStatus, loading } = useUpdateLeadStatus();

await updateStatus(leadId, 'CONVERTED');
```

### Show Claim Progress
```tsx
<ClaimProgress status={claim.status} />
// Shows: SUBMITTED → IN_REVIEW → RESOLVED
```

---

## 🎨 Tailwind Class Reference

### Dark Mode Colors
```
Background: bg-gray-900, bg-gray-800
Text: text-white, text-gray-400, text-gray-300
Borders: border-gray-700, border-gray-600

Accent Colors:
- Blue: border-blue-400, text-blue-400, bg-blue-900
- Green: border-green-400, text-green-400, bg-green-900
- Yellow: border-yellow-400, text-yellow-400, bg-yellow-900
- Red: text-red-400, bg-red-900
```

### Common Classes
```
Buttons:
bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg

Tables:
bg-gray-800 rounded-lg shadow-sm overflow-hidden

Cards:
bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 border-l-4 border-blue-400

Loading:
animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400
```

---

## 🔐 Authentication Headers

### Required for All Requests
```bash
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Token Location
- Stored in: `localStorage.getItem('token')`
- Retrieved in: All API hooks
- Sent in: Authorization header

---

## 📱 Responsive Breakpoints

### TailwindCSS Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Grid Layouts Used
- Dashboard: `grid-cols-4` (4 cards)
- Claims Status: `grid-cols-3` (3 columns)
- Sidebar: `col-span-2` (main) + `col-span-1` (sidebar)

---

## 🐛 Debugging Tips

### Check Token
```javascript
console.log(localStorage.getItem('token'));
```

### Check Network Request
1. Open DevTools → Network tab
2. Make request
3. Check request headers for Authorization
4. Check response status and body

### Check Data
```javascript
console.log(leads);
console.log(claim);
console.log(error);
```

### Common Errors
```
401: Token missing or expired
403: User not authorized (not OPERATOR role)
404: Resource not found
400: Bad request (validation error)
```

---

## 📚 File Locations

```
Backend:
- Routes: /backend/src/routes/operatorRoutes.ts
- Controllers: /backend/src/controllers/operatorController.ts

Frontend:
- Components: /fronend/app/operator/components/
- Hooks: /fronend/app/operator/hooks/useOperator.ts
- Pages: /fronend/app/operator/*/page.tsx

Documentation:
- Guide: /OPERATOR_PANEL_GUIDE.md
- Testing: /OPERATOR_PANEL_TESTING.md
- Summary: /OPERATOR_PANEL_SUMMARY.md
```

---

## ⚙️ Environment Variables

### Backend `.env`
```
DATABASE_URL=postgresql://user:password@localhost:5432/erp_db
JWT_SECRET=your_jwt_secret
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 🔄 API Response Format

### Success Response (200/201)
```json
{
  "leads": [],
  "pagination": { "total": 10, "page": 1, "limit": 10, "pages": 1 },
  "message": "Success"
}
```

### Error Response (4xx/5xx)
```json
{
  "error": "Error message",
  "message": "Human readable message"
}
```

---

## 🚀 Deployment Commands

### Backend
```bash
cd backend
npm install
npx prisma migrate deploy
npm run build
npm start
```

### Frontend
```bash
cd fronend
npm install
npm run build
npm start
```

---

## 📊 Database Query Examples

### Get Operator's Leads
```sql
SELECT * FROM "Lead" WHERE "assignedTo" = 'operator-id' 
ORDER BY "createdAt" DESC LIMIT 10;
```

### Get Operator's Claims
```sql
SELECT * FROM "Claim" WHERE "assignedTo" = 'operator-id' 
ORDER BY "createdAt" DESC;
```

### Get Lead with Comments
```sql
SELECT * FROM "Lead" l
LEFT JOIN "Comment" c ON l.id = c."leadId"
WHERE l.id = 'lead-id';
```

---

## ✨ Feature Status

| Feature | Status |
|---------|--------|
| View Leads | ✅ |
| Update Lead Status | ✅ |
| Add Lead Comments | ✅ |
| View Claims | ✅ |
| Update Claim Status | ✅ |
| Add Claim Comments | ✅ |
| Claim Progress | ✅ |
| View Clients | ✅ |
| Dashboard Stats | ✅ |
| Pagination | ✅ |
| Filtering | ✅ |
| Error Handling | ✅ |
| Dark Mode UI | ✅ |
| Responsive Design | ✅ |

---

**Last Updated:** December 3, 2025  
**Version:** 1.0
