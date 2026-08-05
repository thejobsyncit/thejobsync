export function formatLocation(locStr: string | null | undefined): string {
  if (!locStr) return 'Not Specified';
  try {
    const parsed = JSON.parse(locStr);
    if (typeof parsed === 'object' && parsed !== null) {
      const parts = [parsed.city, parsed.state, parsed.country].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : locStr;
    }
  } catch (e) {
    // Not a JSON string, return as is
  }
  return locStr;
}
