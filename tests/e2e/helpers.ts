import { prisma } from "../../lib/prisma";

export async function resetDatabase(): Promise<void> {
  await prisma.material.deleteMany();
  await prisma.course.deleteMany();
}

export function uniqueCourseName(): string {
  return `Course ${Date.now()}`;
}
