import {
  Form,
  Link,
  data,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import type { MetaFunction } from "react-router";

import { MATERIAL_TYPE_OPTIONS } from "@/lib/constants";
import { createMaterial, deleteMaterial, getCourseById } from "@/lib/course-service";
import { parseId } from "@/lib/route-helpers";
import { formatValidationError, materialSchema } from "@/lib/validation";

interface CourseActionData {
  addErrorMessage?: string;
  addValues?: {
    title: string;
    type: string;
    description: string;
    link: string;
  };
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
  const parsedCourseId = parseId(params.courseId ?? "");

  if (!parsedCourseId) {
    throw new Response("Not found", { status: 404 });
  }

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "add-material") {
    const values = {
      title: String(formData.get("title") ?? ""),
      type: String(formData.get("type") ?? MATERIAL_TYPE_OPTIONS[0]),
      description: String(formData.get("description") ?? ""),
      link: String(formData.get("link") ?? ""),
    };

    const validationResult = materialSchema.safeParse(values);

    if (!validationResult.success) {
      return data<CourseActionData>(
        {
          addErrorMessage: formatValidationError(validationResult.error),
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

    return redirect(`/courses/${deletedCourseId}`);
  }

  return data<CourseActionData>(
    {
      addErrorMessage: "Unknown action.",
    },
    { status: 400 },
  );
}

export default function CourseRoute() {
  const { course } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submittingIntent = navigation.formData?.get("intent");
  const isAddingMaterial = navigation.state === "submitting" && submittingIntent === "add-material";
  const deletingMaterialId =
    navigation.state === "submitting" && submittingIntent === "delete-material"
      ? parseId(String(navigation.formData?.get("materialId") ?? ""))
      : null;

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

        <Form className="form-card" method="post">
          <input name="intent" type="hidden" value="add-material" />

          <div className="form-heading">
            <h2>Add material</h2>
            <p>Use links only. File uploads are intentionally out of scope for this project.</p>
          </div>

          <label className="field-group">
            <span>Title</span>
            <input
              defaultValue={actionData?.addValues?.title ?? ""}
              name="title"
              placeholder="Week 1 notes"
              required
            />
          </label>

          <label className="field-group">
            <span>Type</span>
            <select defaultValue={actionData?.addValues?.type ?? MATERIAL_TYPE_OPTIONS[0]} name="type" required>
              {MATERIAL_TYPE_OPTIONS.map((materialType) => (
                <option key={materialType} value={materialType}>
                  {materialType}
                </option>
              ))}
            </select>
          </label>

          <label className="field-group">
            <span>Description</span>
            <textarea
              defaultValue={actionData?.addValues?.description ?? ""}
              name="description"
              placeholder="Foundational reading for the first week."
              required
              rows={3}
            />
          </label>

          <label className="field-group">
            <span>Link</span>
            <input
              defaultValue={actionData?.addValues?.link ?? ""}
              name="link"
              placeholder="https://example.com/week-1"
              required
              type="url"
            />
          </label>

          <button className="primary-button" disabled={isAddingMaterial} type="submit">
            {isAddingMaterial ? "Saving..." : "Add material"}
          </button>

          {actionData?.addErrorMessage ? (
            <p className="error-message" role="alert">
              {actionData.addErrorMessage}
            </p>
          ) : null}
        </Form>
      </section>

      <section className="content-section">
        <div className="section-header">
          <div>
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
              <article className="material-card" key={material.id}>
                <div className="material-card-header">
                  <div>
                    <p className="course-term">{material.type}</p>
                    <h3>{material.title}</h3>
                  </div>

                  <div className="delete-action">
                    <Form method="post">
                      <input name="intent" type="hidden" value="delete-material" />
                      <input name="materialId" type="hidden" value={material.id} />
                      <button
                        className="secondary-button"
                        disabled={deletingMaterialId === material.id}
                        type="submit"
                      >
                        {deletingMaterialId === material.id ? "Removing..." : "Delete material"}
                      </button>
                    </Form>

                    {actionData?.deleteErrorMaterialId === material.id && actionData.deleteErrorMessage ? (
                      <p className="error-message" role="alert">
                        {actionData.deleteErrorMessage}
                      </p>
                    ) : null}
                  </div>
                </div>

                <p className="material-description">{material.description}</p>
                <a className="primary-link" href={material.link} rel="noreferrer" target="_blank">
                  Open material
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
