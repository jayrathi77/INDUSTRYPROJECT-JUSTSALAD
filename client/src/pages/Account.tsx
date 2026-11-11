import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { api } from '../services/api';

type User = { id: string; name: string; email: string; role: 'customer' | 'admin'; phone?: string };
type Order = { _id: string; status: string; paymentStatus: string; total: number; createdAt: string; items: { name: string; quantity: number }[] };
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
const registrationSchema = z.object({ name: z.string().trim().min(1, 'Name is required').max(100), email: z.string().email(), password: z.string().min(10, 'Use at least 10 characters').max(128), phone: z.string().max(30).optional() });
type Fields = { name: string; email: string; password: string; phone: string };
export function Account() {
  const [registering, setRegistering] = useState(false); const [notice, setNotice] = useState(''); const queryClient = useQueryClient();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<Fields>();
  const account = useQuery({ queryKey: ['account'], queryFn: () => api<User>('/auth/me'), retry: false });
  const orders = useQuery({ queryKey: ['orders'], queryFn: () => api<Order[]>('/orders/mine'), enabled: account.isSuccess, retry: false });
  const submit = handleSubmit(async (values) => {
    setNotice('');
    const result = (registering ? registrationSchema : loginSchema).safeParse(values);
    if (!result.success) { const issue = result.error.issues[0]; setError(issue.path[0] as keyof Fields, { message: issue.message }); return; }
    try { const user = await api<User>(`/auth/${registering ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify(values) }); queryClient.setQueryData(['account'], user); await queryClient.invalidateQueries({ queryKey: ['orders'] }); }
    catch (e) { setNotice(e instanceof Error ? e.message : 'Unable to sign in.'); }
  });
  async function logout() { await api('/auth/logout', { method: 'POST' }); queryClient.removeQueries({ queryKey: ['account'] }); queryClient.removeQueries({ queryKey: ['orders'] }); }
  async function saveProfile(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); try { const user = await api<User>('/auth/me', { method: 'PATCH', body: JSON.stringify({ name: form.get('name'), phone: form.get('phone') }) }); queryClient.setQueryData(['account'], user); setNotice('Profile saved.'); } catch (e) { setNotice(e instanceof Error ? e.message : 'Unable to save profile.'); } }
  if (account.isLoading) return <main className="account-page"><p>Checking your account…</p></main>;
  if (account.data) return <main className="account-page"><span className="eyebrow">YOUR JUST SALAD ACCOUNT</span><h1>Welcome back, {account.data.name}.</h1><p className="account-role">{account.data.role === 'admin' ? 'Administrator' : 'Member'} · {account.data.email}</p><form className="profile-form" onSubmit={saveProfile}><label>Name<input name="name" defaultValue={account.data.name} required maxLength={100}/></label><label>Phone<input name="phone" defaultValue={account.data.phone || ''} maxLength={30}/></label><button className="button button-dark">Save profile</button></form>{notice && <p role="status" className="account-notice">{notice}</p>}<div className="order-history"><h2>Your orders</h2>{orders.isLoading ? <p>Loading order history…</p> : orders.data?.length ? orders.data.map((order) => <article key={order._id}><div><strong>{order.items.map((item) => `${item.quantity} × ${item.name}`).join(', ')}</strong><small>{new Date(order.createdAt).toLocaleDateString()}</small></div><span>{order.status} · {order.paymentStatus}</span><b>₹{order.total}</b></article>) : <p>No orders yet.</p>}</div><button className="text-link logout-button" onClick={logout}>Log out</button></main>;
  return <main className="account-page"><span className="eyebrow">A LITTLE GOODNESS, TO GO</span><h1>{registering ? 'Create your account.' : 'Welcome back.'}</h1><p className="account-role">Sign in to manage your profile and see your order history.</p><form className="auth-form" onSubmit={submit} noValidate>{registering && <label>Name<input autoComplete="name" {...register('name')}/>{errors.name && <small role="alert">{errors.name.message}</small>}</label>}<label>Email<input type="email" autoComplete="email" {...register('email')}/>{errors.email && <small role="alert">{errors.email.message}</small>}</label><label>Password<input type="password" autoComplete={registering ? 'new-password' : 'current-password'} {...register('password')}/>{errors.password && <small role="alert">{errors.password.message}</small>}</label>{registering && <label>Phone (optional)<input autoComplete="tel" {...register('phone')}/></label>}{notice && <p role="alert" className="account-notice">{notice}</p>}<button className="button button-dark" disabled={isSubmitting}>{isSubmitting ? 'One moment…' : registering ? 'Create account' : 'Log in'}</button></form><button className="account-switch" onClick={() => { setRegistering(!registering); setNotice(''); }}>{registering ? 'Already a member? Log in' : 'New here? Create an account'}</button></main>;
}
