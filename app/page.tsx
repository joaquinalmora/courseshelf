import Link from "next/link";

import { CourseCreateForm } from "@/components/course-create-form";
import { listCourses } from "@/lib/course-service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const courses = await listCourses();

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
        <CourseCreateForm />
      </section>

      <section className="content-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">All courses</p>
            <h2>{courses.length} course{courses.length === 1 ? "" : "s"}</h2>
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
                <Link className="primary-link" href={`/courses/${course.id}`}>
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
