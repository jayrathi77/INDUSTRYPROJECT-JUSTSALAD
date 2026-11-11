export function announceCartAdd(productName: string) {
  window.dispatchEvent(new CustomEvent('just-salad:cart-added', { detail: { productName } }));
}
