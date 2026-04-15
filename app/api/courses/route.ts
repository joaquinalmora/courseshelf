import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { createCourse, listCourses } from "@/lib/course-service";
import { buildErrorResponse } from "@/lib/route-helpers";
import { courseSchema, formatValidationError } from "@/lib/validation";

export async function GET() {
  const courses = await listCourses();
  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  try {
    const payload = courseSchema.parse(await request.json());
    const course = await createCourse(payload);

    revalidatePath("/");

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return buildErrorResponse(formatValidationError(error), 400);
    }

    return buildErrorResponse("Unable to create the course right now.", 500);
  }
}
