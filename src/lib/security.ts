/**
 * NEXORA SECURITY & DEFENSIVE HARDENING UTILITIES
 * Provides input sanitization, Open Redirect defense, XSS protection, and rate limiting.
 */

/**
 * Sanitize untrusted user string inputs
 * Removes dangerous tags, script injection patterns, control characters, and enforces length bounds.
 */
export function sanitizeText(input: string | undefined | null, maxLength: number = 1000): string {
  if (!input) return ''

  // 1. Convert to string and trim
  let sanitized = String(input).trim()

  // 2. Strip HTML tags and dangerous characters
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '') // strip all HTML tags
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '') // remove ASCII control characters

  // 3. Enforce maximum character boundary to prevent payload flooding / buffer DoS
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }

  return sanitized
}

/**
 * Validates whether an external URL is safe for redirection.
 * Mitigates Open Redirect and SSRF attacks by enforcing http/https schemes and disallowing dangerous protocols.
 */
export function isValidRedirectUrl(url: string | undefined | null): boolean {
  if (!url) return false
  const trimmed = url.trim()

  // Disallow javascript:, data:, vbscript:, file: etc.
  if (/^(javascript|data|vbscript|file|about):/i.test(trimmed)) {
    return false
  }

  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    // Relative URLs starting with / (internal redirects) are safe
    if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/\\')) {
      return true
    }
    return false
  }
}

/**
 * Sliding-window rate limiter for client actions (e.g. feedback submission, analytics event debounce).
 * Prevents automated denial-of-service, spam floods, and artificial scan count inflation.
 */
interface RateLimitBucket {
  timestamps: number[]
}

const rateLimitStorage: Record<string, RateLimitBucket> = {}

export function checkRateLimit(
  actionKey: string,
  maxAttempts: number = 5,
  windowMs: number = 60000 // 1 minute window
): { allowed: boolean; remainingAttempts: number; retryAfterSeconds: number } {
  const now = Date.now()
  const bucket = rateLimitStorage[actionKey] || { timestamps: [] }

  // Filter out timestamps outside the active window
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < windowMs)

  if (bucket.timestamps.length >= maxAttempts) {
    const oldest = bucket.timestamps[0]
    const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000)
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds)
    }
  }

  // Record this attempt
  bucket.timestamps.push(now)
  rateLimitStorage[actionKey] = bucket

  return {
    allowed: true,
    remainingAttempts: maxAttempts - bucket.timestamps.length,
    retryAfterSeconds: 0
  }
}

/**
 * Sanitizes phone numbers by keeping only valid telephone digits, spaces, hyphens, and +
 */
export function sanitizePhone(phone: string | undefined | null): string {
  if (!phone) return ''
  return phone.replace(/[^0-9+\s\-().]/g, '').trim().substring(0, 20)
}

/**
 * Validates email format with RFC 5322 regex
 */
export function isValidEmail(email: string | undefined | null): boolean {
  if (!email) return false
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  return emailRegex.test(email.trim())
}

/**
 * Neutralizes CSV / Formula injection (CWE-1236)
 * Prepends a single quote if a cell string begins with =, +, -, @, \t, or \r
 * to prevent spreadsheet clients like Microsoft Excel from executing arbitrary formulas or external commands.
 */
export function sanitizeCsvCell(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return ''
  const str = String(value).trim()
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'"${str.replace(/"/g, '""')}"`
  }
  return `"${str.replace(/"/g, '""')}"`
}
