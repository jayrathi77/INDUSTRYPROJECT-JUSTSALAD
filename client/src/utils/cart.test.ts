import { describe, expect, it } from 'vitest';
import { calculateSubtotal } from './cart';
import type { Product } from '../types';
const catalog = [{ id: 'salad', price: 180 }, { id: 'tea', price: 50 }, { id: 'pending', price: null }].map((item) => ({ category: 'test', name: item.id, description: '', ...item })) as Product[];
describe('cart subtotal', () => {
  it('uses menu prices and quantities, while unpriced items add no guessed amount', () => {
    expect(calculateSubtotal([{ key: 's', productId: 'salad', quantity: 2 }, { key: 't', productId: 'tea', quantity: 1 }, { key: 'p', productId: 'pending', quantity: 1 }], catalog)).toBe(410);
  });
});
