"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface MaterialDeleteButtonProps {
  materialId: number;
}

export function MaterialDeleteButton({ materialId }: MaterialDeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  function handleDelete() {
    setErrorMessage("");

    startTransition(async () => {
      const response = await fetch(`/api/materials/${materialId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        setErrorMessage(payload.message ?? "Unable to delete the material right now.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="delete-action">
      <button className="secondary-button" disabled={isPending} onClick={handleDelete} type="button">
        {isPending ? "Removing..." : "Delete material"}
      </button>
      {errorMessage ? <p className="error-message" role="alert">{errorMessage}</p> : null}
    </div>
  );
}
