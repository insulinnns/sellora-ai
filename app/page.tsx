"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductForm } from "@/components/ProductForm";
import { ResultCard } from "@/components/ResultCard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { History } from "@/components/History";
import { Footer } from "@/components/Footer";
import { useHistory } from "@/lib/use-history";
import type { GenerateResponse, GeneratedCard, ProductFormValues, HistoryEntry } from "@/types";

export default function HomePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { entries, addEntry, clearHistory } = useHistory();

  const handleSubmit = async (values: ProductFormValues) => {
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: values.productName,
          category: values.category,
          features: values.features,
          audience: values.audience,
          tone: values.tone,
          length: values.length,
          additionalInstructions: values.additionalInstructions,
          previousTitles: entries.slice(0, 5).map((entry) => entry.result.titles[0]),
          avoidUnverifiedClaims: values.avoidUnverifiedClaims,
          image:
            values.imageBase64 && values.imageMimeType
              ? { data: values.imageBase64, mimeType: values.imageMimeType }
              : undefined,
        }),
      });

      const payload = (await response.json()) as GenerateResponse;

      if (!payload.success) {
        setError(payload.error);
        return;
      }

      setResult(payload.data);
      addEntry(values.productName, payload.data);
    } catch {
      setError("Не удалось создать карточку. Проверьте подключение и попробуйте ещё раз.");
    } finally {
      setIsGenerating(false);
    }
  };

  const openHistoryEntry = (entry: HistoryEntry) => {
    setResult(entry.result);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <Header />
      <Hero />
      <ProductForm onSubmit={handleSubmit} isGenerating={isGenerating} />

      <div className="mx-auto max-w-2xl px-5">
        {isGenerating && (
          <div className="pb-10">
            <LoadingState />
          </div>
        )}
        {error && !isGenerating && (
          <div className="pb-10">
            <ErrorMessage message={error} />
          </div>
        )}
      </div>

      {result && !isGenerating && (
        <ResultCard result={result} onReset={() => setResult(null)} />
      )}

      <History entries={entries} onOpen={openHistoryEntry} onClear={clearHistory} />
      <Footer />
    </main>
  );
}
