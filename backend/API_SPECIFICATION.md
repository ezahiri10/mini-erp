# Mini-ERP System - Complete REST API Specification

**Version:** 2.0  
**Last Updated:** December 2, 2025  
**Status:** Production Ready

---

## Table of Contents
1. [Authentication Module](#authentication-module)
2. [Users Module (Admin Only)](#users-module-admin-only)
3. [Leads Module](#leads-module)
4. [Clients Module](#clients-module)
5. [Products/Services Module](#productsservices-module)
6. [Assignments Module](#assignments-module)
7. [Authorization Rules](#authorization-rules)
8. [Frontend Integration Guide](#frontend-integration-guide)
9. [Error Handling](#error-handling)
10. [Pagination & Filtering](#pagination--filtering)

---

# AUTHENTICATION MODULE

## POST /api/auth/login
**Login and receive JWT token**

| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **URL Path** | `/api/auth/login` |
| **Required Permissions** | None (Public) |
| **Authentication** | None |

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Validation Rules:**
- Email: Required, valid format (RFC 5322)
- Password: Required, 8+ characters

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "John Admin",
    "email": "john@example.com",
    "role": "ADMIN",
    "status": "ACTIVE"
  },
  "expiresIn": 3600
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials
- `404 Not Found`: User email not registered
- `429 Too Many Requests`: >5 login attempts in 15 minutes

**Frontend Usage:**
```typescript
// pages/login/page.tsx
const handleLogin = async (email: string, password: string) => {
  const response = await apiPost('/api/auth/login', { email, password });
  localStorage.setItem('token', response.token);
  
  // Redirect based on role
  if (response.user.role === 'ADMIN') router.push('/admin');
  else if (response.user.role === 'SUPERVISOR') router.push('/supervisor/dashboard');
  else if (response.user.role === 'OPERATOR') router.push('/operator/dashboard');
  else router.push('/clients/dashboard');
};
```

---

## GET /api/auth/me
**Retrieve current authenticated user**

| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **URL Path** | `/api/auth/me` |
| **Required Permissions** | Authenticated |
| **Authentication** | Bearer Token |

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "John Admin",
  "email": "john@example.com",
  "role": "ADMIN",
  "status": "ACTIVE",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Token expired

**Frontend Usage:**
```typescript
// Verify admin access on page load
useEffect(() => {
  const checkAuth = async () => {
    try {
      const user = await apiGet('/api/auth/me');
      if (user.role !== 'ADMIN') router.push('/login');
      setUser(user);
    } catch (err) {
      router.push('/login');
    }
  };
  checkAuth();
}, []);
```

---

## POST /api/auth/logout
**Invalidate current session**

| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **URL Path** | `/api/auth/logout` |
| **Required Permissions** | Authenticated |
| **Authentication** | Bearer Token |

**Request Body:**
```json
{}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Frontend Usage:**
```typescript
const handleLogout = async () => {
  await apiPost('/api/auth/logout', {});
  localStorage.removeItem('token');
  router.push('/login');
  toast.success('Logged out successfully');
};
```

---

# USERS MODULE (ADMIN ONLY)

## POST /api/users
**Create a new user account**

| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **URL Path** | `/api/users` |
| **Required Permissions** | ADMIN |
| **Authentication** | Bearer Token |

**Request Body:**
```json
{
  "name": "Mike Operator",
  "email": "mike@example.com",
  "password": "TempPassword123!",
  "role": "OPERATOR"
}
```

**Validation Rules:**
- Name: Required, 2-100 characters
- Email: Required, unique, valid format
- Password: Required, 8+ chars, mix of upper/lower/numbers/symbols
- Role: Required, one of: ADMIN, SUPERVISOR, OPERATOR, CLIENT

**Response (201 Created):**
```json
{
  "id": "3",
  "name": "Mike Operator",
  "email": "mike@example.com",
  "role": "OPERATOR",
  "status": "ACTIVE",
  "createdAt": "2024-12-02T14:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed (duplicate email, invalid password)
- `403 Forbidden`: User is not ADMIN
- `409 Conflict`: Email already exists

**Frontend Usage (Admin Users Page):**
```typescript
// Modal: Create User
const handleCreateUser = async (formData) => {
  try {
    const newUser = await apiPost('/api/users', formData);
    toast.success('User created successfully');
    fetchUsers(); // Refresh list
    setModalOpen(false);
  } catch (err) {
    toast.error(err.message);
  }
};
```

---

## GET /api/users
**List all users with pagination and filters**

| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **URL Path** | `/api/users` |
| **Required Permissions** | ADMIN |
| **Authentication** | Bearer Token |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `limit` | integer | 20 | Items per page (max: 100) |
| `role` | string | - | Filter by role: ADMIN, SUPERVISOR, OPERATOR, CLIENT |
| `status` | string | - | Filter by status: ACTIVE, INACTIVE |
| `search` | string | - | Search by name or email |
| `sortBy` | string | createdAt | Sort field: name, email, createdAt, role |
| `sortOrder` | string | desc | asc or desc |

**Example Request:**
```
GET /api/users?role=OPERATOR&status=ACTIVE&page=1&limit=20&sortBy=name&sortOrder=asc
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "3",
      "name": "Mike Operator",
      "email": "mike@example.com",
      "role": "OPERATOR",
      "status": "ACTIVE",
      "createdAt": "2024-10-15T08:00:00Z"
    }
  ],
  "pagination": {
    "total": 8,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not admin role
- `400 Bad Request`: Invalid query parameters

---

## GET /api/users/:id
**Get single user profile**

| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **URL Path** | `/api/users/:id` |
| **Required Permissions** | ADMIN or self |
| **Authentication** | Bearer Token |

**Response (200 OK):**
```json
{
  "id": "3",
  "name": "Mike Operator",
  "email": "mike@example.com",
  "role": "OPERATOR",
  "status": "ACTIVE",
  "createdAt": "2024-10-15T08:00:00Z"
}
```

**Error Responses:**
- `404 Not Found`: User not found
- `403 Forbidden`: Insufficient permissions

---

## PUT /api/users/:id
**Update user information**

| Property | Value |
|----------|-------|
| **HTTP Method** | PUT |
| **URL Path** | `/api/users/:id` |
| **Required Permissions** | ADMIN or self (limited) |
| **Authentication** | Bearer Token |

**Request Body (Admin):**
```json
{
  "name": "Mike Operator Updated",
  "email": "mike.new@example.com",
  "role": "SUPERVISOR",
  "password": "NewPassword123!"
}
```

**Request Body (Self):**
```json
{
  "name": "Mike Operator",
  "email": "mike.new@example.com"
}
```

**Validation Rules:**
- Admins can update: name, email, role, password
- Users can only update: name, email
- Email must be unique across system

**Response (200 OK):**
```json
{
  "id": "3",
  "name": "Mike Operator Updated",
  "email": "mike.new@example.com",
  "role": "SUPERVISOR",
  "status": "ACTIVE",
  "updatedAt": "2024-12-02T15:00:00Z"
}
```

**Error Responses:**
- `404 Not Found`: User not found
- `400 Bad Request`: Validation failed
- `409 Conflict`: Email already exists
- `403 Forbidden`: Insufficient permissions

---

## PATCH /api/users/:id/deactivate
**Soft-delete user (disable account)**

| Property | Value |
|----------|-------|
| **HTTP Method** | PATCH |
| **URL Path** | `/api/users/:id/deactivate` |
| **Required Permissions** | ADMIN |
| **Authentication** | Bearer Token |

**Response (200 OK):**
```json
{
  "id": "3",
  "name": "Mike Operator",
  "status": "INACTIVE",
  "deactivatedAt": "2024-12-02T15:05:00Z"
}
```

---

## PATCH /api/users/:id/activate
**Restore deactivated user**

| Property | Value |
|----------|-------|
| **HTTP Method** | PATCH |
| **URL Path** | `/api/users/:id/activate` |
| **Required Permissions** | ADMIN |
| **Authentication** | Bearer Token |

**Response (200 OK):**
```json
{
  "id": "3",
  "name": "Mike Operator",
  "status": "ACTIVE",
  "activatedAt": "2024-12-02T15:10:00Z"
}
```

---

# LEADS MODULE

## POST /api/leads
**Create a new lead**

| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **URL Path** | `/api/leads` |
| **Required Permissions** | ADMIN, SUPERVISOR, OPERATOR |
| **Authentication** | Bearer Token |

**Request Body:**
```json
{
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "555-0123",
  "status": "NEW",
  "assignedTo": "3"
}
```

**Validation Rules:**
- Name: Required, 2-200 characters
- Email: Required, valid format
- Phone: Optional, valid phone format if provided
- Status: Required, one of: NEW, CONTACTED, CONVERTED, LOST
- assignedTo: Required, must be valid OPERATOR or SUPERVISOR ID

**Response (201 Created):**
```json
{
  "id": "l1",
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "555-0123",
  "status": "NEW",
  "assignedTo": "3",
  "createdAt": "2024-12-02T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed
- `404 Not Found`: Assigned operator/supervisor not found
- `403 Forbidden`: Insufficient permissions

---

## GET /api/leads
**List all leads with filters**

| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **URL Path** | `/api/leads` |
| **Required Permissions** | ADMIN, SUPERVISOR, OPERATOR (own only) |
| **Authentication** | Bearer Token |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page |
| `status` | string | - | Filter: NEW, CONTACTED, CONVERTED, LOST |
| `assignedTo` | string | - | Filter by operator/supervisor ID |
| `search` | string | - | Search by name or email |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "l1",
      "name": "Acme Corporation",
      "email": "contact@acme.com",
      "phone": "555-0123",
      "status": "NEW",
      "assignedTo": "3",
      "createdAt": "2024-12-02T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

## GET /api/leads/:id
**Get single lead details**

| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **URL Path** | `/api/leads/:id` |
| **Required Permissions** | ADMIN, SUPERVISOR, OPERATOR (own only) |
| **Authentication** | Bearer Token |

**Response (200 OK):**
```json
{
  "id": "l1",
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "555-0123",
  "status": "NEW",
  "assignedTo": "3",
  "createdAt": "2024-12-02T10:00:00Z",
  "notes": [
    {
      "id": "n1",
      "text": "Initial contact scheduled",
      "createdBy": "3",
      "createdAt": "2024-12-02T10:15:00Z"
    }
  ]
}
```

---

## PUT /api/leads/:id
**Update lead information**

| Property | Value |
|----------|-------|
| **HTTP Method** | PUT |
| **URL Path** | `/api/leads/:id` |
| **Required Permissions** | ADMIN, SUPERVISOR, assigned OPERATOR |
| **Authentication** | Bearer Token |

**Request Body:**
```json
{
  "name": "Updated Company Name",
  "email": "newemail@acme.com",
  "phone": "555-9999",
  "status": "CONTACTED",
  "assignedTo": "4"
}
```

**Response (200 OK):**
```json
{
  "id": "l1",
  "name": "Updated Company Name",
  "status": "CONTACTED",
  "updatedAt": "2024-12-02T12:00:00Z"
}
```

---

## DELETE /api/leads/:id
**Delete a lead**

| Property | Value |
|----------|-------|
| **HTTP Method** | DELETE |
| **URL Path** | `/api/leads/:id` |
| **Required Permissions** | ADMIN, SUPERVISOR |
| **Authentication** | Bearer Token |

**Response (200 OK):**
```json
{
  "message": "Lead deleted successfully"
}
```

---

## POST /api/leads/:id/convert
**Convert lead to client**

| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **URL Path** | `/api/leads/:id/convert` |
| **Required Permissions** | ADMIN, SUPERVISOR, assigned OPERATOR |
| **Authentication** | Bearer Token |

**Request Body:**
```json
{
  "notes": "Successfully converted after 3 meetings"
}
```

**Response (200 OK):**
```json
{
  "lead": {
    "id": "l1",
    "status": "CONVERTED",
    "convertedAt": "2024-12-02T13:00:00Z"
  },
  "client": {
    "id": "c1",
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "555-0123",
    "status": "ACTIVE",
    "totalIncome": 0,
    "createdAt": "2024-12-02T13:00:00Z"
  }
}
```

---

# CLIENTS MODULE

## POST /api/clients
**Create a new client manually**

| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **URL Path** | `/api/clients` |
| **Required Permissions** | ADMIN, SUPERVISOR |
| **Authentication** | Bearer Token |

**Request Body:**
```json
{
  "name": "Tech Solutions Inc",
  "email": "contact@techsol.com",
  "phone": "555-5555"
}
```

**Response (201 Created):**
```json
{
  "id": "c2",
  "name": "Tech Solutions Inc",
  "email": "contact@techsol.com",
  "phone": "555-5555",
  "status": "ACTIVE",
  "totalIncome": 0,
  "createdAt": "2024-12-02T14:00:00Z"
}
```

---

## GET /api/clients
**List all clients with filters**

| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **URL Path** | `/api/clients` |
| **Required Permissions** | ADMIN, SUPERVISOR, OPERATOR |
| **Authentication** | Bearer Token |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page |
| `status` | string | - | Filter: ACTIVE, INACTIVE |
| `search` | string | - | Search by name/email |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "c1",
      "name": "Acme Corporation",
      "email": "contact@acme.com",
      "phone": "555-0123",
      "status": "ACTIVE",
      "totalIncome": 45000,
      "productsCount": 3,
      "createdAt": "2024-10-01T08:00:00Z"
    }
  ],
  "pagination": {
    "total": 28,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  }
}
```

---

## GET /api/clients/:id
**Get full client profile with all relationships**

| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **URL Path** | `/api/clients/:id` |
| **Required Permissions** | ADMIN, SUPERVISOR, OPERATOR |
| **Authentication** | Bearer Token |

**Response (200 OK):**
```json
{
  "id": "c1",
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "555-0123",
  "status": "ACTIVE",
  "totalIncome": 45000,
  "createdAt": "2024-10-01T08:00:00Z",
  "productsAssigned": [
    {
      "id": "p1",
      "name": "Premium Insurance",
      "type": "SERVICE",
      "price": 299,
      "assignedDate": "2024-10-15T10:00:00Z"
    }
  ],
  "claimsHistory": [
    {
      "id": "cl1",
      "title": "Insurance Claim #001",
      "status": "RESOLVED",
      "amount": 5000,
      "submittedDate": "2024-11-01T09:00:00Z"
    }
  ]
}
```

---

## PUT /api/clients/:id
**Update client profile**

| Property | Value |
|----------|-------|
| **HTTP Method** | PUT |
| **URL Path** | `/api/clients/:id` |
| **Required Permissions** | ADMIN, SUPERVISOR |
| **Authentication** | Bearer Token |

**Request Body:**
```json
{
  "name": "Acme Corp - Updated",
  "email": "newemail@acme.com",
  "phone": "555-0000"
}
```

**Response (200 OK):**
```json
{
  "id": "c1",
  "name": "Acme Corp - Updated",
  "email": "newemail@acme.com",
  "phone": "555-0000",
  "updatedAt": "2024-12-02T15:00:00Z"
}
```

---

## DELETE /api/clients/:id
**Delete client**

| Property | Value |
|----------|-------|
| **HTTP Method** | DELETE |
| **URL Path** | `/api/clients/:id` |
| **Required Permissions** | ADMIN |
| **Authentication** | Bearer Token |

**Response (200 OK):**
```json
{
  "message": "Client deleted successfully"
}
```

---

# PRODUCTS/SERVICES MODULE

## POST /api/products
**Create a product or service**

| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **URL Path** | `/api/products` |
| **Required Permissions** | ADMIN, SUPERVISOR |
| **Authentication** | Bearer Token |

**Request Body:**
```json
{
  "name": "Premium Insurance Plan",
  "type": "SERVICE",
  "price": 299,
  "description": "Comprehensive insurance coverage"
}
```

**Response (201 Created):**
```json
{
  "id": "p1",
  "name": "Premium Insurance Plan",
  "type": "SERVICE",
  "price": 299,
  "createdAt": "2024-12-02T10:00:00Z"
}
```

---

## GET /api/products
**List all products/services**

| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **URL Path** | `/api/products` |
| **Required Permissions** | ADMIN, SUPERVISOR, OPERATOR |
| **Authentication** | Bearer Token |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page |
| `type` | string | - | Filter: PRODUCT, SERVICE |
| `search` | string | - | Search by name |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "p1",
      "name": "Premium Insurance Plan",
      "type": "SERVICE",
      "price": 299,
      "clientsCount": 12,
      "createdAt": "2024-11-01T08:00:00Z"
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

## GET /api/products/:id
**Get single product details**

| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **URL Path** | `/api/products/:id` |
| **Required Permissions** | ADMIN, SUPERVISOR |
| **Authentication** | Bearer Token |

**Response (200 OK):**
```json
{
  "id": "p1",
  "name": "Premium Insurance Plan",
  "type": "SERVICE",
  "price": 299,
  "createdAt": "2024-11-01T08:00:00Z",
  "assignedClients": [
    {
      "id": "c1",
      "name": "Acme Corporation",
      "assignedDate": "2024-10-15T10:00:00Z"
    }
  ]
}
```

---

## PUT /api/products/:id
**Update product information**

| Property | Value |
|----------|-------|
| **HTTP Method** | PUT |
| **URL Path** | `/api/products/:id` |
| **Required Permissions** | ADMIN, SUPERVISOR |
| **Authentication** | Bearer Token |

**Request Body:**
```json
{
  "name": "Premium Insurance Plus",
  "price": 349
}
```

**Response (200 OK):**
```json
{
  "id": "p1",
  "name": "Premium Insurance Plus",
  "price": 349,
  "updatedAt": "2024-12-02T15:00:00Z"
}
```

---

## DELETE /api/products/:id
**Delete product**

| Property | Value |
|----------|-------|
| **HTTP Method** | DELETE |
| **URL Path** | `/api/products/:id` |
| **Required Permissions** | ADMIN |
| **Authentication** | Bearer Token |

**Response (200 OK):**
```json
{
  "message": "Product deleted successfully"
}
```

---

## POST /api/products/:id/assign
**Assign product to a client**

| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **URL Path** | `/api/products/:id/assign` |
| **Required Permissions** | ADMIN, SUPERVISOR |
| **Authentication** | Bearer Token |

**Request Body:**
```json
{
  "clientId": "c1"
}
```

**Response (201 Created):**
```json
{
  "id": "pa1",
  "productId": "p1",
  "clientId": "c1",
  "assignedDate": "2024-12-02T15:00:00Z"
}
```

---

# ASSIGNMENTS MODULE

## POST /api/assignments
**Create operator-supervisor binding**

| Property | Value |
|----------|-------|
| **HTTP Method** | POST |
| **URL Path** | `/api/assignments` |
| **Required Permissions** | ADMIN |
| **Authentication** | Bearer Token |

**Request Body:**
```json
{
  "operatorId": "3",
  "supervisorId": "2"
}
```

**Response (201 Created):**
```json
{
  "id": "a1",
  "operatorId": "3",
  "operatorName": "Mike Operator",
  "supervisorId": "2",
  "supervisorName": "Sarah Supervisor",
  "status": "ACTIVE",
  "createdAt": "2024-12-02T10:00:00Z"
}
```

---

## GET /api/assignments
**List all operator-supervisor bindings**

| Property | Value |
|----------|-------|
| **HTTP Method** | GET |
| **URL Path** | `/api/assignments` |
| **Required Permissions** | ADMIN, SUPERVISOR |
| **Authentication** | Bearer Token |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page |
| `supervisorId` | string | - | Filter by supervisor |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "a1",
      "operatorId": "3",
      "operatorName": "Mike Operator",
      "supervisorId": "2",
      "supervisorName": "Sarah Supervisor",
      "status": "ACTIVE",
      "createdAt": "2024-11-01T08:00:00Z"
    }
  ],
  "pagination": {
    "total": 8,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

# AUTHORIZATION RULES

## Role-Based Access Control

### ADMIN Role
- ✅ Full user management (create, read, update, deactivate, activate)
- ✅ Manage user roles and permissions
- ✅ Reset user passwords
- ✅ Full lead management
- ✅ Full client management
- ✅ Manage products/services
- ✅ Create/update/delete assignments
- ✅ View all analytics and reports

### SUPERVISOR Role
- ✅ View/manage operators assigned to them
- ✅ View/update leads of their operators
- ✅ View clients related to their team
- ✅ Create new leads for their team
- ✅ View products available

### OPERATOR Role
- ✅ View assigned leads only
- ✅ Update lead statuses
- ✅ Convert leads to clients
- ✅ View assigned products

### CLIENT Role
- ✅ View assigned services/products
- ✅ Submit claims
- ✅ View invoices and payment history

---

# FRONTEND INTEGRATION GUIDE

## Admin Dashboard Integration

**Endpoints Called:**
```
GET /api/auth/me - Verify admin access
GET /api/users - Fetch user count
GET /api/leads - Fetch lead statistics
GET /api/clients - Fetch client count
GET /api/products - Fetch product count
```

**UI Components:**
- Stat cards with metrics and trend indicators
- Charts showing lead conversion rates
- Quick action buttons for creating entities
- Activity feed showing recent updates

---

## Users Management Integration

**Create User:**
```typescript
await apiPost('/api/users', {
  name: formData.name,
  email: formData.email,
  password: formData.password,
  role: formData.role
});
```

**Update User:**
```typescript
await apiPut(`/api/users/${userId}`, {
  name, email, role, password
});
```

**Deactivate User:**
```typescript
await apiPatch(`/api/users/${userId}/deactivate`, {});
```

**Activate User:**
```typescript
await apiPatch(`/api/users/${userId}/activate`, {});
```

---

## Leads Management Integration

**Create Lead:**
```typescript
await apiPost('/api/leads', {
  name, email, phone, status: 'NEW', assignedTo
});
```

**Update Lead Status:**
```typescript
await apiPut(`/api/leads/${leadId}`, {
  status: newStatus
});
```

**Convert to Client:**
```typescript
await apiPost(`/api/leads/${leadId}/convert`, {
  notes: conversionNotes
});
```

---

## Clients Management Integration

**Create Client:**
```typescript
await apiPost('/api/clients', { name, email, phone });
```

**Get Client with Details:**
```typescript
const client = await apiGet(`/api/clients/${clientId}`);
// Returns: profile, products, claims, income stats
```

**Assign Product:**
```typescript
await apiPost(`/api/products/${productId}/assign`, {
  clientId
});
```

---

# ERROR HANDLING

## Standard Error Format

```json
{
  "error": "Validation Error",
  "code": "VALIDATION_FAILED",
  "message": "One or more validation errors occurred",
  "details": {
    "email": "Email already exists"
  },
  "timestamp": "2024-12-02T15:30:00Z"
}
```

## HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | GET successful |
| 201 | Created | POST successful |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | No token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Email exists |
| 429 | Too Many Requests | Rate limited |
| 500 | Server Error | Database error |

---

# PAGINATION & FILTERING

## Pagination Format

All list endpoints support:
```
?page=1&limit=20
```

Response:
```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

## Common Filters

- Text search: `?search=term`
- Role filter: `?role=OPERATOR`
- Status filter: `?status=ACTIVE`
- Combined: `?role=OPERATOR&status=ACTIVE&page=1`

---

**API Specification Complete**  
**Last Updated:** December 2, 2025  
**Version:** 2.0
