export type Tone =
  | "Продающий"
  | "Премиальный"
  | "Дружелюбный"
  | "Экспертный"
  | "Краткий и лаконичный";

export type Length = "Короткая" | "Средняя" | "Подробная";

export interface ProductFormValues {
  productName: string;
  category: string;
  features: string;
  audience: string;
  tone: Tone;
  length: Length;
  additionalInstructions: string;
  avoidUnverifiedClaims: boolean;
  imageBase64?: string;
  imageMimeType?: string;
}

export interface GenerateRequestBody {
  productName: string;
  category: string;
  features: string;
  audience: string;
  tone: string;
  length: string;
  additionalInstructions: string;
  avoidUnverifiedClaims: boolean;
  image?: {
    data: string;
    mimeType: string;
  };
}

export interface GeneratedCard {
  titles: [string, string, string];
  shortDescription: string;
  description: string;
  benefits: string[];
  seoKeywords: string[];
  marketingText: string;
}

export interface GenerateSuccessResponse {
  success: true;
  data: GeneratedCard;
}

export interface GenerateErrorResponse {
  success: false;
  error: string;
}

export type GenerateResponse = GenerateSuccessResponse | GenerateErrorResponse;

export interface HistoryEntry {
  id: string;
  productName: string;
  createdAt: string;
  result: GeneratedCard;
}

export const CATEGORIES = [
  "Электроника",
  "Одежда",
  "Обувь",
  "Красота и уход",
  "Дом",
  "Аксессуары",
  "Спорт",
  "Детские товары",
  "Другое",
] as const;

export const TONES: Tone[] = [
  "Продающий",
  "Премиальный",
  "Дружелюбный",
  "Экспертный",
  "Краткий и лаконичный",
];

export const LENGTHS: Length[] = ["Короткая", "Средняя", "Подробная"];
