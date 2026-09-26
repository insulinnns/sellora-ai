/**
 * Единственное место в проекте, где задаётся имя модели Gemini.
 * Чтобы поменять модель — измените значение GEMINI_MODEL.
 */
export const GEMINI_MODEL = "gemini-3.8-flash";

export const GEMINI_FALLBACK_MODELS = ["gemini-3.7-flash", "gemini-3.6-flash"] as const;

/**
 * Таймаут запроса к Gemini API, в миллисекундах.
 */
export const GEMINI_TIMEOUT_MS = 30_000;

/**
 * Максимальная длина полей ввода (защита от чрезмерно больших запросов).
 */
export const LIMITS = {
  productName: { min: 2, max: 150 },
  features: { min: 10, max: 2000 },
  audience: { min: 3, max: 500 },
  additionalInstructions: { max: 1000 },
  imageMaxBytes: 4 * 1024 * 1024, // 4 МБ
} as const;
