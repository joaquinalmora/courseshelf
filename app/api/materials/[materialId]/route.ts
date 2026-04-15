import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { deleteMaterial } from "@/lib/course-service";
import { buildErrorResponse, parseId } from "@/lib/route-helpers";

interface MaterialRouteProps {
  params: Promise<{
    materialId: string;
  }>;
}

export async function DELETE(_request: Request, { params }: MaterialRouteProps) {
  const { materialId } = await params;
  const parsedMaterialId = parseId(materialId);

  if (!parsedMaterialId) {
    return buildErrorResponse("Material not found.", 404);
  }

  const courseId = await deleteMaterial(parsedMaterialId);

  if (!courseId) {
    return buildErrorResponse("Material not found.", 404);
  }

  revalidatePath(`/courses/${courseId}`);

  return NextResponse.json({ message: "Material deleted." });
}
