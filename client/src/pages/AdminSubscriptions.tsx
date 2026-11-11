import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

type Plan = { _id: string; name: string; description: string; duration: string; price: number | null; benefits: string[]; active: boolean };
type Enquiry = { _id: string; name: string; email: string; phone: string; plan: string; notes: string; status: string; createdAt: string };
export function AdminSubscriptions({ enabled }: { enabled: boolean }) {
  const cache = useQueryClient(); const [notice, setNotice] = useState('');
  const plans = useQuery({ queryKey: ['admin-subscription-plans'], queryFn: () => api<Plan[]>('/admin/subscription-plans'), enabled, retry: false });
  const enquiries = useQuery({ queryKey: ['admin-subscription-enquiries'], queryFn: () => api<Enquiry[]>('/admin/subscription-enquiries'), enabled, retry: false });
  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); const priceText = String(data.get('price') || '').trim();
    try { await api('/admin/subscription-plans', { method: 'POST', body: JSON.stringify({ name: data.get('name'), description: data.get('description'), duration: data.get('duration'), price: priceText ? Number(priceText) : null, benefits: String(data.get('benefits') || '').split('\n').map((x) => x.trim()).filter(Boolean), active: true }) }); form.reset(); await cache.invalidateQueries({ queryKey: ['admin-subscription-plans'] }); await cache.invalidateQueries({ queryKey: ['subscription-plans'] }); setNotice('Subscription plan saved.'); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Could not save plan.'); }
  }
  async function update(id: string, values: Partial<Plan>) {
    try { await api(`/admin/subscription-plans/${id}`, { method: 'PATCH', body: JSON.stringify(values) }); await cache.invalidateQueries({ queryKey: ['admin-subscription-plans'] }); await cache.invalidateQueries({ queryKey: ['subscription-plans'] }); setNotice('Subscription plan updated.'); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Could not update plan.'); }
  }
  if (!enabled) return null;
  return <section className="admin-subscriptions"><h2>Subscription plans</h2><p>Only publish details confirmed by the restaurant. Leave price empty until confirmed.</p><form className="admin-create-form" onSubmit={create}><strong>Add a plan</strong><input name="name" placeholder="Plan name" required maxLength={100}/><textarea name="description" placeholder="Short description" required maxLength={1000}/><input name="duration" placeholder="Duration (confirmed)" required maxLength={80}/><input name="price" type="number" min="0" step="1" placeholder="Confirmed price in ₹ (leave blank if pending)"/><textarea name="benefits" placeholder="Confirmed benefits, one per line" maxLength={2000}/><button className="button button-dark">Add plan</button></form>
    {plans.data?.length ? <div className="admin-plan-list">{plans.data.map((plan) => <article key={plan._id}><div><strong>{plan.name}</strong><span>{plan.duration} · {plan.price === null ? 'Price pending' : `₹${plan.price}`}</span></div><label><input type="checkbox" checked={plan.active} onChange={(event) => update(plan._id, { active: event.target.checked })}/> Visible on site</label></article>)}</div> : <p>No plans have been configured.</p>}
    <h2>Subscription enquiries</h2>{enquiries.data?.length ? <div className="admin-orders">{enquiries.data.map((item) => <article key={item._id}><span><strong>{item.name}</strong><br/>{item.plan || 'No plan selected'}</span><span>{item.email}<br/>{item.phone}</span><span>{item.status}</span><span>{new Date(item.createdAt).toLocaleDateString()}</span></article>)}</div> : <p>No subscription enquiries yet.</p>}
    {notice && <p role="status" className="account-notice">{notice}</p>}
  </section>;
}
