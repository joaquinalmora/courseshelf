"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { DEPARTMENT_OPTIONS } from "@/lib/constants";

interface CourseFormState {
  courseName: string;
  department: string;
  term: string;
}

const INITIAL_STATE: CourseFormState = {
  courseName: "",
  department: "",
  term: "",
};

export function CourseCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<CourseFormState>(INITIAL_STATE);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function updateField(field: keyof CourseFormState, value: string) {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    startTransition(async () => {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const payload = (await response.json()) as { id?: number; message?: string };

      if (!response.ok) {
        setErrorMessage(payload.message ?? "Unable to create the course right now.");
        return;
      }

      setFormState(INITIAL_STATE);
      setMessage("Course created.");
      router.refresh();
    });
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-heading">
        <h2>Create a course</h2>
        <p>Terms must follow the YYYYW1, YYYYW2, YYYYS1, or YYYYS2 format.</p>
      </div>

      <label className="field-group">
        <span>Course name</span>
        <input
          name="courseName"
          onChange={(event) => updateField("courseName", event.target.value)}
          placeholder="Introduction to AI"
          required
          value={formState.courseName}
        />
      </label>

      <label className="field-group">
        <span>Department</span>
        <select
          name="department"
          onChange={(event) => updateField("department", event.target.value)}
          required
          value={formState.department}
        >
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
          name="term"
          onChange={(event) => updateField("term", event.target.value)}
          pattern="\d{4}[WS][12]"
          placeholder="2026W1"
          required
          value={formState.term}
        />
      </label>

      <button className="primary-button" disabled={isPending} type="submit">
        {isPending ? "Saving..." : "Create course"}
      </button>

      {message ? <p role="status">{message}</p> : null}
      {errorMessage ? <p className="error-message" role="alert">{errorMessage}</p> : null}
    </form>
  );
}
