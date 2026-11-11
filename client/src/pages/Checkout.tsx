import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { api } from '../services/api';
import { useCart } from '../store/cart';
import { useMenuProducts } from '../hooks/useMenuProducts';
import { calculateSubtotal } from '../utils/cart';

type FormValues = { fulfilmentMethod: 'pickup' | 'delivery'; line1: string; city: string; postalCode: string };
const schema = z.object({ fulfilmentMethod: z.enum(['pickup', 'delivery']), line1: z.string().optional(), city: z.string().optional(), postalCode: z.string().optional() }).superRefine((value, ctx) => { if (value.fulfilmentMethod === 'delivery') for (const key of ['line1', 'city', 'postalCode'] as const) if (!value[key]?.trim()) ctx.addIssue({ code: 'custom', path: [key], message: 'Required for delivery' }); });
export function Checkout() {
  const lines = useCart((s) => s.lines); const clear = useCart((s) => s.clear); const navigate = useNavigate(); const [error, setError] = useState('');
  const account = useQuery({ queryKey: ['account'], queryFn: () => api('/auth/me'), retry: false });
  const menu = useMenuProducts();
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<FormValues>({ defaultValues: { fulfilmentMethod: 'pickup' } });
  const fulfilment = watch('fulfilmentMethod'); const items = lines.map((line) => ({ line, product: menu.products.find((p) => p.id === line.productId) })).filter((item) => item.product);
  const subtotal = calculateSubtotal(lines, menu.products); const hasUnpriced = lines.some((line) => { const product = menu.products.find((p) => p.id === line.productId); return !product || product.price === null || product.availability === false; });
  const submit = handleSubmit(async (values) => { setError(''); const valid = schema.safeParse(values); if (!valid.success) { setError(valid.error.issues[0].message); return; }
    try { const result = await api<{ order: { _id: string }; payment: { enabled: boolean; reason: string } }>('/orders', { method: 'POST', body: JSON.stringify({ fulfilmentMethod: values.fulfilmentMethod, address: values.fulfilmentMethod === 'delivery' ? { line1: values.line1, city: values.city, postalCode: values.postalCode } : undefined, items: items.map(({ line }) => ({ productId: line.productId, quantity: line.quantity, options: line.options })) }) }); clear(); navigate(`/order-confirmation/${result.order._id}`); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to place this order.'); }
  });
  if (!lines.length) return <main className="empty-results"><h1>Your bag is empty.</h1><Link className="button button-dark" to="/menu">Explore the menu</Link></main>;
  if (account.isLoading) return <main className="checkout-page"><p>Checking your account…</p></main>;
  if (account.isError) return <main className="checkout-page"><span className="eyebrow">ONE QUICK STEP</span><h1>Sign in to continue.</h1><p>Your order is saved in this browser. Sign in or create an account to submit it.</p><Link className="button button-dark" to="/account">Go to account</Link></main>;
  return <main className="checkout-page"><span className="eyebrow">ALMOST SOMETHING FRESH</span><h1>Finish your order.</h1><p className="checkout-account">Your order will be placed using your Just Salad account. <Link to="/account">Account settings</Link></p><div className="checkout-layout"><form className="checkout-form" onSubmit={submit}><h2>How would you like it?</h2><label className="choice-row"><input type="radio" value="pickup" {...register('fulfilmentMethod')}/> Pickup</label><label className="choice-row"><input type="radio" value="delivery" {...register('fulfilmentMethod')}/> Delivery</label>{fulfilment === 'delivery' && <><label>Street address<input {...register('line1')}/></label><div className="address-row"><label>City<input {...register('city')}/></label><label>Postal code<input {...register('postalCode')}/></label></div></>}<div className="payment-note"><strong>Payment</strong><p>Online payment is not configured yet. This request will be recorded as unpaid; the restaurant must confirm payment before treating it as paid.</p></div>{error && <p className="account-notice" role="alert">{error}</p>}<button disabled={isSubmitting || hasUnpriced} className="button button-dark">{hasUnpriced ? 'Resolve unpriced items first' : isSubmitting ? 'Placing request…' : 'Place unpaid order request'}</button><p className="checkout-disclaimer">No delivery fee or tax has been provided. They are not included in the subtotal.</p></form><aside className="checkout-summary"><h2>Order summary</h2>{items.map(({ line, product }) => <div key={line.productId}><span>{line.quantity} × {product!.name}</span><strong>{product!.price === null ? 'Price pending' : `₹${product!.price * line.quantity}`}</strong></div>)}<div className="checkout-total"><span>Subtotal</span><strong>₹{subtotal}</strong></div></aside></div></main>;
}
