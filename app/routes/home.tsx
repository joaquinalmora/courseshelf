import { Form, Link, data, redirect, useActionData, useLoaderData, useNavigation } from "react-router";
import type { MetaFunction } from "react-router";

import { DEPARTMENT_OPTIONS } from "@/lib/constants";
import { createCourse, listCourses } from "@/lib/course-service";
import { courseSchema, formatValidationError } from "@/lib/validation";

interface HomeActionData {
  errorMessage?: string;
  values?: {
    courseName: string;
    department: string;
    term: string;
  };
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
  const values = {
    courseName: String(formData.get("courseName") ?? ""),
    department: String(formData.get("department") ?? ""),
    term: String(formData.get("term") ?? ""),
  };

  const validationResult = courseSchema.safeParse(values);

  if (!validationResult.success) {
    return data<HomeActionData>(
      {
        errorMessage: formatValidationError(validationResult.error),
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
  const isCreatingCourse = navigation.state === "submitting";

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

        <Form className="form-card" method="post">
          <div className="form-heading">
            <h2>Create a course</h2>
            <p>Terms must follow the YYYYW1, YYYYW2, YYYYS1, or YYYYS2 format.</p>
          </div>

          <label className="field-group">
            <span>Course name</span>
            <input
              defaultValue={actionData?.values?.courseName ?? ""}
              name="courseName"
              placeholder="Introduction to AI"
              required
            />
          </label>

          <label className="field-group">
            <span>Department</span>
            <select defaultValue={actionData?.values?.department ?? ""} name="department" required>
              <option value="">Select a department</option>
              {DEPARTMENT_OPTIONS.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>

          <label className="field-group">
            <span>Term</span>
            <input
              defaultValue={actionData?.values?.term ?? ""}
              name="term"
              pattern="\d{4}[WS][12]"
              placeholder="2026W1"
              required
            />
          </label>

          <button className="primary-button" disabled={isCreatingCourse} type="submit">
            {isCreatingCourse ? "Saving..." : "Create course"}
          </button>

          {actionData?.errorMessage ? (
            <p className="error-message" role="alert">
              {actionData.errorMessage}
            </p>
          ) : null}
        </Form>
      </section>

      <section className="content-section">
        <div className="section-header">
          <div>
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
                <div className="course-card-header">
                  <div>
                    <p className="course-term">{course.term}</p>
                    <h3>{course.courseName}</h3>
                  </div>
                  <span className="pill">{course.department}</span>
                </div>
                <p className="muted-copy">
                  {course.materialCount} material{course.materialCount === 1 ? "" : "s"}
                </p>
                <Link className="primary-link" to={`/courses/${course.id}`}>
                  Open course
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
