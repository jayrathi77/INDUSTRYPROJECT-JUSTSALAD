import { describe, expect, it } from 'vitest';
import type { CartLine, Product } from '../types';
import { formatWhatsAppOrderMessage, isSambhajinagarAddress, isValidWhatsAppNumber, whatsappOrderUrl } from './whatsappOrder';

const catalog = [
  { id: 'salad', name: 'Quinoa Salad', price: 220, availability: true },
  { id: 'wrap', name: 'Tandoori Paneer Wrap', price: 180, availability: true },
  { id: 'sold-out', name: 'Unavailable Bowl', price: 300, availability: false },
  { id: 'pending', name: 'Unpriced Sandwich', price: null, availability: false }
].map((item) => ({ category: 'Test', description: '', ...item })) as Product[];
const lines: CartLine[] = [
  { key: 'salad:{}', productId: 'salad', quantity: 2, options: {} },
  { key: 'wrap:{}', productId: 'wrap', quantity: 1, options: {} }
];

describe('WhatsApp order message', () => {
  it('includes customer data, all line subtotals, total, instructions, and an encoded chat URL', () => {
    const message = formatWhatsAppOrderMessage({ name: 'Rahul', phone: '+91 98765 43210', address: '12 Green Park, Aurangabad', instructions: 'Please confirm availability.' }, lines, catalog);
    expect(message).toContain('Name: Rahul');
    expect(message).toContain('Contact: +91 98765 43210');
    expect(message).toContain('Address: 12 Green Park, Aurangabad');
    expect(message).toContain('Quinoa Salad × 2\n   Unit Price: ₹220\n   Subtotal: ₹440');
    expect(message).toContain('Tandoori Paneer Wrap × 1\n   Unit Price: ₹180\n   Subtotal: ₹180');
    expect(message).toContain('ESTIMATED TOTAL: ₹620');
    expect(message).toContain('Special Instructions: Please confirm availability.');
    const url = whatsappOrderUrl('919876543210', message);
    expect(url).toMatch(/^https:\/\/wa\.me\/919876543210\?text=/);
    expect(decodeURIComponent(new URL(url).searchParams.get('text')!)).toBe(message);
  });

  it('rejects empty, unavailable, unpriced, unknown, or invalid-quantity cart lines', () => {
    const customer = { name: 'A', phone: '1234567', address: 'Some address, Chhatrapati Sambhajinagar' };
    expect(() => formatWhatsAppOrderMessage(customer, [], catalog)).toThrow(/Add an available item/);
    expect(() => formatWhatsAppOrderMessage(customer, [{ ...lines[0], productId: 'sold-out' }], catalog)).toThrow(/unavailable item/);
    expect(() => formatWhatsAppOrderMessage(customer, [{ ...lines[0], productId: 'pending' }], catalog)).toThrow(/unavailable item/);
    expect(() => formatWhatsAppOrderMessage(customer, [{ ...lines[0], productId: 'missing' }], catalog)).toThrow(/unavailable item/);
    expect(() => formatWhatsAppOrderMessage(customer, [{ ...lines[0], quantity: 100 }], catalog)).toThrow(/unavailable item/);
  });

  it('requires the customer name, valid phone number, and address', () => {
    expect(() => formatWhatsAppOrderMessage({ name: '', phone: '1234567', address: 'Address' }, lines, catalog)).toThrow(/Enter your name/);
    expect(() => formatWhatsAppOrderMessage({ name: 'A', phone: '123', address: 'Address' }, lines, catalog)).toThrow(/Enter your name/);
    expect(() => formatWhatsAppOrderMessage({ name: 'A', phone: '1234567', address: ' ' }, lines, catalog)).toThrow(/Enter your name/);
  });
});

describe('WhatsApp number configuration', () => {
  it('accepts only an international number made of digits without punctuation', () => {
    expect(isValidWhatsAppNumber('919876543210')).toBe(true);
    expect(isValidWhatsAppNumber('919607599959')).toBe(true);
    expect(isValidWhatsAppNumber(undefined)).toBe(false);
    expect(isValidWhatsAppNumber('+919876543210')).toBe(false);
    expect(isValidWhatsAppNumber('9198 7654 3210')).toBe(false);
    expect(() => whatsappOrderUrl('+919876543210', 'hello')).toThrow(/not configured/);
  });
});

describe('delivery address city restriction', () => {
  it('accepts Sambhajinagar and its older Aurangabad map label, while rejecting other cities', () => {
    expect(isSambhajinagarAddress('Chhatrapati Sambhajinagar, Maharashtra')).toBe(true);
    expect(isSambhajinagarAddress('Aurangabad, Maharashtra')).toBe(true);
    expect(isSambhajinagarAddress('Pune, Maharashtra')).toBe(false);
    expect(() => formatWhatsAppOrderMessage({ name: 'Rahul', phone: '9876543210', address: 'Pune' }, lines, catalog)).toThrow(/Chhatrapati Sambhajinagar/);
  });
});
