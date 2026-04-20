import { useEffect, useId, useRef, useState } from "react";

interface DeleteConfirmationButtonProps {
  buttonLabel: string;
  confirmActionLabel: string;
  confirmDescription: string;
  confirmTitle: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  pendingLabel: string;
  preferenceKey: string;
}

export function DeleteConfirmationButton({
  buttonLabel,
  confirmActionLabel,
  confirmDescription,
  confirmTitle,
  disabled = false,
  isSubmitting = false,
  pendingLabel,
  preferenceKey,
}: DeleteConfirmationButtonProps) {
  const checkboxId = useId();
  const pendingFormRef = useRef<HTMLFormElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [skipConfirmation, setSkipConfirmation] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setSkipConfirmation(window.localStorage.getItem(preferenceKey) === "true");
  }, [preferenceKey]);

  useEffect(() => {
    if (!isOpen) {
      setDontShowAgain(false);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        pendingFormRef.current = null;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.form;

    if (typeof window !== "undefined" && window.localStorage.getItem(preferenceKey) === "true") {
      setSkipConfirmation(true);
      return;
    }

    if (!form || skipConfirmation) {
      return;
    }

    event.preventDefault();
    pendingFormRef.current = form;
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    pendingFormRef.current = null;
  };

  const handleConfirm = () => {
    const form = pendingFormRef.current;

    if (dontShowAgain && typeof window !== "undefined") {
      window.localStorage.setItem(preferenceKey, "true");
      setSkipConfirmation(true);
    }

    setIsOpen(false);
    pendingFormRef.current = null;
    form?.requestSubmit();
  };

  return (
    <>
      <button className="secondary-button" disabled={disabled || isSubmitting} onClick={handleDeleteClick} type="submit">
        {isSubmitting ? pendingLabel : buttonLabel}
      </button>

      {isOpen ? (
        <div aria-modal="true" className="dialog-backdrop" role="dialog" aria-labelledby={`${checkboxId}-title`}>
          <div className="dialog-card">
            <div className="dialog-copy">
              <h2 className="dialog-title" id={`${checkboxId}-title`}>
                {confirmTitle}
              </h2>
              <p>{confirmDescription}</p>
            </div>

            <label className="dialog-checkbox" htmlFor={checkboxId}>
              <input
                checked={dontShowAgain}
                id={checkboxId}
                onChange={(event) => setDontShowAgain(event.currentTarget.checked)}
                type="checkbox"
              />
              <span>Don&apos;t show this again on this device</span>
            </label>

            <div className="dialog-actions">
              <button className="secondary-button" onClick={handleCancel} type="button">
                Cancel
              </button>
              <button className="primary-button danger-button" onClick={handleConfirm} type="button">
                {confirmActionLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
