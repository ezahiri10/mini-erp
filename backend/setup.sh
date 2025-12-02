#!/bin/bash

# Root src folder
mkdir -p src

# Controllers
mkdir -p src/controllers
touch src/controllers/authController.ts
touch src/controllers/usersController.ts
touch src/controllers/leadsController.ts
touch src/controllers/claimsController.ts
touch src/controllers/productsController.ts

# Routes
mkdir -p src/routes
touch src/routes/authRoutes.ts
touch src/routes/userRoutes.ts
touch src/routes/leadRoutes.ts
touch src/routes/claimRoutes.ts
touch src/routes/productRoutes.ts

# Middlewares
mkdir -p src/middlewares
touch src/middlewares/authMiddleware.ts
touch src/middlewares/roleMiddleware.ts

# Utils
mkdir -p src/utils
touch src/utils/hash.ts
touch src/utils/jwt.ts

# Services
mkdir -p src/services
touch src/services/emailService.ts

# App entry points
touch src/app.ts
touch src/server.ts

echo "Backend folder structure created successfully!"
