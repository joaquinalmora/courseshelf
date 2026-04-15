import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { createMaterial, getCourseById } from "@/lib/course-service";
import { buildErrorResponse, parseId } from "@/lib/route-helpers";
import { formatValidationError, materialSchema } from "@/lib/validation";

interface CourseMaterialsRouteProps {
  params: Promise<{
    courseId: string;
  }>;
}

export async function POST(request: Request, { params }: CourseMaterialsRouteProps) {
  const { courseId } = await params;
  const parsedCourseId = parseId(courseId);

  if (!parsedCourseId) {
    return buildErrorResponse("Course not found.", 404);
  }

  const existingCourse = await getCourseById(parsedCourseId);

  if (!existingCourse) {
    return buildErrorResponse("Course not found.", 404);
  }

  try {
    const payload = materialSchema.parse(await request.json());
    const material = await createMaterial(parsedCourseId, payload);

    revalidatePath(`/courses/${parsedCourseId}`);

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return buildErrorResponse(formatValidationError(error), 400);
    }

    return buildErrorResponse("Unable to add the material right now.", 500);
  }
}
