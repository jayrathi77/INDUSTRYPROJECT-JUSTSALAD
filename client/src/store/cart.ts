import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartLine } from '../types';
type CartStore = { lines: CartLine[]; add: (id: string, options?: Record<string, string>) => void; setQuantity: (key: string, quantity: number) => void; remove: (key: string) => void; clear: () => void };
export const useCart = create<CartStore>()(persist((set) => ({
  lines: [],
  add: (id, options = {}) => set((s) => { const key = `${id}:${JSON.stringify(options)}`; return { lines: s.lines.some((line) => line.key === key) ? s.lines.map((line) => line.key === key ? { ...line, quantity: line.quantity + 1 } : line) : [...s.lines, { key, productId: id, quantity: 1, options }] }; }),
  setQuantity: (key, quantity) => set((s) => ({ lines: quantity <= 0 ? s.lines.filter((line) => line.key !== key) : s.lines.map((line) => line.key === key ? { ...line, quantity } : line) })),
  remove: (key) => set((s) => ({ lines: s.lines.filter((line) => line.key !== key) })), clear: () => set({ lines: [] })
}), { name: 'just-salad-cart' }));
