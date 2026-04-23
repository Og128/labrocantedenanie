const hits = new Map<string, number[]>()

/**
 * Simple in-memory rate limiter.
 * @param key   Unique identifier (e.g. IP or IP+route)
 * @param limit Max requests allowed in the window
 * @param windowMs Time window in milliseconds (default: 60 seconds)
 * @returns true if the request should be BLOCKED
 */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs = 60_000
): boolean {
  const now = Date.now()
  const timestamps = hits.get(key) ?? []

  // Keep only timestamps within the window
  const recent = timestamps.filter((t) => now - t < windowMs)

  if (recent.length >= limit) {
    hits.set(key, recent)
    return true
  }

  recent.push(now)
  hits.set(key, recent)
  return false
}

// Clean up old entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, timestamps] of hits) {
    const recent = timestamps.filter((t) => now - t < 300_000)
    if (recent.length === 0) {
      hits.delete(key)
    } else {
      hits.set(key, recent)
    }
  }
}, 300_000)
