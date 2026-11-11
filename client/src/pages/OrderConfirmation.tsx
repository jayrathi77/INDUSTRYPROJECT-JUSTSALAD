import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
type Order = { _id: string; status: string; paymentStatus: string; total: number; createdAt: string; fulfilmentMethod: string; items: { name: string; quantity: number; unitPrice: number }[] };
export function OrderConfirmation() {
  const { id } = useParams(); const orders = useQuery({ queryKey: ['orders'], queryFn: () => api<Order[]>('/orders/mine'), retry: false }); const order = orders.data?.find((item) => item._id === id);
  return <main className="confirmation-page"><span className="confirmation-mark">✓</span><span className="eyebrow">ORDER REQUEST RECEIVED</span><h1>Thanks for choosing fresh.</h1>{orders.isLoading ? <p>Loading your order details…</p> : order ? <><p>Request <strong>#{order._id.slice(-8).toUpperCase()}</strong> is currently <strong>{order.status}</strong>. Payment status: <strong>{order.paymentStatus}</strong>.</p><div className="confirmation-items">{order.items.map((item, index) => <div key={`${item.name}-${index}`}><span>{item.quantity} × {item.name}</span><strong>₹{item.unitPrice * item.quantity}</strong></div>)}<div><strong>Total</strong><strong>₹{order.total}</strong></div></div><p className="payment-note">This request is unpaid. It is not a paid or confirmed order until the restaurant confirms it and payment is verified.</p></> : <p>We could not load this order. <Link to="/account">Check your order history</Link>.</p>}<Link className="button button-dark" to="/menu">Back to the menu</Link></main>;
}
