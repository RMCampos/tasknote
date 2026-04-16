import { describe, it, expect } from 'vitest';
import { isSafeUrl } from './UrlUtils';

describe('UrlUtils', () => {
  it('should allow http:// URLs', () => {
    expect(isSafeUrl('http://example.com')).toBe(true);
  });

  it('should allow https:// URLs', () => {
    expect(isSafeUrl('https://example.com')).toBe(true);
  });

  it('should allow # URLs', () => {
    expect(isSafeUrl('#section')).toBe(true);
  });

  it('should disallow javascript: URLs', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
  });

  it('should disallow data: URLs', () => {
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
  });

  it('should disallow empty or null URLs', () => {
    expect(isSafeUrl('')).toBe(false);
    expect(isSafeUrl(null)).toBe(false);
    expect(isSafeUrl(undefined)).toBe(false);
  });

  it('should be case insensitive for protocol', () => {
    expect(isSafeUrl('HTTP://example.com')).toBe(true);
    expect(isSafeUrl('HTTPS://example.com')).toBe(true);
  });
});
