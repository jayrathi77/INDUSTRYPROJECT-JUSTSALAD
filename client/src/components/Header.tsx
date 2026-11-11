import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Instagram, Menu as MenuIcon, X } from 'lucide-react';
export const INSTAGRAM_URL = 'https://www.instagram.com/justsalad.csn/';
export const BUSINESS_PHONE = '9607599959';
export const BUSINESS_PHONE_LINK = '+919607599959';
export const BUSINESS_HOURS = '9 am – 9 pm';
export const BUSINESS_ADDRESS = 'Below O2 Hyperfit Gym, Mondha Naka Signal, Chhatrapati Sambhajinagar';
export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.trim() || undefined;
export function whatsappUrl(message = 'Hi Just Salad, I have an enquiry.') { return WHATSAPP_NUMBER && /^[1-9]\d{7,14}$/.test(WHATSAPP_NUMBER) ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}` : null; }
export function BrandMark() { return <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40" focusable="false"><path d="M9 23.5c0-6.1 4.9-11 11-11 0 6.1-4.9 11-11 11Z"/><path d="M31 23.5c0-6.1-4.9-11-11-11 0 6.1 4.9 11 11 11Z"/><path d="M20 12.5v14M11 27h18l-2.2 5H13.2L11 27Z"/><path d="M14 29.5h12"/></svg></span>; }
export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="header-inner"><Link to="/" className="brand" onClick={() => setOpen(false)}><BrandMark/><span>just salad<small>FRESH, EVERY DAY</small></span></Link><button className="mobile-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>{open ? <X/> : <MenuIcon/>}</button><nav className={open ? 'main-nav open' : 'main-nav'}><NavLink to="/menu" onClick={() => setOpen(false)}>Our menu</NavLink><NavLink className="order-online-nav-link" to="/order-online" onClick={() => setOpen(false)}>Order online</NavLink><a href="/#story" onClick={() => setOpen(false)}>Our story</a><NavLink to="/subscriptions" onClick={() => setOpen(false)}>Subscriptions</NavLink><NavLink to="/corporate" onClick={() => setOpen(false)}>Corporate</NavLink><a className="instagram-link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Just Salad on Instagram"><Instagram size={18}/></a></nav></div></header>;
}
