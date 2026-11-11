import type { CartLine, Product } from '../types';
export function calculateSubtotal(lines: CartLine[], catalog: Product[]) {
  const prices = new Map(catalog.map((product) => [product.id, product.price]));
  return lines.reduce((sum, line) => sum + (prices.get(line.productId) ?? 0) * line.quantity, 0);
}
