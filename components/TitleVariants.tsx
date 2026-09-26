import { CopyButton } from "./CopyButton";

export function TitleVariants({ titles }: { titles: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-muted">01 — Варианты названия</h3>
      <div className="space-y-2">
        {titles.map((title, index) => (
          <div
            key={index}
            className="surface flex items-center justify-between gap-3 rounded-xl px-4 py-3"
          >
            <p className="text-sm">{title}</p>
            <CopyButton text={title} />
          </div>
        ))}
      </div>
    </div>
  );
}
