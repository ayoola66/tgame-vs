import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log("\nChecking all database tables:");

    const users = await prisma.user.findMany({
      include: {
        accounts: true,
        sessions: true,
        gameScores: true,
        orders: true,
        musicUploads: true,
      },
    });
    console.log("\nUsers:", users.length);
    users.forEach((u) => {
      console.log(`\n- ${u.email} (${u.role}, ${u.tier})`);
      console.log(`  * Accounts: ${u.accounts.length}`);
      console.log(`  * Sessions: ${u.sessions.length}`);
      console.log(`  * Game Scores: ${u.gameScores.length}`);
      console.log(`  * Orders: ${u.orders.length}`);
      console.log(`  * Music Uploads: ${u.musicUploads.length}`);
    });

    const categories = await prisma.category.findMany();
    console.log("\nCategories:", categories.length);
    categories.forEach((c) => console.log(`- ${c.name}`));

    const questions = await prisma.question.findMany();
    console.log("\nQuestions:", questions.length);

    const games = await prisma.game.findMany();
    console.log("\nGames:", games.length);
    games.forEach((g) => console.log(`- ${g.name} (${g.type})`));

    const products = await prisma.product.findMany();
    console.log("\nProducts:", products.length);
    products.forEach((p) => console.log(`- ${p.name} ($${p.price})`));

    const coupons = await prisma.coupon.findMany();
    console.log("\nCoupons:", coupons.length);
    coupons.forEach((c) => console.log(`- ${c.code} (${c.discount}% off)`));

    const settings = await prisma.systemSettings.findMany();
    console.log("\nSystem Settings:", settings.length);
    settings.forEach((s) => console.log(`- ${s.key}: ${s.value}`));
  } catch (error) {
    console.error("Error checking data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
