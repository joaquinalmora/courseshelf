import Link from "next/link";
import { notFound } from "next/navigation";

import { MaterialDeleteButton } from "@/components/material-delete-button";
import { MaterialForm } from "@/components/material-form";
import { getCourseById } from "@/lib/course-service";
import { parseId } from "@/lib/route-helpers";

export const dynamic = "force-dynamic";

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;
  const parsedCourseId = parseId(courseId);

  if (!parsedCourseId) {
    notFound();
  }

  const course = await getCourseById(parsedCourseId);

  if (!course) {
    notFound();
  }

  return (
    <main className="page-shell">
      <div className="back-link-wrap">
        <Link className="secondary-link" href="/">
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
        <MaterialForm courseId={course.id} />
      </section>

      <section className="content-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Materials</p>
            <h2>{course.materials.length} item{course.materials.length === 1 ? "" : "s"}</h2>
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
                  <MaterialDeleteButton materialId={material.id} />
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
