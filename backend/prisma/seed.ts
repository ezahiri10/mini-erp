import prisma from "../src/utils/prisma.ts";
import { hashPassword } from "../src/utils/hash.ts";

async function main() {
  console.log("Seeding database...\n");

  // Delete existing users
  try {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["demo@example.com", "admin@example.com"],
        },
      },
    });
    console.log("Deleted existing users\n");
  } catch (e) {
    console.log("No existing users to delete");
  }

  // Create a test user with Operator role
  const operatorPassword = "password123";
  const operatorHashedPassword = await hashPassword(operatorPassword);

  try {
    const user = await prisma.user.create({
      data: {
        name: "Demo Operator",
        email: "demo@example.com",
        password: operatorHashedPassword,
        role: "OPERATOR",
      },
    });
    console.log("✓ Created Operator User:");
    console.log(`  Email: demo@example.com`);
    console.log(`  Password: ${operatorPassword}\n`);
  } catch (e) {
    console.log("Error creating operator:", e);
  }

  // Create an admin user
  const adminPassword = "admin@123";
  const adminEmail = "admin@example.com";
  try {
    const adminHashedPassword = await hashPassword(adminPassword);
    const admin = await prisma.user.create({
      data: {
        name: "Demo Admin",
        email: adminEmail,
        password: adminHashedPassword,
        role: "ADMIN",
      },
    });
    console.log("✓ Created Admin User:");
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}\n`);
  } catch (e) {
    console.log("Error creating admin:", e);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
