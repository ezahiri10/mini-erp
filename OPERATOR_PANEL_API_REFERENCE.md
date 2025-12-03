# 🎯 Operator Panel - API & Development Reference

> Quick reference for developers implementing or extending the Operator Panel

**Last Updated**: December 3, 2025  
**Status**: ✅ Complete & Production Ready

---

## 📡 API Base URL

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:4000/api/operator` |
| Staging | `https://staging.your-domain.com/api/operator` |
| Production | `https://your-domain.com/api/operator` |

---

## 🔑 Authentication

All endpoints require Bearer token in Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:4000/api/operator/leads
```

**Token Location (Frontend)**:
```typescript
const token = localStorage.getItem('token');
```

---

## 📋 All 12 Endpoints

### Dashboard
| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/dashboard` | `{ totalLeads, totalClaims, totalClients, claimsByStatus }` |

### Leads (4 Endpoints)
| Method | Endpoint | Body | Returns |
|--------|----------|------|---------|
| GET | `/leads?page=1&limit=10&status=NEW` | - | `{ leads[], pagination }` |
| GET | `/leads/:id` | - | `{ lead with comments }` |
| PATCH | `/leads/:id/status` | `{ status }` | `{ lead }` |
| POST | `/leads/:id/comments` | `{ text }` | `{ comment }` |

**Lead Status Values**: `NEW`, `CONTACTED`, `CONVERTED`, `LOST`

### Claims (4 Endpoints)
| Method | Endpoint | Body | Returns |
|--------|----------|------|---------|
| GET | `/claims?page=1&limit=10&status=SUBMITTED` | - | `{ claims[], pagination }` |
| GET | `/claims/:id` | - | `{ claim with comments }` |
| PATCH | `/claims/:id/status` | `{ status }` | `{ claim }` |
| POST | `/claims/:id/comments` | `{ text }` | `{ comment }` |

**Claim Status Values**: `SUBMITTED`, `IN_REVIEW`, `RESOLVED`

### Clients (2 Endpoints)
| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/clients?page=1&limit=10` | `{ clients[], pagination }` |
| GET | `/clients/:id` | `{ client with claims[] }` |

---

## 📁 File Locations

### Backend Controllers & Routes
```
/backend/src/
├── controllers/operatorController.ts     (11 functions)
├── routes/operatorRoutes.ts              (12 endpoints)
├── middlewares/
│   ├── authMiddleware.ts                 (JWT validation)
│   └── roleMiddleware.ts                 (OPERATOR role)
└── app.ts                                (route registration)
```

### Prisma Schema
```
/backend/prisma/schema.prisma
- User model with roles
- Lead model (assignedTo)
- Claim model (assignedTo, status)
- Comment model (claimId, authorId)
- Product model
- LeadStatus enum (NEW, CONTACTED, CONVERTED, LOST)
- ClaimStatus enum (SUBMITTED, IN_REVIEW, RESOLVED)
- Role enum (ADMIN, SUPERVISOR, OPERATOR, CLIENT)
```

### Frontend Components
```
/fronend/app/operator/
├── components/
│   ├── StatusBadge.tsx       (status color coding)
│   ├── PageHeader.tsx        (title + description)
│   ├── Card.tsx              (stat cards)
│   ├── DataTable.tsx         (paginated table)
│   ├── CommentList.tsx       (comment thread)
│   ├── CommentForm.tsx       (add comment)
│   └── ClaimProgress.tsx     (progress timeline)
├── hooks/
│   └── useOperator.ts        (10 data hooks)
└── pages/
    ├── dashboard/page.tsx
    ├── leads/page.tsx
    ├── leads/[id]/page.tsx
    ├── claims/page.tsx
    ├── claims/[id]/page.tsx
    ├── clients/page.tsx
    └── clients/[id]/page.tsx
```

---

## 🎣 Frontend Hooks

### Import
```typescript
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
  useAddClaimComment,
} from "@/app/operator/hooks/useOperator";
```

### Hook Signatures

```typescript
// Fetch leads with pagination and status filter
const { leads, loading, error, pagination, refetch } = useOperatorLeads(page, status);

// Fetch single lead
const { lead, loading, error, refetch } = useOperatorLeadById(leadId);

// Fetch claims with pagination and status filter
const { claims, loading, error, pagination, refetch } = useOperatorClaims(page, status);

// Fetch single claim
const { claim, loading, error, refetch } = useOperatorClaimById(claimId);

// Fetch clients
const { clients, loading, error, pagination, refetch } = useOperatorClients(page);

// Fetch single client
const { client, loading, error, refetch } = useOperatorClientById(clientId);

// Update lead status (mutation)
const { updateStatus, loading, error } = useUpdateLeadStatus();
await updateStatus(leadId, "CONVERTED");

// Update claim status (mutation)
const { updateStatus, loading, error } = useUpdateClaimStatus();
await updateStatus(claimId, "RESOLVED");

// Add lead comment (mutation)
const { addComment, loading, error } = useAddLeadComment();
await addComment(leadId, "Comment text");

// Add claim comment (mutation)
const { addComment, loading, error } = useAddClaimComment();
await addComment(claimId, "Comment text");
```

---

## 🧩 Component Props

### StatusBadge
```typescript
<StatusBadge status="NEW" variant="lead" />
// variant: "lead" | "claim"
// lead statuses: NEW, CONTACTED, CONVERTED, LOST
// claim statuses: SUBMITTED, IN_REVIEW, RESOLVED
```

### PageHeader
```typescript
<PageHeader title="My Leads" description="All leads assigned to you" />
```

### Card
```typescript
<Card title="Total Leads" value={12} icon={TrendingUp} borderColor="blue" />
```

### DataTable
```typescript
<DataTable
  headers={["Name", "Email", "Status", "Created"]}
  data={leads}
  onRowClick={(row) => navigate(`/leads/${row.id}`)}
  renderRow={(row) => [
    row.name,
    row.email,
    <StatusBadge status={row.status} />,
    formatDate(row.createdAt)
  ]}
  isLoading={loading}
  emptyMessage="No leads found"
/>
```

### CommentList
```typescript
<CommentList comments={lead.comments} isLoading={loading} />
```

### CommentForm
```typescript
<CommentForm
  onSubmit={(text) => addComment(leadId, text)}
  isLoading={loading}
  placeholder="Add a comment..."
/>
```

### ClaimProgress
```typescript
<ClaimProgress status="IN_REVIEW" />
// status: "SUBMITTED" | "IN_REVIEW" | "RESOLVED"
```

---

## 🔐 Security Checklist

### Backend
- ✅ All endpoints require JWT token (authMiddleware)
- ✅ All endpoints require OPERATOR role (roleMiddleware)
- ✅ Resource ownership verified in controllers
- ✅ Error messages don't leak sensitive data

### Frontend
- ✅ Token stored in localStorage
- ✅ Token included in all API calls
- ✅ 401/403 errors handled gracefully
- ✅ User redirected to login on auth failure

### Authorization Matrix
```
                  Own Resource    Other's Resource
Leads             ✅ Full access   ❌ 403 Forbidden
Claims            ✅ Full access   ❌ 403 Forbidden
Comments          ✅ Create        ❌ View other's only
Clients           ✅ View          ❌ View other's only
Dashboard         ✅ Own stats     N/A
```

---

## 🧪 Quick Testing Examples

### Get All Leads (cURL)
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:4000/api/operator/leads?page=1&status=NEW"
```

### Get Lead Detail
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:4000/api/operator/leads/LEAD_ID
```

### Update Lead Status
```bash
curl -X PATCH \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"CONVERTED"}' \
  http://localhost:4000/api/operator/leads/LEAD_ID/status
```

### Add Lead Comment
```bash
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Follow up needed"}' \
  http://localhost:4000/api/operator/leads/LEAD_ID/comments
```

### Get All Claims
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:4000/api/operator/claims?page=1&status=SUBMITTED"
```

### Update Claim Status
```bash
curl -X PATCH \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_REVIEW"}' \
  http://localhost:4000/api/operator/claims/CLAIM_ID/status
```

---

## 📊 Response Types

### List Response
```typescript
{
  leads: Lead[],      // or claims: Claim[], etc
  pagination: {
    total: number,
    page: number,
    limit: number,
    pages: number
  }
}
```

### Single Item Response
```typescript
{
  id: string,
  title: string,
  status: string,
  createdAt: string,
  comments: Comment[],
  assignedUser?: User
}
```

### Comment Response
```typescript
{
  id: string,
  text: string,
  authorId: string,
  author: { id: string, name: string, email: string },
  createdAt: string
}
```

### Error Response
```typescript
{
  error: string,     // or message: string
}
```

---

## 🎨 Tailwind Classes (Dark Theme)

### Colors
```
Background:   bg-gray-900 (primary), bg-gray-800 (secondary)
Text:         text-white (primary), text-gray-300 (secondary), text-gray-500 (muted)
Borders:      border-gray-700
Hover:        hover:bg-gray-800
```

### Status Badge Colors
```
NEW:        bg-blue-500/20 text-blue-400
CONTACTED:  bg-purple-500/20 text-purple-400
CONVERTED:  bg-green-500/20 text-green-400
LOST:       bg-red-500/20 text-red-400
SUBMITTED:  bg-yellow-500/20 text-yellow-400
IN_REVIEW:  bg-blue-500/20 text-blue-400
RESOLVED:   bg-green-500/20 text-green-400
```

---

## 🔧 Common Development Tasks

### Add a New Field to Lead
1. Update Prisma schema: `/backend/prisma/schema.prisma`
2. Run migration: `npx prisma migrate dev --name add_field_name`
3. Update Lead interface: `/fronend/app/operator/hooks/useOperator.ts`
4. Update components that display leads
5. Update lead detail page if needed

### Add a New Endpoint
1. Create function in `operatorController.ts`
2. Add route in `operatorRoutes.ts`
3. Create hook in `useOperator.ts` if data fetching
4. Use hook in component
5. Test with cURL or Postman

### Add Filtering
```typescript
// In hook:
const query = new URLSearchParams();
query.append("status", status);
const response = await fetch(`/api/operator/leads?${query}`, ...);

// In endpoint:
const { status } = req.query;
const where: any = { assignedTo: operatorId };
if (status) where.status = status;
```

### Add New Status Badge Color
```typescript
// In StatusBadge.tsx:
case "CUSTOM_STATUS":
  return "bg-custom-500/20 text-custom-400";
```

---

## 🚨 Error Handling

### Common Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 400 | Bad Request | Invalid input/missing fields |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient role or access |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database or server error |

### Frontend Error Handling
```typescript
if (error?.includes("401")) {
  // Redirect to login
}
if (error?.includes("403")) {
  // Show permission denied message
}
if (error?.includes("404")) {
  // Show not found message
}
```

---

## 📚 Related Documentation

| Document | Purpose |
|----------|---------|
| [README_OPERATOR_PANEL.md](./README_OPERATOR_PANEL.md) | Getting started guide |
| [OPERATOR_PANEL_GUIDE.md](./OPERATOR_PANEL_GUIDE.md) | Complete technical documentation |
| [OPERATOR_PANEL_TESTING.md](./OPERATOR_PANEL_TESTING.md) | Testing procedures |
| [OPERATOR_PANEL_SUMMARY.md](./OPERATOR_PANEL_SUMMARY.md) | Project overview |
| [OPERATOR_PANEL_IMPLEMENTATION.md](./OPERATOR_PANEL_IMPLEMENTATION.md) | Full verification report |

---

## 💡 Tips & Tricks

### Debug Token
```javascript
console.log('Token:', localStorage.getItem('token'));
```

### Check API Response
```javascript
// In browser Network tab
// Click on API call
// Go to Response tab
```

### Test Pagination
```bash
curl "http://localhost:4000/api/operator/leads?page=1&limit=10"
curl "http://localhost:4000/api/operator/leads?page=2&limit=10"
```

### Filter by Status
```bash
# Leads
curl "http://localhost:4000/api/operator/leads?status=NEW"
curl "http://localhost:4000/api/operator/leads?status=CONTACTED"

# Claims
curl "http://localhost:4000/api/operator/claims?status=SUBMITTED"
curl "http://localhost:4000/api/operator/claims?status=IN_REVIEW"
```

### Disable Loading Spinner
```typescript
// For testing - in component:
const loading = false; // Override
```

---

## 🎓 Architecture Patterns

### Controller Pattern
```typescript
export const getOperatorLeads = async (req, res) => {
  // 1. Get operator ID
  const operatorId = (req as any).user?.id;
  
  // 2. Validate input
  const { page = 1, limit = 10 } = req.query;
  
  // 3. Query database
  const leads = await prisma.lead.findMany({
    where: { assignedTo: operatorId }
  });
  
  // 4. Return response
  return res.json({ leads });
};
```

### Hook Pattern
```typescript
export function useOperatorLeads(page = 1) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, [page]);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`/api/operator/leads?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setLeads(data.leads);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { leads, loading, error, refetch: fetchLeads };
}
```

### Component Pattern
```typescript
export default function LeadsPage() {
  const { leads, loading, error } = useOperatorLeads();

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  
  return (
    <div>
      {leads.map(lead => (
        <LeadCard key={lead.id} lead={lead} />
      ))}
    </div>
  );
}
```

---

## 📞 Support

- Check logs: `npm run dev` (backend), `npm run dev` (frontend)
- Clear cache: `rm -rf .next node_modules && npm install`
- Reset database: `npx prisma migrate reset`
- Regenerate Prisma: `npx prisma generate`

---

**Ready to develop! 🚀**

Last Updated: December 3, 2025  
Status: ✅ Production Ready
