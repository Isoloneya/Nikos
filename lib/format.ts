export function formatPrice(cents: number): string {
  return `${Math.round(cents / 100)} ₴`;
}
