"use client";

import type { HistoryEntry } from "@/types";

interface HistoryProps {
  entries: HistoryEntry[];
  onOpen: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export function History({ entries, onOpen, onClear }: HistoryProps) {
  if (entries.length === 0) return null;

  return (
    <section className="mx-auto max-w-2xl px-5 pb-16">
      <div className="surface rounded-2xl p-5 sm:p-7">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">История генераций</h2>
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-muted transition hover:text-[var(--text)]"
          >
            Очистить историю
          </button>
        </div>

        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => onOpen(entry)}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-4 py-3 text-left text-sm transition hover:border-violet/60"
              >
                <span className="truncate">{entry.productName}</span>
                <span className="shrink-0 text-xs text-muted">
                  {new Date(entry.createdAt).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
