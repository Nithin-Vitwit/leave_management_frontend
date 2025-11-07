// Utilities for converting to/from ISO dates the backend expects
export function toISODateLocal(inputDateStr) {
  // input from <input type="date"> is "YYYY-MM-DD" -> convert to ISO start-of-day
  if (!inputDateStr) return null;
  return new Date(inputDateStr + "T00:00:00.000Z").toISOString();
}

export function formatShort(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString();
}
