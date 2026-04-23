/**
 * Validates if a URL is safe to be used in an <a> tag.
 * Only allows http, https, and # (for internal links/placeholders).
 *
 * @param {string | null | undefined} url The URL to validate.
 * @returns {boolean} True if the URL is safe, false otherwise.
 */
export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url) {
    return false;
  }
  const safeProtocolRegex = /^(https?:\/\/|#)/i;
  return safeProtocolRegex.test(url);
}
