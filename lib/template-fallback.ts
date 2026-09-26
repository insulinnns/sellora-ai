import type { GeneratedCard } from "@/types";
import type { GenerateRequestInput } from "./schema";

function shuffled<T>(items: T[]): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

export function buildTemplateFallbackCard(input: GenerateRequestInput): GeneratedCard {
  const productName = input.productName.trim();
  const category = input.category.trim();
  const features = input.features.trim().replace(/\s+/g, " ");
  const audience = input.audience.trim();
  const featureList = features
    .split(/[,;\n]+/)
    .map((feature) => feature.replace(/[.]+$/g, "").trim())
    .filter(Boolean);
  const titleCandidates = [...new Set([
    `${productName} — ${category}`,
    `${category}: ${productName}`,
    `${productName} для ${audience}`,
    `${productName}: ${featureList[0] ?? category}`,
    `Товар категории «${category}» — ${productName}`,
    `${productName} с ${featureList[0] ?? category}`,
    `${productName} и его характеристики: ${featureList.slice(0, 2).join(", ")}`,
    `${category} «${productName}»: ${featureList[0] ?? "основные характеристики"}`,
  ])];
  const shuffledTitles = shuffled(titleCandidates);
  const previousTitles = new Set(input.previousTitles.map((title) => title.toLocaleLowerCase()));
  const freshTitles = shuffledTitles.filter((title) => !previousTitles.has(title.toLocaleLowerCase()));
  const titles = [...freshTitles, ...shuffledTitles.filter((title) => previousTitles.has(title.toLocaleLowerCase()))]
    .slice(0, 3) as [string, string, string];

  return {
    generationMode: "template",
    titles,
    shortDescription: `${productName} — товар категории «${category}». ${features}`,
    description: `${productName} относится к категории «${category}». В характеристиках указано: ${features}.\n\nКарточка предназначена для аудитории: ${audience}. Текст составлен только на основе введённых данных.`,
    benefits: featureList.slice(0, 6),
    seoKeywords: [...new Set([productName, category, ...featureList.slice(0, 5)])].slice(0, 7),
    marketingText: `${productName} — ${features}. Целевая аудитория: ${audience}.`,
  };
}