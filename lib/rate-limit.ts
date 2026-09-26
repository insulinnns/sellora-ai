/**
 * Простой rate limiter в памяти процесса.
 * Подходит для учебного проекта: ограничивает число запросов
 * с одного IP за короткий промежуток времени.
 * На serverless-платформах (Vercel) состояние не гарантированно
 * переживает между инвокациями — это осознанное упрощение.
 */

const WINDOW_MS = 60_000; // 1 минута
const MAX_REQUESTS = 10;

const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(identifier: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const bucket = buckets.get(identifier);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true };
}
