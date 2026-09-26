export function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-8 text-sm text-muted sm:flex-row">
        <div>
          <p className="font-medium text-[var(--text)]">Sellora AI</p>
          <p>AI-инструмент для создания контента товаров</p>
        </div>
        <p>Учебный AI-проект</p>
      </div>
    </footer>
  );
}
