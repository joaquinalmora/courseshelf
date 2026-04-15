"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { MATERIAL_TYPE_OPTIONS } from "@/lib/constants";

interface MaterialFormProps {
  courseId: number;
}

interface MaterialFormState {
  title: string;
  type: string;
  description: string;
  link: string;
}

const INITIAL_STATE: MaterialFormState = {
  title: "",
  type: MATERIAL_TYPE_OPTIONS[0],
  description: "",
  link: "",
};

export function MaterialForm({ courseId }: MaterialFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<MaterialFormState>(INITIAL_STATE);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function updateField(field: keyof MaterialFormState, value: string) {
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
      const response = await fetch(`/api/courses/${courseId}/materials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setErrorMessage(payload.message ?? "Unable to add the material right now.");
        return;
      }

      setFormState(INITIAL_STATE);
      setMessage("Material added.");
      router.refresh();
    });
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-heading">
        <h2>Add material</h2>
        <p>Use links only. File uploads are intentionally out of scope for this project.</p>
      </div>

      <label className="field-group">
        <span>Title</span>
        <input
          name="title"
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="Week 1 notes"
          required
          value={formState.title}
        />
      </label>

      <label className="field-group">
        <span>Type</span>
        <select
          name="type"
          onChange={(event) => updateField("type", event.target.value)}
          required
          value={formState.type}
        >
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
          name="description"
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Foundational reading for the first week."
          required
          rows={3}
          value={formState.description}
        />
      </label>

      <label className="field-group">
        <span>Link</span>
        <input
          name="link"
          onChange={(event) => updateField("link", event.target.value)}
          placeholder="https://example.com/week-1"
          required
          type="url"
          value={formState.link}
        />
      </label>

      <button className="primary-button" disabled={isPending} type="submit">
        {isPending ? "Saving..." : "Add material"}
      </button>

      {message ? <p role="status">{message}</p> : null}
      {errorMessage ? <p className="error-message" role="alert">{errorMessage}</p> : null}
    </form>
  );
}
