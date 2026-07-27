/**
 * Basic in-memory rate limiter using a Map.
 * Note: In a production cluster/serverless environment with multiple instances, 
 * use an external store like Redis (e.g. @upstash/ratelimit) instead.
 */

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitInfo>();

export function checkRateLimit(ip: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const info = store.get(ip);

  // Clean up expired entries periodically or on-the-fly
  if (info && now > info.resetTime) {
    store.delete(ip);
  }

  const currentInfo = store.get(ip);

  if (!currentInfo) {
    store.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    return true; // Allowed
  }

  if (currentInfo.count >= limit) {
    return false; // Rate limited
  }

  currentInfo.count += 1;
  store.set(ip, currentInfo);
  return true; // Allowed
}
