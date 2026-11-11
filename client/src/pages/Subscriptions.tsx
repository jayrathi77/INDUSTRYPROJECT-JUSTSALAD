import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, Clock3, MessageCircle } from 'lucide-react';
import { api } from '../services/api';
import { whatsappUrl } from '../components/Header';

type Plan = { _id: string; name: string; description: string; duration: string; price: number | null; benefits: string[] };
export function Subscriptions() {
  const [status, setStatus] = useState('');
  const plans = useQuery({ queryKey: ['subscription-plans'], queryFn: () => api<Plan[]>('/subscriptions/plans') });
  const wa = whatsappUrl('Hi Just Salad, I would like to know about meal subscriptions.');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form)); setStatus('Sending your enquiry…');
    try { await api('/enquiries/subscription', { method: 'POST', body: JSON.stringify(data) }); form.reset(); setStatus('Thanks — your enquiry has been received. The team will follow up.'); }
    catch (error) { setStatus(error instanceof Error ? error.message : 'Unable to send your enquiry. Please try again.'); }
  }
  return <main className="enquiry-page subscription-page"><section className="enquiry-hero"><span className="eyebrow">A LITTLE MORE FRESH, EVERY DAY</span><h1>Your routine,<br/><em>with more green.</em></h1><p>Explore meal plans and send an enquiry. We’ll confirm current availability and terms with you.</p></section>
    <section className="subscription-plans"><div className="plan-section-heading"><div><span className="eyebrow">MEAL PLANS</span><h2>Find a rhythm that fits.</h2></div><span className="plan-disclaimer"><Clock3 size={15}/> Enquiry only · No online payment</span></div>
      {plans.isLoading ? <p>Loading current plans…</p> : plans.data?.length ? <div className="plan-cards">{plans.data.map((plan) => <article className="plan-card" key={plan._id}><span className="eyebrow">{plan.duration}</span><h3>{plan.name}</h3><p>{plan.description}</p><strong className="plan-price">{plan.price === null ? 'Ask for pricing' : `₹${plan.price.toLocaleString('en-IN')}`}<small>{plan.price === null ? '' : ' / plan'}</small></strong>{plan.benefits.length > 0 && <ul>{plan.benefits.map((benefit) => <li key={benefit}><Check size={16}/>{benefit}</li>)}</ul>}<a className="button button-dark" href="#subscription-enquiry">Enquire about this plan</a></article>)}</div> : <div className="plans-empty"><h3>Plans are being confirmed.</h3><p>Send an enquiry and the team can share current options, durations, and pricing.</p>{wa && <a className="text-link" href={wa} target="_blank" rel="noopener noreferrer">Ask on WhatsApp <MessageCircle size={16}/></a>}</div>}
      {plans.isError && <p className="form-status" role="status">We couldn’t load plans. You can still send an enquiry below.</p>}
    </section>
    <section className="subscription-enquiry" id="subscription-enquiry"><div><span className="eyebrow">SUBSCRIPTION ENQUIRY</span><h2>Tell us what you’re looking for.</h2><p>We’ll get back to you with confirmed plan details.</p>{wa && <a className="text-link" href={wa} target="_blank" rel="noopener noreferrer">Or chat with us on WhatsApp <MessageCircle size={16}/></a>}</div><form className="enquiry-form" onSubmit={submit}><label>Your name<input name="name" required minLength={2} maxLength={100}/></label><label>Email<input name="email" type="email" required maxLength={254}/></label><label>Phone<input name="phone" type="tel" required minLength={7} maxLength={30}/></label><label>Plan of interest<select name="plan" defaultValue=""><option value="">Not sure yet</option>{plans.data?.map((plan) => <option key={plan._id}>{plan.name}</option>)}</select></label><label className="form-wide">Anything you’d like us to know?<textarea name="notes" rows={3} maxLength={2000}/></label><button className="button button-dark">Send enquiry</button>{status && <p className="form-status" role="status">{status}</p>}</form></section>
    <section className="faq-section"><span className="eyebrow">GOOD TO KNOW</span><h2>Questions, answered.</h2><details><summary>How much does a plan cost?</summary><p>Published plans show confirmed pricing. If no price is listed, ask the team for current details.</p></details><details><summary>Can I choose my meals?</summary><p>Meal choices depend on the plan. The team can explain the options when they respond.</p></details><details><summary>Can I pay or activate a plan here?</summary><p>No. This page supports plan discovery and enquiries only.</p></details></section></main>;
}
