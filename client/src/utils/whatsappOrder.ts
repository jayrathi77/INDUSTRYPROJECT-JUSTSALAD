import type { CartLine, Product } from '../types';

export type OrderCustomer = { name: string; phone: string; address: string; instructions?: string };

export function isValidWhatsAppNumber(number: string | undefined): number is string {
  return Boolean(number && /^[1-9]\d{7,14}$/.test(number));
}

export function isSambhajinagarAddress(address: string) {
  const normalized = address.normalize('NFKD').toLowerCase().replace(/[^a-z]/g, '');
  return normalized.includes('sambhajinagar') || normalized.includes('aurangabad');
}

export function formatWhatsAppOrderMessage(customer: OrderCustomer, lines: CartLine[], catalog: Product[]) {
  if (!customer.name.trim() || !customer.address.trim() || customer.phone.replace(/\D/g, '').length < 7 || customer.phone.replace(/\D/g, '').length > 15) {
    throw new Error('Enter your name, a valid contact number, and address before continuing.');
  }
  if (!isSambhajinagarAddress(customer.address)) throw new Error('Please select or enter an address in Chhatrapati Sambhajinagar.');
  const productById = new Map(catalog.map((product) => [product.id, product]));
  const formatPrice = (amount: number) => `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(amount)}`;
  const items = lines.map((line, index) => {
    const product = productById.get(line.productId);
    if (!product || product.price === null || product.availability === false || !Number.isSafeInteger(line.quantity) || line.quantity < 1 || line.quantity > 99) {
      throw new Error('Your cart has an unavailable item. Please update it before continuing.');
    }
    const subtotal = product.price * line.quantity;
    return `${index + 1}. ${product.name} × ${line.quantity}\n   Unit Price: ${formatPrice(product.price)}\n   Subtotal: ${formatPrice(subtotal)}`;
  });
  if (!lines.length) throw new Error('Add an available item to your cart first.');
  const total = lines.reduce((sum, line) => sum + productById.get(line.productId)!.price! * line.quantity, 0);
  return [
    'Hello Just Salad!',
    '',
    "I'd like to place an order.",
    '',
    'CUSTOMER DETAILS',
    `Name: ${customer.name.trim()}`,
    `Contact: ${customer.phone.trim()}`,
    `Address: ${customer.address.trim()}`,
    '',
    'MY ORDER',
    '',
    ...items,
    '',
    `ESTIMATED TOTAL: ${formatPrice(total)}`,
    ...(customer.instructions?.trim() ? ['', `Special Instructions: ${customer.instructions.trim()}`] : []),
    '',
    'Please confirm my order and the final amount.',
    '',
    'Thank you!'
  ].join('\n');
}

export function whatsappOrderUrl(number: string, message: string) {
  if (!isValidWhatsAppNumber(number)) throw new Error('The restaurant WhatsApp number is not configured.');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
