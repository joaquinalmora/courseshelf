import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { CourseDetail, CourseSummary, MaterialRecord } from "@/lib/types";
import type { CourseInput, MaterialInput } from "@/lib/validation";

const courseSummaryInclude = {
  _count: {
    select: {
      materials: true,
    },
  },
} satisfies Prisma.CourseInclude;

const courseDetailInclude = {
  materials: {
    orderBy: {
      createdAt: "desc",
    },
  },
} satisfies Prisma.CourseInclude;

function toMaterialRecord(material: {
  id: number;
  title: string;
  type: string;
  description: string;
  link: string;
}): MaterialRecord {
  return {
    id: material.id,
    title: material.title,
    type: material.type as MaterialRecord["type"],
    description: material.description,
    link: material.link,
  };
}

function toCourseSummary(course: {
  id: number;
  courseName: string;
  department: string;
  term: string;
  _count: {
    materials: number;
  };
}): CourseSummary {
  return {
    id: course.id,
    courseName: course.courseName,
    department: course.department as CourseSummary["department"],
    term: course.term,
    materialCount: course._count.materials,
  };
}

function toCourseDetail(course: {
  id: number;
  courseName: string;
  department: string;
  term: string;
  materials: Array<{
    id: number;
    title: string;
    type: string;
    description: string;
    link: string;
  }>;
}): CourseDetail {
  return {
    id: course.id,
    courseName: course.courseName,
    department: course.department as CourseDetail["department"],
    term: course.term,
    materials: course.materials.map(toMaterialRecord),
  };
}

export async function listCourses(): Promise<CourseSummary[]> {
  const courses = await prisma.course.findMany({
    include: courseSummaryInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return courses.map(toCourseSummary);
}

export async function getCourseById(id: number): Promise<CourseDetail | null> {
  const course = await prisma.course.findUnique({
    where: { id },
    include: courseDetailInclude,
  });

  return course ? toCourseDetail(course) : null;
}

export async function createCourse(input: CourseInput): Promise<CourseSummary> {
  const course = await prisma.course.create({
    data: input,
    include: courseSummaryInclude,
  });

  return toCourseSummary(course);
}

export async function deleteCourse(courseId: number): Promise<boolean> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
    },
  });

  if (!course) {
    return false;
  }

  await prisma.course.delete({
    where: { id: courseId },
  });

  return true;
}

export async function createMaterial(courseId: number, input: MaterialInput): Promise<MaterialRecord> {
  const material = await prisma.material.create({
    data: {
      ...input,
      courseId,
    },
  });

  return toMaterialRecord(material);
}

export async function deleteMaterial(materialId: number): Promise<number | null> {
  const material = await prisma.material.findUnique({
    where: { id: materialId },
    select: {
      courseId: true,
    },
  });

  if (!material) {
    return null;
  }

  await prisma.material.delete({
    where: { id: materialId },
  });

  return material.courseId;
}
