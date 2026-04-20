import {
  Form,
  Link,
  data,
  redirect,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "react-router";
import type { MetaFunction } from "react-router";

import { DeleteConfirmationButton } from "@/app/components/delete-confirmation-button";
import { FieldErrors } from "@/app/components/field-errors";
import { MATERIAL_TYPE_OPTIONS } from "@/lib/constants";
import { createMaterial, deleteMaterial, getCourseById } from "@/lib/course-service";
import { parseId } from "@/lib/route-helpers";
import { materialSchema } from "@/lib/validation";

interface MaterialFormValues {
  title: string;
  type: string;
  description: string;
  link: string;
}

interface CourseActionData {
  fieldErrors?: Partial<Record<keyof MaterialFormValues, string[]>>;
  addValues?: MaterialFormValues;
  deletedCourseId?: number;
  deletedMaterialId?: number;
  deleteErrorMessage?: string;
  deleteErrorMaterialId?: number;
}

export const meta: MetaFunction<typeof loader> = ({ data: courseData }) => {
  if (!courseData?.course) {
    return [{ title: "CourseShelf" }];
  }

  return [{ title: `${courseData.course.courseName} | CourseShelf` }];
};

export async function loader({ params }: { params: Record<string, string | undefined> }) {
  // Route params arrive as strings, so validate before querying Prisma.
  const parsedCourseId = parseId(params.courseId ?? "");

  if (!parsedCourseId) {
    throw new Response("Not found", { status: 404 });
  }

  const course = await getCourseById(parsedCourseId);

  if (!course) {
    throw new Response("Not found", { status: 404 });
  }

  return data({ course });
}

export async function action({ request, params }: { request: Request; params: Record<string, string | undefined> }) {
  // Re-validate the route param for writes as well as reads.
  const parsedCourseId = parseId(params.courseId ?? "");

  if (!parsedCourseId) {
    throw new Response("Not found", { status: 404 });
  }

  const formData = await request.formData();

  // Use one action handler and branch by hidden form intent.
  const intent = String(formData.get("intent") ?? "");

  if (intent === "add-material") {
    const values: MaterialFormValues = {
      title: String(formData.get("title") ?? ""),
      type: String(formData.get("type") ?? MATERIAL_TYPE_OPTIONS[0]),
      description: String(formData.get("description") ?? ""),
      link: String(formData.get("link") ?? ""),
    };

    const validationResult = materialSchema.safeParse(values);

    if (!validationResult.success) {
      return data<CourseActionData>(
        {
          fieldErrors: validationResult.error.flatten().fieldErrors,
          addValues: values,
        },
        { status: 400 },
      );
    }

    await createMaterial(parsedCourseId, validationResult.data);
    return redirect(`/courses/${parsedCourseId}`);
  }

  if (intent === "delete-material") {
    const parsedMaterialId = parseId(String(formData.get("materialId") ?? ""));

    if (!parsedMaterialId) {
      return data<CourseActionData>(
        {
          deleteErrorMessage: "Material not found.",
        },
        { status: 404 },
      );
    }

    const deletedCourseId = await deleteMaterial(parsedMaterialId);

    if (!deletedCourseId) {
      return data<CourseActionData>(
        {
          deleteErrorMessage: "Material not found.",
          deleteErrorMaterialId: parsedMaterialId,
        },
        { status: 404 },
      );
    }

    return data<CourseActionData>({ deletedMaterialId: parsedMaterialId, deletedCourseId });
  }

  return data<CourseActionData>(
    {},
    { status: 400 },
  );
}

export default function CourseRoute() {
  const { course } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const fieldErrors = actionData?.fieldErrors ?? {};
  const submittingIntent = navigation.formData?.get("intent");
  const isAddingMaterial = navigation.state === "submitting" && submittingIntent === "add-material";

  return (
    <main className="page-shell">
      <div className="back-link-wrap">
        <Link className="secondary-link" to="/">
          ← Back to dashboard
        </Link>
      </div>

      <section className="hero-card hero-card--compact">
        <div>
          <p className="eyebrow">Course details</p>
          <h1>{course.courseName}</h1>
          <div className="meta-row">
            <span className="pill">{course.department}</span>
            <span className="pill pill--outline">{course.term}</span>
          </div>
        </div>

        <Form className="form-card" method="post" noValidate preventScrollReset>
          <input name="intent" type="hidden" value="add-material" />

          <div className="form-heading">
            <h2>Add material</h2>
            <p>Use links only. File uploads are intentionally out of scope for this project.</p>
          </div>

          <label className="field-group">
            <span>Title</span>
            <input
              aria-describedby={fieldErrors.title ? "material-title-errors" : undefined}
              aria-invalid={fieldErrors.title ? true : undefined}
              defaultValue={actionData?.addValues?.title ?? ""}
              name="title"
              placeholder="Week 1 notes"
            />
          </label>
          <FieldErrors id="material-title-errors" messages={fieldErrors.title} />

          <label className="field-group">
            <span>Type</span>
            <select
              aria-describedby={fieldErrors.type ? "material-type-errors" : undefined}
              aria-invalid={fieldErrors.type ? true : undefined}
              defaultValue={actionData?.addValues?.type ?? MATERIAL_TYPE_OPTIONS[0]}
              name="type"
            >
              {MATERIAL_TYPE_OPTIONS.map((materialType) => (
                <option key={materialType} value={materialType}>
                  {materialType}
                </option>
              ))}
            </select>
          </label>
          <FieldErrors id="material-type-errors" messages={fieldErrors.type} />

          <label className="field-group">
            <span>Description</span>
            <textarea
              aria-describedby={fieldErrors.description ? "material-description-errors" : undefined}
              aria-invalid={fieldErrors.description ? true : undefined}
              defaultValue={actionData?.addValues?.description ?? ""}
              name="description"
              placeholder="Foundational reading for the first week."
              rows={3}
            />
          </label>
          <FieldErrors id="material-description-errors" messages={fieldErrors.description} />

          <label className="field-group">
            <span>Link</span>
            <input
              aria-describedby={fieldErrors.link ? "material-link-errors" : undefined}
              aria-invalid={fieldErrors.link ? true : undefined}
              defaultValue={actionData?.addValues?.link ?? ""}
              name="link"
              placeholder="https://example.com/week-1"
            />
          </label>
          <FieldErrors id="material-link-errors" messages={fieldErrors.link} />

          <button className="primary-button" disabled={isAddingMaterial} type="submit">
            {isAddingMaterial ? "Saving..." : "Add material"}
          </button>
        </Form>
      </section>

      <section className="content-section">
        <div className="section-header">
          <div className="section-heading">
            <p className="eyebrow">Materials</p>
            <h2>
              {course.materials.length} item{course.materials.length === 1 ? "" : "s"}
            </h2>
          </div>
        </div>

        {course.materials.length === 0 ? (
          <div className="empty-state">
            <h3>No materials yet</h3>
            <p>Add a material link to populate this course.</p>
          </div>
        ) : (
          <div className="material-grid">
            {course.materials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function MaterialCard({
  material,
}: {
  material: {
    id: number;
    type: string;
    title: string;
    description: string;
    link: string;
  };
}) {
  const deleteFetcher = useFetcher<CourseActionData>();
  const isDeleting = deleteFetcher.state !== "idle";
  const deleteError =
    deleteFetcher.data?.deleteErrorMaterialId === material.id ? deleteFetcher.data.deleteErrorMessage : undefined;

  return (
    <article className="material-card">
      <div className="material-card-header">
        <div>
          <p className="course-term">{material.type}</p>
          <h3>{material.title}</h3>
        </div>

        <div className="delete-action">
          <deleteFetcher.Form method="post">
            <input name="intent" type="hidden" value="delete-material" />
            <input name="materialId" type="hidden" value={material.id} />
            <DeleteConfirmationButton
              buttonLabel="Delete material"
              confirmActionLabel="Delete material"
              confirmDescription="This will permanently remove this material from the course."
              confirmTitle="Delete this material?"
              isSubmitting={isDeleting}
              pendingLabel="Removing..."
              preferenceKey="courseshelf:skip-material-delete-confirmation"
            />
          </deleteFetcher.Form>

          {deleteError ? (
            <p className="error-message" role="alert">
              {deleteError}
            </p>
          ) : null}
        </div>
      </div>

      <p className="material-description">{material.description}</p>
      <a className="primary-link" href={material.link} rel="noreferrer" target="_blank">
        Open material
      </a>
    </article>
  );
}
