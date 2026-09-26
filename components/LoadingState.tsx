export function LoadingState() {
  return (
    <div className="surface flex items-center gap-3 rounded-2xl p-5" role="status" aria-live="polite">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-violet border-t-transparent" aria-hidden="true" />
      <p className="text-sm text-muted">Создаём карточку...</p>
    </div>
  );
}
