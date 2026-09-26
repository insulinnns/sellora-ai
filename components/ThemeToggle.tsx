"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
      className="surface flex h-10 w-10 items-center justify-center rounded-full text-lg transition hover:border-violet/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet"
    >
      <span aria-hidden="true">{theme === "dark" ? "🌙" : "☀️"}</span>
    </button>
  );
}
