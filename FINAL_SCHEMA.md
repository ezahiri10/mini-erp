# Final Cleaned Schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  SUPERVISOR
  OPERATOR
  CLIENT
}

enum UserStatus {
  ACTIVE
  INACTIVE
}

enum LeadStatus {
  NEW
  CONTACTED
  CONVERTED
  LOST
}

enum ClaimStatus {
  SUBMITTED
  IN_REVIEW
  RESOLVED
}

enum CommentType {
  LEAD
  CLAIM
}

model User {
  id    String @id @default(uuid())
  name  String
  email String @unique
  password String
  role  Role
  status UserStatus @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Operator / Supervisor relations
  assignedLeads Lead[] @relation("AssignedLeads")
  assignedClaims Claim[] @relation("AssignedClaims")

  // Client relations
  claims Claim[] @relation("ClientClaims")
  products Product[] @relation("ClientProducts")
  comments Comment[]
}

model Lead {
  id String @id @default(uuid())
  name String
  email String
  phone String?
  status LeadStatus @default(NEW)
  notes String?
  assignedTo String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  assignedUser User? @relation("AssignedLeads", fields: [assignedTo], references: [id], onDelete: SetNull)
  comments Comment[]

  @@index([assignedTo])
  @@index([status])
}

model Claim {
  id String @id @default(uuid())
  title String
  description String?
  status ClaimStatus @default(SUBMITTED)
  assignedTo String?
  clientId String
  files String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  assignedUser User? @relation("AssignedClaims", fields: [assignedTo], references: [id], onDelete: SetNull)
  client User @relation("ClientClaims", fields: [clientId], references: [id], onDelete: Cascade)
  comments Comment[]

  @@index([clientId])
  @@index([assignedTo])
  @@index([status])
}

model Product {
  id String @id @default(uuid())
  name String
  type String?
  price Float
  description String?
  clientId String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  client User? @relation("ClientProducts", fields: [clientId], references: [id], onDelete: SetNull)

  @@index([clientId])
}

model Comment {
  id String @id @default(uuid())
  text String
  authorId String
  leadId String?
  claimId String?
  createdAt DateTime @default(now())

  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)
  lead Lead? @relation(fields: [leadId], references: [id], onDelete: Cascade)
  claim Claim? @relation(fields: [claimId], references: [id], onDelete: Cascade)

  @@index([authorId])
  @@index([leadId])
  @@index([claimId])
}
```

## Key Improvements in This Schema

1. **Type Safety**: Replaced string statuses with proper enums
2. **Performance**: Added 8 strategic indexes
3. **Data Integrity**: Implemented cascade delete and SetNull rules
4. **Audit Trail**: Added `updatedAt` timestamps
5. **Clarity**: Improved relation names for semantic meaning
6. **Organization**: Enums first, models in logical order

## Migration Command
```bash
cd backend
npx prisma migrate dev --name schema_cleanup_v1
```
