import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config();

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function testConnection() {
  try {
    console.log("Testing database connection...");
    console.log("Database URL:", process.env.DATABASE_URL);

    await prisma.$connect();
    console.log("Connection successful!");

    // Try a simple query
    const userCount = await prisma.user.count();
    console.log("Number of users:", userCount);
  } catch (error) {
    console.error("Connection error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
