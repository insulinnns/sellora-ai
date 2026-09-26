import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { generateRequestSchema, geminiResultSchema } from "@/lib/schema";
import { buildSystemInstruction, buildUserPrompt } from "@/lib/prompt";
import {
  GEMINI_FALLBACK_MODELS,
  GEMINI_MODEL,
  GEMINI_RETRY_DELAY_MS,
  GEMINI_TIMEOUT_MS,
  LIMITS,
} from "@/lib/gemini-config";
import { checkRateLimit } from "@/lib/rate-limit";
import type { GenerateResponse } from "@/types";

export const runtime = "nodejs";

function fail(error: string, status: number): NextResponse<GenerateResponse> {
  return NextResponse.json({ success: false, error }, { status });
}

/** Достаёт JSON из ответа модели, даже если он обёрнут в ```json code fence. */
function extractJson(rawText: string): unknown {
  const trimmed = rawText.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenceMatch ? fenceMatch[1] : trimmed;
  return JSON.parse(candidate);
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse>> {
  // --- Rate limiting ---
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return fail("Слишком много запросов. Попробуйте снова через минуту.", 429);
  }

  // --- Ограничение размера тела запроса ---
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  const maxBodyBytes = LIMITS.imageMaxBytes + 50_000; // изображение + текстовые поля
  if (contentLength > maxBodyBytes) {
    return fail("Запрос слишком большой. Уменьшите размер изображения.", 413);
  }

  // --- Парсинг тела ---
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return fail("Некорректный формат запроса.", 400);
  }

  // --- Валидация ---
  const parsed = generateRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Проверьте введённые данные.";
    return fail(firstIssue, 400);
  }
  const input = parsed.data;

  if (input.image && input.image.data.length > LIMITS.imageMaxBytes * 1.4) {
    // base64 примерно на 33% больше исходного размера — даём небольшой запас
    return fail("Изображение слишком большое. Выберите файл поменьше.", 413);
  }

  // --- Проверка ключа ---
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const message =
      process.env.NODE_ENV === "production"
        ? "Сервис временно недоступен. Попробуйте позже."
        : "Gemini API пока не настроен. Добавьте GEMINI_API_KEY в .env.local.";
    return fail(message, 500);
  }

  // --- Запрос к Gemini ---
  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = buildSystemInstruction();
  const userPrompt = buildUserPrompt(input);

  // Части типизированы как `any`, так как точная форма Part зависит от версии
  // SDK @google/genai; структура соответствует официальному формату Gemini API.
  const contentParts: any[] = [{ text: userPrompt }];
  if (input.image) {
    contentParts.push({
      inlineData: {
        data: input.image.data,
        mimeType: input.image.mimeType,
      },
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  let rawText: string;
  try {
    rawText = "";
    for (const model of [GEMINI_MODEL, ...GEMINI_FALLBACK_MODELS]) {
      let retryPrimary = model === GEMINI_MODEL;

      while (true) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: [{ role: "user", parts: contentParts }] as any,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              temperature: 0.9,
            },
          });
          rawText = response.text ?? "";
          break;
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error);
          const isUnavailable = message.includes("503") || message.toLowerCase().includes("unavailable");
          const isRateLimited = message.includes("429") || message.toLowerCase().includes("resource_exhausted");
          if (!isUnavailable && !isRateLimited) throw error;

          if (isUnavailable && retryPrimary) {
            retryPrimary = false;
            await new Promise((resolve) => setTimeout(resolve, GEMINI_RETRY_DELAY_MS));
            continue;
          }

          if (model === GEMINI_FALLBACK_MODELS[GEMINI_FALLBACK_MODELS.length - 1]) {
            throw error;
          }

          const reason = isRateLimited ? "rate limited" : "unavailable";
          console.warn(`Gemini model ${model} ${reason}; trying fallback model.`);
          break;
        }
      }

      if (rawText) break;
    }

    if (!rawText) {
      throw new Error("empty-response");
    }
  } catch (error: unknown) {
    clearTimeout(timeout);

    if (controller.signal.aborted) {
      return fail("Gemini не ответил вовремя. Попробуйте ещё раз.", 504);
    }

    const message = error instanceof Error ? error.message : String(error);
    const safeMessage = apiKey ? message.split(apiKey).join("[redacted]") : message;
    console.error("Gemini generation failed:", safeMessage.slice(0, 500));

    if (message.toLowerCase().includes("rate") || message.includes("429")) {
      return fail("Превышен лимит запросов к Gemini. Подождите немного и попробуйте снова.", 429);
    }
    if (message.includes("503") || message.toLowerCase().includes("unavailable")) {
      return fail("Сервис генерации временно перегружен. Попробуйте ещё раз через минуту.", 503);
    }
    if (message.toLowerCase().includes("network") || message.toLowerCase().includes("fetch failed")) {
      return fail("Не удалось подключиться к Gemini API. Проверьте подключение и попробуйте ещё раз.", 502);
    }
    if (message.toLowerCase().includes("api key") || message.includes("401") || message.includes("403")) {
      return fail("Ошибка авторизации в Gemini API. Проверьте GEMINI_API_KEY.", 500);
    }

    return fail("Не удалось создать карточку. Проверьте подключение и попробуйте ещё раз.", 502);
  } finally {
    clearTimeout(timeout);
  }

  // --- Разбор и валидация JSON ---
  let json: unknown;
  try {
    json = extractJson(rawText);
  } catch {
    return fail("Gemini вернул некорректный ответ. Попробуйте ещё раз.", 502);
  }

  const resultParsed = geminiResultSchema.safeParse(json);
  if (!resultParsed.success) {
    return fail("Gemini вернул ответ в неожиданном формате. Попробуйте ещё раз.", 502);
  }

  const titles = resultParsed.data.titles.slice(0, 3);
  while (titles.length < 3) titles.push(resultParsed.data.titles[0]);
  return NextResponse.json({
    success: true,
    data: {
      titles: [titles[0], titles[1], titles[2]],
      shortDescription: resultParsed.data.shortDescription,
      description: resultParsed.data.description,
      benefits: resultParsed.data.benefits,
      seoKeywords: resultParsed.data.seoKeywords,
      marketingText: resultParsed.data.marketingText,
    },
  });
}
