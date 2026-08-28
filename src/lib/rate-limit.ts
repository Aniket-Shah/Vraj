/**
 * Sliding-window rate limiter.
 *
 * In-memory, so the window is per server instance. That is enough to stop a naive
 * flood against a single Vercel function; a distributed limiter (Upstash, Vercel KV)
 * is the upgrade path once traffic justifies it.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function rateLimit(key: string, max = MAX_REQUESTS, windowMs = WINDOW_MS) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);

  if (recent.length >= max) {
    const retryAfter = Math.ceil((windowMs - (now - recent[0])) / 1000);
    return { allowed: false as const, retryAfter };
  }

  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5_000) {
    for (const [existingKey, times] of hits) {
      if (times.every((time) => now - time >= windowMs)) hits.delete(existingKey);
    }
  }

  return { allowed: true as const, retryAfter: 0 };
}

export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}
