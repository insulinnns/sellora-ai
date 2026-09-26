import type { GeneratedCard } from "@/types";
import { CopyButton } from "./CopyButton";
import { TitleVariants } from "./TitleVariants";
import { BenefitsList } from "./BenefitsList";
import { SeoKeywords } from "./SeoKeywords";

function buildFullCardText(result: GeneratedCard): string {
  return [
    "Варианты названия:",
    ...result.titles.map((t) => `- ${t}`),
    "",
    "Краткое описание:",
    result.shortDescription,
    "",
    "Продающее описание:",
    result.description,
    "",
    "Почему стоит купить:",
    ...result.benefits.map((b) => `✓ ${b}`),
    "",
    "SEO-ключи:",
    result.seoKeywords.join(", "),
    "",
    "Рекламный текст:",
    result.marketingText,
  ].join("\n");
}

interface ResultCardProps {
  result: GeneratedCard;
  onReset: () => void;
}

export function ResultCard({ result, onReset }: ResultCardProps) {
  return (
    <section className="mx-auto max-w-2xl animate-rise px-5 pb-16">
      <h2 className="mb-5 text-xl font-semibold">Ваша карточка готова</h2>

      <div className="surface space-y-7 rounded-2xl p-5 sm:p-7">
        <a
          href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(result.titles[0])}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full border border-[var(--border)] px-4 py-2 text-sm transition hover:border-violet/60 hover:bg-violet/10"
        >
          Найти фото товара в интернете
        </a>
        <TitleVariants titles={result.titles} />

        <div>
          <h3 className="mb-2 text-sm font-medium text-muted">02 — Краткое описание</h3>
          <p className="text-sm">{result.shortDescription}</p>
          <CopyButton text={result.shortDescription} className="mt-3" />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-muted">03 — Продающее описание</h3>
          <p className="whitespace-pre-line text-sm leading-relaxed">{result.description}</p>
          <CopyButton text={result.description} className="mt-3" />
        </div>

        <BenefitsList benefits={result.benefits} />

        <SeoKeywords keywords={result.seoKeywords} />

        <div>
          <h3 className="mb-2 text-sm font-medium text-muted">06 — Рекламный текст</h3>
          <p className="text-sm leading-relaxed">{result.marketingText}</p>
          <CopyButton text={result.marketingText} className="mt-3" />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <CopyButton
          text={buildFullCardText(result)}
          label="Скопировать всю карточку"
          className="flex-1 justify-center py-2.5"
        />
        <button
          type="button"
          onClick={onReset}
          className="flex-1 rounded-full bg-gradient-to-r from-violet to-azure px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
        >
          Создать новый вариант
        </button>
      </div>
    </section>
  );
}
