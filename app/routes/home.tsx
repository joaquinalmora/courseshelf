import { Form, Link, data, redirect, useActionData, useLoaderData, useNavigation } from "react-router";
import type { MetaFunction } from "react-router";

import { DEPARTMENT_OPTIONS } from "@/lib/constants";
import { createCourse, deleteCourse, listCourses } from "@/lib/course-service";
import { parseId } from "@/lib/route-helpers";
import { courseSchema } from "@/lib/validation";

interface HomeFormValues {
  courseName: string;
  department: string;
  term: string;
}

interface HomeActionData {
  fieldErrors?: Partial<Record<keyof HomeFormValues, string[]>>;
  deleteErrorCourseId?: number;
  deleteErrorMessage?: string;
  values?: HomeFormValues;
}

export const meta: MetaFunction = () => [
  { title: "CourseShelf" },
  { name: "description", content: "Manage courses and learning materials in one place." },
];

export async function loader() {
  return data({
    courses: await listCourses(),
  });
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "create-course");

  if (intent === "delete-course") {
    const courseId = parseId(String(formData.get("courseId") ?? ""));

    if (!courseId) {
      return data<HomeActionData>(
        {
          deleteErrorMessage: "Course not found.",
        },
        { status: 404 },
      );
    }

    const deleted = await deleteCourse(courseId);

    if (!deleted) {
      return data<HomeActionData>(
        {
          deleteErrorCourseId: courseId,
          deleteErrorMessage: "Course not found.",
        },
        { status: 404 },
      );
    }

    return redirect("/");
  }

  const values: HomeFormValues = {
    courseName: String(formData.get("courseName") ?? ""),
    department: String(formData.get("department") ?? ""),
    term: String(formData.get("term") ?? ""),
  };

  // Validate course input before writing to the database.
  const validationResult = courseSchema.safeParse(values);

  if (!validationResult.success) {
    return data<HomeActionData>(
      {
        fieldErrors: validationResult.error.flatten().fieldErrors,
        values,
      },
      { status: 400 },
    );
  }

  await createCourse(validationResult.data);
  return redirect("/");
}

export default function HomeRoute() {
  const { courses } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const fieldErrors = actionData?.fieldErrors ?? {};
  const submittingIntent = navigation.formData?.get("intent");

  // Use navigation state to drive the submit button loading label.
  const isCreatingCourse = navigation.state === "submitting" && submittingIntent === "create-course";
  const deletingCourseId =
    navigation.state === "submitting" && submittingIntent === "delete-course"
      ? parseId(String(navigation.formData?.get("courseId") ?? ""))
      : null;

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">CourseShelf dashboard</p>
          <h1>Manage courses and keep learning materials organized.</h1>
          <p className="hero-copy">
            Create a course, open it, and keep lecture notes, assignments, syllabi, and other links
            in one place.
          </p>
        </div>

        <Form className="form-card" method="post" noValidate>
          <input name="intent" type="hidden" value="create-course" />

          <div className="form-heading">
            <h2>Create a course</h2>
            <p>Terms must follow the YYYYW1, YYYYW2, YYYYS1, or YYYYS2 format.</p>
          </div>

          <label className="field-group">
            <span>Course name</span>
            <input
              aria-describedby={fieldErrors.courseName ? "course-name-errors" : undefined}
              aria-invalid={fieldErrors.courseName ? true : undefined}
              defaultValue={actionData?.values?.courseName ?? ""}
              name="courseName"
              placeholder="Introduction to AI"
            />
          </label>
          {fieldErrors.courseName ? (
            <div className="field-errors" id="course-name-errors">
              {fieldErrors.courseName.map((message) => (
                <p className="error-message" key={message}>
                  {message}
                </p>
              ))}
            </div>
          ) : null}

          <label className="field-group">
            <span>Department</span>
            <select
              aria-describedby={fieldErrors.department ? "department-errors" : undefined}
              aria-invalid={fieldErrors.department ? true : undefined}
              defaultValue={actionData?.values?.department ?? ""}
              name="department"
            >
              <option value="">Select a department</option>
              {DEPARTMENT_OPTIONS.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>
          {fieldErrors.department ? (
            <div className="field-errors" id="department-errors">
              {fieldErrors.department.map((message) => (
                <p className="error-message" key={message}>
                  {message}
                </p>
              ))}
            </div>
          ) : null}

          <label className="field-group">
            <span>Term</span>
            <input
              aria-describedby={fieldErrors.term ? "term-errors" : undefined}
              aria-invalid={fieldErrors.term ? true : undefined}
              defaultValue={actionData?.values?.term ?? ""}
              name="term"
              placeholder="2026W1"
            />
          </label>
          {fieldErrors.term ? (
            <div className="field-errors" id="term-errors">
              {fieldErrors.term.map((message) => (
                <p className="error-message" key={message}>
                  {message}
                </p>
              ))}
            </div>
          ) : null}

          <button className="primary-button" disabled={isCreatingCourse} type="submit">
            {isCreatingCourse ? "Saving..." : "Create course"}
          </button>
        </Form>
      </section>

      <section className="content-section">
        <div className="section-header">
          <div className="section-heading">
            <p className="eyebrow">All courses</p>
            <h2>
              {courses.length} course{courses.length === 1 ? "" : "s"}
            </h2>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state">
            <h3>No courses yet</h3>
            <p>Create your first course to start organizing materials.</p>
          </div>
        ) : (
          <div className="course-grid">
            {courses.map((course) => (
              <article className="course-card" key={course.id}>
                <div className="course-card-title">
                  <p className="course-term">{course.term}</p>
                  <h3>{course.courseName}</h3>
                </div>

                <span className="pill course-card-pill">{course.department}</span>

                <p className="muted-copy">
                  {course.materialCount} material{course.materialCount === 1 ? "" : "s"}
                </p>

                <div className="course-card-actions">
                  <Link className="primary-link" to={`/courses/${course.id}`}>
                    Open course
                  </Link>

                  <Form method="post">
                    <input name="intent" type="hidden" value="delete-course" />
                    <input name="courseId" type="hidden" value={course.id} />
                    <button className="secondary-button" disabled={deletingCourseId === course.id} type="submit">
                      {deletingCourseId === course.id ? "Removing..." : "Delete course"}
                    </button>
                  </Form>
                </div>

                {actionData?.deleteErrorCourseId === course.id && actionData.deleteErrorMessage ? (
                  <p className="error-message" role="alert">
                    {actionData.deleteErrorMessage}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
