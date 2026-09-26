"use client";

import { useEffect, useState } from "react";
import type { GeneratedCard, HistoryEntry } from "@/types";

const STORAGE_KEY = "sellora-history";
const MAX_ENTRIES = 5;

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEntries(JSON.parse(stored) as HistoryEntry[]);
      }
    } catch {
      // localStorage недоступен или данные повреждены — начинаем с пустой истории
    }
  }, []);

  const persist = (next: HistoryEntry[]) => {
    setEntries(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // приложение продолжает работать даже без сохранения истории
    }
  };

  const addEntry = (productName: string, result: GeneratedCard) => {
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productName,
      createdAt: new Date().toISOString(),
      result,
    };
    persist([entry, ...entries].slice(0, MAX_ENTRIES));
  };

  const clearHistory = () => persist([]);

  return { entries, addEntry, clearHistory };
}
