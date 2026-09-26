import { z } from "zod";
import { LIMITS } from "./gemini-config";

export const generateRequestSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(LIMITS.productName.min, "Название товара слишком короткое.")
    .max(LIMITS.productName.max, "Название товара слишком длинное."),
  category: z.string().trim().min(1, "Выберите категорию товара."),
  features: z
    .string()
    .trim()
    .min(LIMITS.features.min, "Опишите характеристики товара подробнее.")
    .max(LIMITS.features.max, "Характеристики слишком длинные."),
  audience: z
    .string()
    .trim()
    .min(LIMITS.audience.min, "Укажите целевую аудиторию.")
    .max(LIMITS.audience.max, "Описание аудитории слишком длинное."),
  tone: z.string().trim().min(1, "Выберите тон текста."),
  length: z.string().trim().min(1, "Выберите длину текста."),
  additionalInstructions: z
    .string()
    .trim()
    .max(LIMITS.additionalInstructions.max, "Пожелания слишком длинные.")
    .optional()
    .default(""),
  avoidUnverifiedClaims: z.boolean().default(true),
  image: z
    .object({
      data: z.string(),
      mimeType: z.string(),
    })
    .optional(),
});

export type GenerateRequestInput = z.infer<typeof generateRequestSchema>;

/**
 * Схема ожидаемого JSON-ответа от Gemini.
 * Используется, чтобы не доверять модели вслепую.
 */
export const geminiResultSchema = z.object({
  titles: z.array(z.string().trim().min(1)).min(3),
  shortDescription: z.string().trim().min(1),
  description: z.string().trim().min(1),
  benefits: z.array(z.string().trim().min(1)).min(1),
  seoKeywords: z.array(z.string().trim().min(1)).min(1),
  marketingText: z.string().trim().min(1),
});
