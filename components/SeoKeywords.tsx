import { CopyButton } from "./CopyButton";

export function SeoKeywords({ keywords }: { keywords: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-muted">05 — SEO-ключи</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className="rounded-full border border-[var(--border)] bg-violet/10 px-3 py-1 text-xs"
          >
            {keyword}
          </span>
        ))}
      </div>
      <CopyButton
        text={keywords.join(", ")}
        label="Скопировать ключевые слова"
        className="mt-3"
      />
    </div>
  );
}
