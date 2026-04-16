import { prisma } from "../../lib/prisma";

export async function resetDatabase(): Promise<void> {
  await prisma.material.deleteMany();
  await prisma.course.deleteMany();
}

export function uniqueCourseName(): string {
  return `Course ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
