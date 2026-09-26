export function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
    >
      {message}
    </div>
  );
}
