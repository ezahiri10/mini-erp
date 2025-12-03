# 🎯 Operator Panel - Complete Implementation Guide

## Overview
The Operator Panel has been fully built with both backend (Express + Prisma + PostgreSQL) and frontend (Next.js + React) implementations. This document covers all features, file structure, and usage.

---

## 📁 Backend Structure

### **Routes** (`/backend/src/routes/operatorRoutes.ts`)
All routes are prefixed with `/api/operator` and require authentication + OPERATOR role.

#### Leads Endpoints
- `GET /api/operator/leads` - Fetch operator's assigned leads with pagination
  - Query params: `page` (default: 1), `limit` (default: 10), `status` (optional)
  - Response: `{ leads: [], pagination: { total, page, limit, pages } }`

- `GET /api/operator/leads/:id` - Get specific lead details
  - Includes: lead info, assigned user, and comments

- `PATCH /api/operator/leads/:id/status` - Update lead status
  - Body: `{ status: "NEW" | "CONTACTED" | "CONVERTED" | "LOST" }`

- `POST /api/operator/leads/:id/comments` - Add comment to lead
  - Body: `{ text: string }`

#### Claims Endpoints
- `GET /api/operator/claims` - Fetch operator's assigned claims with pagination
  - Query params: `page`, `limit`, `status` (SUBMITTED, IN_REVIEW, RESOLVED)

- `GET /api/operator/claims/:id` - Get specific claim details
  - Includes: claim info, client, comments, and progress tracking

- `PATCH /api/operator/claims/:id/status` - Update claim status
  - Body: `{ status: "SUBMITTED" | "IN_REVIEW" | "RESOLVED" }`

- `POST /api/operator/claims/:id/comments` - Add comment to claim
  - Body: `{ text: string }`

#### Clients Endpoints
- `GET /api/operator/clients` - Fetch operator's assigned clients with pagination

- `GET /api/operator/clients/:id` - Get specific client details
  - Includes: client info and associated claims

#### Dashboard Endpoint
- `GET /api/operator/dashboard` - Get dashboard statistics
  - Response: `{ totalLeads, totalClaims, totalClients, claimsByStatus }`

### **Controllers** (`/backend/src/controllers/operatorController.ts`)

All controller functions include:
- ✅ Authentication verification
- ✅ Authorization checks (only access assigned resources)
- ✅ Pagination support
- ✅ Error handling
- ✅ Relation loading (client, assigned user, comments)

Key functions:
- `getOperatorLeads()` - Fetch paginated leads
- `getOperatorLeadById()` - Get lead with access control
- `updateLeadStatus()` - Update lead status with verification
- `addLeadComment()` - Add comment to lead
- `getOperatorClaims()` - Fetch paginated claims
- `getOperatorClaimById()` - Get claim with access control
- `updateClaimStatus()` - Update claim status
- `addClaimComment()` - Add comment to claim
- `getOperatorClients()` - Fetch operator's clients
- `getOperatorClientById()` - Get client details with claims
- `getOperatorDashboard()` - Get dashboard statistics

---

## 🖥️ Frontend Structure

### **Directory Layout**
```
/fronend/app/operator/
├── components/
│   ├── StatusBadge.tsx        - Status display with color coding
│   ├── PageHeader.tsx          - Reusable page header
│   ├── Card.tsx                - Stat card component
│   ├── DataTable.tsx           - Reusable data table
│   ├── CommentList.tsx         - Display comments
│   ├── CommentForm.tsx         - Add comments form
│   └── ClaimProgress.tsx       - Claim progress timeline
├── hooks/
│   └── useOperator.ts          - All API hooks
├── dashboard/
│   └── page.tsx                - Dashboard with stats
├── leads/
│   ├── page.tsx                - Leads list
│   └── [id]/
│       └── page.tsx            - Lead details & update
├── claims/
│   ├── page.tsx                - Claims list
│   └── [id]/
│       └── page.tsx            - Claim details & update
├── clients/
│   ├── page.tsx                - Clients list
│   └── [id]/
│       └── page.tsx            - Client details
└── layout.tsx                  - Operator layout
```

### **Components**

#### StatusBadge.tsx
```tsx
<StatusBadge status="NEW" variant="lead" />
// Lead statuses: NEW, CONTACTED, CONVERTED, LOST
// Claim statuses: SUBMITTED, IN_REVIEW, RESOLVED
```

#### PageHeader.tsx
```tsx
<PageHeader title="Leads" description="Your assigned leads" />
```

#### Card.tsx
```tsx
<Card
  title="Total Leads"
  value={42}
  borderColor="border-blue-400"
  icon="📋"
/>
```

#### DataTable.tsx
```tsx
<DataTable
  headers={['Name', 'Email', 'Status']}
  data={leads}
  onRowClick={handleRowClick}
  renderRow={(row) => (
    <>
      <td>{row.name}</td>
      <td>{row.email}</td>
    </>
  )}
/>
```

#### CommentList.tsx
```tsx
<CommentList comments={lead.comments} />
```

#### CommentForm.tsx
```tsx
<CommentForm
  onSubmit={handleAddComment}
  isLoading={commentLoading}
  placeholder="Add a comment..."
/>
```

#### ClaimProgress.tsx
```tsx
<ClaimProgress status="IN_REVIEW" />
// Shows: SUBMITTED → IN_REVIEW → RESOLVED
```

### **Hooks** (`/fronend/app/operator/hooks/useOperator.ts`)

#### Data Fetching Hooks
```tsx
// Leads
const { leads, loading, error, pagination, refetch } = useOperatorLeads(page, status);
const { lead, loading, error, refetch } = useOperatorLeadById(id);

// Claims
const { claims, loading, error, pagination, refetch } = useOperatorClaims(page, status);
const { claim, loading, error, refetch } = useOperatorClaimById(id);

// Clients
const { clients, loading, error, pagination, refetch } = useOperatorClients(page);
const { client, loading, error, refetch } = useOperatorClientById(id);
```

#### Mutation Hooks
```tsx
// Update statuses
const { updateStatus, loading, error } = useUpdateLeadStatus();
await updateStatus(leadId, "CONVERTED");

const { updateStatus, loading, error } = useUpdateClaimStatus();
await updateStatus(claimId, "RESOLVED");

// Add comments
const { addComment, loading, error } = useAddLeadComment();
await addComment(leadId, "Comment text");

const { addComment, loading, error } = useAddClaimComment();
await addComment(claimId, "Comment text");
```

### **Pages**

#### Dashboard (`/operator/dashboard`)
**Features:**
- 4 metric cards: Total Leads, Claims, Clients, Resolved Claims
- Claims breakdown by status (Submitted, In Review, Resolved)
- Quick action buttons to navigate to list pages
- Real-time stats fetching

**States:**
- Loading state with spinner
- Error state with error message
- Success state with statistics

#### Leads List (`/operator/leads`)
**Features:**
- Paginated table of assigned leads
- Status filter dropdown
- Click to view lead details
- Columns: Name, Email, Phone, Status, Created Date

**States:**
- Loading, error, empty states
- Pagination controls (Previous/Next)

#### Lead Detail (`/operator/leads/[id]`)
**Features:**
- Full lead information display
- Status update form
- Comments section with list and add form
- Access control (only assigned operator can view)

**Actions:**
- Update lead status
- Add comments
- View all comments

#### Claims List (`/operator/claims`)
**Features:**
- Paginated table of assigned claims
- Status filter (Submitted, In Review, Resolved)
- Click to view claim details
- Columns: Title, Client, Status, Comments Count, Created Date

**States:**
- Loading, error, empty states
- Pagination controls

#### Claim Detail (`/operator/claims/[id]`)
**Features:**
- Full claim information
- Client details
- Claim progress timeline (visual representation of status)
- Status update form
- Comments section
- Quick info sidebar (comments count, files count)

**Actions:**
- Update claim status
- Add comments
- View claim progress

#### Clients List (`/operator/clients`)
**Features:**
- Paginated table of assigned clients
- Click to view client details
- Columns: Name, Email, Status, Created Date

#### Client Detail (`/operator/clients/[id]`)
**Features:**
- Client information
- Associated claims list
- Click claim to view details

---

## 🔄 Data Flow

### Authentication
1. User logs in → JWT token stored in `localStorage`
2. All API calls include `Authorization: Bearer {token}` header
3. Backend validates token and user role (OPERATOR)

### Lead Workflow
```
1. Operator visits /operator/leads
2. Frontend fetches: GET /api/operator/leads?page=1&limit=10
3. Backend filters by assignedTo === operatorId
4. Display in paginated table
5. Click lead → Navigate to /operator/leads/[id]
6. Fetch lead details with comments
7. Operator can:
   - Update status (PATCH /api/operator/leads/[id]/status)
   - Add comment (POST /api/operator/leads/[id]/comments)
```

### Claim Workflow
```
1. Operator visits /operator/claims
2. Similar to leads flow
3. In claim detail:
   - View claim progress timeline
   - Update claim status (SUBMITTED → IN_REVIEW → RESOLVED)
   - Add comments with real-time updates
   - View client information
```

---

## 🎨 UI/UX Features

### Dark Mode Design
- **Background:** `bg-gray-900` (primary), `bg-gray-800` (cards)
- **Text:** White headings, gray descriptions
- **Accents:** Blue (`blue-400`), Green (`green-400`), Yellow (`yellow-400`)
- **Borders:** Gray (`gray-700`), colored left borders on cards

### Responsive Layout
- Grid-based layouts (2-4 columns)
- Mobile-first design considerations
- Responsive tables with horizontal scroll on mobile

### Loading States
- Spinner animation with text
- Disabled buttons during loading

### Error States
- Red background cards with error messages
- Retry buttons where applicable

### Empty States
- Helpful messages when no data found
- Encouragement to add content

---

## 🔐 Security Features

### Backend
- ✅ JWT authentication required for all routes
- ✅ Role-based access control (OPERATOR only)
- ✅ Resource-level authorization (can only access assigned resources)
- ✅ Input validation
- ✅ Error handling without exposing sensitive data

### Frontend
- ✅ Token stored in localStorage (accessible via JS)
- ✅ Token sent in Authorization header
- ✅ Automatic redirect on auth failure (implement as needed)

---

## 📊 Database Relations

### User (Operator)
- `id` (UUID)
- `name`, `email`, `password`
- `role: "OPERATOR"`
- Relations: `leadsAssigned[]`, `claimsAssigned[]`

### Lead
- `id`, `name`, `email`, `phone`
- `status: LeadStatus` (NEW, CONTACTED, CONVERTED, LOST)
- `assignedTo: User.id`
- `comments: Comment[]`

### Claim
- `id`, `title`, `description`
- `status: ClaimStatus` (SUBMITTED, IN_REVIEW, RESOLVED)
- `assignedTo: User.id`, `clientId: User.id`
- `comments: Comment[]`

### Comment
- `id`, `text`, `authorId: User.id`
- `leadId?: Lead.id`, `claimId?: Claim.id`
- `createdAt: DateTime`

---

## 🚀 Deployment Checklist

### Backend
- [ ] Set environment variables in `.env`
- [ ] Run Prisma migrations: `prisma migrate deploy`
- [ ] Build TypeScript: `tsc`
- [ ] Start server: `npm start`

### Frontend
- [ ] Set `NEXT_PUBLIC_API_URL` environment variable
- [ ] Build: `npm run build`
- [ ] Start: `npm start`

---

## 📝 API Response Examples

### Get Leads
```json
{
  "leads": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "123-456-7890",
      "status": "CONTACTED",
      "notes": null,
      "assignedTo": "operator-uuid",
      "createdAt": "2025-01-01T10:00:00Z",
      "comments": [
        {
          "id": "comment-uuid",
          "text": "Called customer",
          "author": { "name": "Operator Name" },
          "createdAt": "2025-01-02T10:00:00Z"
        }
      ],
      "assignedUser": { "id", "name", "email" }
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### Get Claim Detail
```json
{
  "id": "claim-uuid",
  "title": "Insurance Claim #123",
  "description": "Claim for damage assessment",
  "status": "IN_REVIEW",
  "assignedTo": "operator-uuid",
  "clientId": "client-uuid",
  "files": ["file1.pdf", "file2.jpg"],
  "createdAt": "2025-01-01T10:00:00Z",
  "client": {
    "id": "client-uuid",
    "name": "Client Name",
    "email": "client@example.com"
  },
  "assignedUser": { "id", "name" },
  "comments": [
    {
      "id": "comment-uuid",
      "text": "Initial review completed",
      "author": { "id", "name", "email" },
      "createdAt": "2025-01-02T10:00:00Z"
    }
  ]
}
```

---

## 🔄 Next Steps & Enhancements

1. **Real-time Updates**
   - Implement WebSockets for live comment updates
   - Real-time status change notifications

2. **File Management**
   - File upload for claims
   - File preview functionality

3. **Advanced Filtering**
   - Date range filters
   - Multi-status filtering
   - Client name search

4. **Export Functionality**
   - Export leads/claims to CSV/PDF
   - Generate reports

5. **Notifications**
   - Email notifications on status changes
   - In-app notification center

6. **Mobile App**
   - React Native mobile app
   - Offline support

---

## 🐛 Troubleshooting

### API Returns 401 Unauthorized
- Check token is stored in localStorage
- Verify token is being sent in Authorization header
- Check token hasn't expired

### API Returns 403 Forbidden
- Verify user role is "OPERATOR"
- Confirm resource is assigned to current operator
- Check backend authorization logic

### No Data Showing
- Verify database has data assigned to operator
- Check API endpoint in network tab
- Verify pagination parameters

### Comments Not Updating
- Check if new comment was added successfully (201 response)
- Verify refetch() is called after adding comment
- Check browser console for errors

---

## 📞 Support

For issues or questions:
1. Check the API response in browser DevTools
2. Review error messages in console
3. Verify database data exists
4. Check authentication token validity

---

**Implementation Date:** December 3, 2025  
**Status:** ✅ Complete and Ready for Testing
