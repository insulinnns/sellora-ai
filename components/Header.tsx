"use client";

import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">Sellora</span>
            <span className="rounded-full bg-gradient-to-r from-violet to-azure px-2 py-0.5 text-xs font-medium text-white">
              AI
            </span>
          </div>
          <span className="hidden text-xs text-muted sm:block">
            Контент для товаров — за секунды
          </span>
        </div>

        <nav className="flex items-center gap-3 sm:gap-4">
          <a
            href="#how-it-works"
            className="hidden text-sm text-muted transition hover:text-[var(--text)] sm:block"
          >
            Как это работает
          </a>
          <ThemeToggle />
          <a
            href="#product-form"
            className="rounded-full bg-gradient-to-r from-violet to-magenta px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_-6px_var(--glow-violet)] transition hover:brightness-110"
          >
            Создать карточку
          </a>
        </nav>
      </div>
    </header>
  );
}
