interface FieldErrorsProps {
  id: string;
  messages?: string[];
}

export function FieldErrors({ id, messages }: FieldErrorsProps) {
  if (!messages || messages.length === 0) {
    return null;
  }

  return (
    <div className="field-errors" id={id}>
      {messages.map((message) => (
        <p className="error-message" key={message}>
          {message}
        </p>
      ))}
    </div>
  );
}
