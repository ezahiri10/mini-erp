# Backend Login Endpoint Documentation - TO-DO

## Endpoint: POST /api/auth/login

### Purpose
Authenticate a user with email, password, and role. Return authentication tokens and user information.

---

## Request

### Method
`POST`

### URL
`http://localhost:5000/api/auth/login`

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Body (JSON)
```json
{
  "email": "demo@example.com",
  "password": "password123",
  "role": "Operator"
}
```

### Body Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | User's email address (must be valid format) |
| `password` | string | Yes | User's password (plain text - will be hashed) |
| `role` | string | Yes | User's role: `Admin`, `Supervisor`, `Operator`, or `Client` |

---

## Response

### Success Response (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid-123",
    "email": "demo@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Operator",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `token` | string | JWT token for authentication (store in localStorage) |
| `authToken` | string | Alternative auth token (backup storage) |
| `user` | object | Authenticated user object with profile info |
| `user.id` | string | Unique user identifier |
| `user.email` | string | User's email |
| `user.firstName` | string | User's first name |
| `user.lastName` | string | User's last name |
| `user.role` | string | User's role (must match login request role) |
| `user.createdAt` | string | ISO timestamp of user creation |

### Error Response (401 Unauthorized)
```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

### Error Response (400 Bad Request)
```json
{
  "error": "Missing required fields",
  "message": "Email, password, and role are required"
}
```

### Error Response (403 Forbidden)
```json
{
  "error": "Invalid role",
  "message": "User role does not match requested role"
}
```

---

## Implementation Requirements

### Backend To-Do List

- [ ] **Validate Input**
  - [ ] Check email is provided and valid format
  - [ ] Check password is provided (non-empty)
  - [ ] Check role is provided and is one of: `Admin`, `Supervisor`, `Operator`, `Client`
  - [ ] Return 400 if any required field is missing

- [ ] **Find User**
  - [ ] Query database for user with matching email
  - [ ] Return 401 if user not found
  - [ ] Return 401 if user account is inactive/disabled

- [ ] **Validate Role**
  - [ ] Check if user's role in database matches the role sent in request
  - [ ] Return 403 if roles don't match
  - [ ] Support multiple roles per user if needed

- [ ] **Validate Password**
  - [ ] Compare plain text password with bcrypt hash in database
  - [ ] Return 401 if password is incorrect
  - [ ] Do NOT store plain text passwords

- [ ] **Generate Tokens**
  - [ ] Create JWT token (primary auth token)
  - [ ] Create authToken (backup/alternative token)
  - [ ] Set expiration time (e.g., 24 hours)
  - [ ] Include user ID and role in token payload

- [ ] **Set Cookies**
  - [ ] Set `credentials: "include"` to enable cookie storage
  - [ ] Store tokens in httpOnly cookies (optional but recommended for security)
  - [ ] Set SameSite=Strict for CSRF protection

- [ ] **Return Response**
  - [ ] Return 200 status with token and user object
  - [ ] Include all required user fields
  - [ ] Ensure user.role matches the authenticated role

- [ ] **Database Schema Requirements**
  - [ ] User table must have: `id`, `email`, `password` (hashed), `firstName`, `lastName`, `role`, `isActive`, `createdAt`
  - [ ] User.role must support: `Admin`, `Supervisor`, `Operator`, `Client`
  - [ ] Ensure email is unique with database constraint

---

## Security Considerations

- [ ] Hash passwords using bcrypt (salt rounds: 10+)
- [ ] Never return password in response
- [ ] Use HTTPS in production
- [ ] Implement rate limiting to prevent brute force attacks
- [ ] Add login attempt logging for audit trail
- [ ] Validate token expiration
- [ ] Use strong JWT secret key (>32 characters)
- [ ] Consider adding CORS configuration for frontend domain
- [ ] Add account lockout after N failed login attempts

---

## Frontend Integration

The frontend (`/app/login/page.tsx`) is already configured to:
- [ ] Send POST request to `/api/auth/login` with `email`, `password`, `role`
- [ ] Store `token` and `authToken` in localStorage
- [ ] Store user `role` in localStorage as `userRole`
- [ ] Redirect to `/clients/dashboard` on success
- [ ] Display error messages from `error` or `message` fields
- [ ] Support role selection dropdown with 4 roles

---

## Test Cases

### ✅ Success Case
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123",
    "role": "Operator"
  }'
```

### ❌ Missing Email
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "password": "password123",
    "role": "Operator"
  }'
# Expected: 400 Missing required fields
```

### ❌ Wrong Password
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "wrongpassword",
    "role": "Operator"
  }'
# Expected: 401 Invalid credentials
```

### ❌ Wrong Role
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123",
    "role": "Admin"
  }'
# Expected: 403 Invalid role (if user is actually Operator)
```

### ❌ User Not Found
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "password123",
    "role": "Client"
  }'
# Expected: 401 Invalid credentials
```

---

## Related API Functions

- `apiLogin()` - Frontend function that calls this endpoint
- `apiGetCurrentUser()` - GET /api/auth/me - Fetch current user info
- `apiLogout()` - POST /api/auth/logout - Logout user

---

## Notes

- Role validation is now part of login (required field)
- Frontend supports 4 roles: Admin, Supervisor, Operator, Client
- Update `apiLogin()` function signature if needed to pass role parameter
- Debug page at `/debug` can be used for testing the endpoint
