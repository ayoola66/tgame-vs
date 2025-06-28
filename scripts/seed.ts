import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcryptjs.hash("Passw0rd", 10);

  // Create database admin user
  await prisma.user.upsert({
    where: { email: "ayoola@ayoola.me" },
    update: {},
    create: {
      email: "ayoola@ayoola.me",
      name: "Database Admin",
      password: hashedPassword,
      role: "ADMIN",
      adminRole: "SUPER_ADMIN",
      tier: "PREMIUM",
    },
  });

  // Create frontend super admin
  await prisma.user.upsert({
    where: { email: "superadmin@elitegames.com" },
    update: {},
    create: {
      email: "superadmin@elitegames.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "ADMIN",
      adminRole: "SUPER_ADMIN",
      tier: "PREMIUM",
    },
  });

  // Create free user
  await prisma.user.upsert({
    where: { email: "free@elitegames.com" },
    update: {},
    create: {
      email: "free@elitegames.com",
      name: "Free User",
      password: hashedPassword,
      role: "USER",
      tier: "FREE",
    },
  });

  // Create premium user
  await prisma.user.upsert({
    where: { email: "premium@elitegames.com" },
    update: {},
    create: {
      email: "premium@elitegames.com",
      name: "Premium User",
      password: hashedPassword,
      role: "USER",
      tier: "PREMIUM",
    },
  });

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
