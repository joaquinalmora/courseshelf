import { prisma } from "../lib/prisma";

async function resetDatabase() {
  // Delete children first so SQLite foreign keys stay happy.
  await prisma.material.deleteMany();
  await prisma.course.deleteMany();
}

resetDatabase()
  .catch((error: unknown) => {
    console.error("Failed to reset the database.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
