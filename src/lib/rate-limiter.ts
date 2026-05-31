/**
 * Simple in-memory rate limiter for login attempts
 * Prevents brute force attacks
 */

interface RateLimitEntry {
  attempts: number;
  resetTime: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;

    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  /**
   * Check if request should be rate limited
   * Returns true if allowed, false if rate limited
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    if (!entry || now > entry.resetTime) {
      // First attempt or window expired
      this.attempts.set(identifier, {
        attempts: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    // Check if within limit
    if (entry.attempts < this.maxAttempts) {
      entry.attempts++;
      return true;
    }

    return false;
  }

  /**
   * Get remaining attempts for an identifier
   */
  getRemainingAttempts(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - entry.attempts);
  }

  /**
   * Get reset time for an identifier (milliseconds from now)
   */
  getResetTime(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return 0;
    }
    return entry.resetTime - Date.now();
  }

  /**
   * Reset attempts for an identifier (use after successful login)
   */
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.attempts.entries()) {
      if (now > entry.resetTime) {
        this.attempts.delete(key);
      }
    }
  }
}

// Export singleton instance
export const licenseLoginLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const adminLoginLimiter = new RateLimiter(5, 15 * 60 * 1000);   // 5 attempts per 15 minutes
export const loginAttemptsByUsername = new RateLimiter(10, 60 * 60 * 1000); // 10 attempts per hour
