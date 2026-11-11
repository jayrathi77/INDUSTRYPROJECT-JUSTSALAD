import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../store/cart';
import { useMenuProducts } from '../hooks/useMenuProducts';
import { api } from '../services/api';
import type { Product } from '../types';
import { calculateSubtotal } from '../utils/cart';
import { formatWhatsAppOrderMessage, isSambhajinagarAddress, isValidWhatsAppNumber, whatsappOrderUrl } from '../utils/whatsappOrder';
import { whatsappUrl, WHATSAPP_NUMBER } from '../components/Header';

type AddressSuggestion = { label: string; id: string };

export function Cart() {
  const { lines, setQuantity, remove, clear } = useCart();
  const { products } = useMenuProducts();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressSelected, setAddressSelected] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [addressSearchState, setAddressSearchState] = useState<'idle' | 'loading' | 'ready' | 'unavailable'>('idle');
  const [instructions, setInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const currentItems = lines.map((line) => ({ line, product: products.find((product) => product.id === line.productId) }));
  const subtotal = calculateSubtotal(lines, products);
  const hasInvalidItem = currentItems.some(({ line, product }) => !product || product.price === null || product.availability === false || !Number.isSafeInteger(line.quantity) || line.quantity < 1 || line.quantity > 99);
  const formatPrice = (amount: number) => `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(amount)}`;
  const deliveryWhatsAppLink = whatsappUrl(`Hello Just Salad! I would like to check delivery availability for ${address.trim() || 'my area'}.`);

  useEffect(() => {
    const query = address.trim();
    if (query.length < 4 || addressSelected) {
      setAddressSuggestions([]);
      setAddressSearchState('idle');
      return;
    }
    const controller = new AbortController();
    setAddressSearchState('loading');
    const timer = window.setTimeout(async () => {
      try {
        const searchQuery = `${query}, Chhatrapati Sambhajinagar, India`;
        const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=8&lang=en`, { signal: controller.signal });
        if (!response.ok) throw new Error('Address search unavailable');
        const data = await response.json() as { features?: { properties?: Record<string, unknown>; geometry?: { coordinates?: number[] } }[] };
        const suggestions = (data.features || []).filter((feature) => {
          const props = feature.properties || {};
          const city = ['city', 'locality', 'town', 'village'].map((key) => typeof props[key] === 'string' ? props[key] as string : '').join(' ');
          const country = typeof props.countrycode === 'string' ? props.countrycode.toLowerCase() : 'in';
          return country === 'in' && isSambhajinagarAddress(city);
        }).map((feature) => {
          const props = feature.properties || {};
          const value = (key: string) => typeof props[key] === 'string' ? props[key] as string : '';
          const main = [value('housenumber'), value('street')].filter(Boolean);
          if (!main.length) main.push(value('name') || value('locality') || value('city'));
          const rest = ['suburb', 'locality', 'town', 'village', 'district', 'city', 'state', 'postcode', 'country'].map(value).filter((part) => part && !main.includes(part));
          const label = [...new Set([...main, ...rest])].join(', ');
          const coordinates = feature.geometry?.coordinates || [];
          return { label, id: `${label}:${coordinates.join(',')}` };
        }).filter((suggestion) => suggestion.label).slice(0, 5);
        setAddressSuggestions(suggestions);
        setAddressSearchState('ready');
      } catch {
        if (!controller.signal.aborted) {
          setAddressSuggestions([]);
          setAddressSearchState('unavailable');
        }
      }
    }, 700);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [address, addressSelected]);

  async function orderOnWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!lines.length) { setError('Add an available menu item before placing an order.'); return; }
    if (!isValidWhatsAppNumber(WHATSAPP_NUMBER)) { setError('WhatsApp ordering is not set up yet. Please contact the restaurant directly.'); return; }
    if (!isSambhajinagarAddress(address)) { setError('Please select or enter an address in Chhatrapati Sambhajinagar.'); return; }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) { setError('Enter a valid contact number.'); return; }
    setSubmitting(true);
    try {
      // Refresh from the API so the WhatsApp estimate uses current server menu data.
      const latest = await api<{ items: Product[] }>('/menu');
      const message = formatWhatsAppOrderMessage({ name, phone, address, instructions }, lines, latest.items);
      window.location.assign(whatsappOrderUrl(WHATSAPP_NUMBER, message));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not verify the latest menu. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="cart-page whatsapp-cart-page">
    <Link className="detail-back" to="/menu"><ArrowLeft size={16}/> Continue browsing</Link>
    <span className="eyebrow">YOUR GOOD THINGS</span><h1>Your order</h1>
    {!lines.length ? <div className="empty-cart"><ShoppingBag size={42}/><h2>Your cart is taking a breather.</h2><p>Find something fresh to bring home.</p><Link className="button button-dark" to="/menu">Explore the menu</Link></div> : <div className="cart-layout">
      <section className="cart-lines" aria-label="Items in your order">
        {currentItems.map(({ line, product }) => <article className="cart-line" key={line.key}>
          <div className="cart-thumb"><ShoppingBag size={19}/></div>
          <div className="cart-product"><h2>{product?.name || 'Menu item unavailable'}</h2><p>{!product ? 'No longer on the menu' : product.availability === false ? 'Currently unavailable' : product.price === null ? 'Price pending confirmation' : `${formatPrice(product.price)} each`}</p></div>
          <div className="quantity-control"><button aria-label={`Decrease ${product?.name || 'item'}`} onClick={() => setQuantity(line.key, line.quantity - 1)}><Minus size={15}/></button><span>{line.quantity}</span><button aria-label={`Increase ${product?.name || 'item'}`} disabled={line.quantity >= 99} onClick={() => setQuantity(line.key, line.quantity + 1)}><Plus size={15}/></button></div>
          <strong>{product?.price == null ? '—' : formatPrice(product.price * line.quantity)}</strong>
          <button className="remove-button" aria-label={`Remove ${product?.name || 'item'}`} onClick={() => remove(line.key)}><Trash2 size={17}/></button>
        </article>)}
        {hasInvalidItem && <p className="account-notice" role="status">Unavailable or unpriced items can’t be ordered. Remove them or check back after the menu is updated.</p>}
        <button className="clear-cart" onClick={clear}>Clear cart</button>
      </section>
      <aside className="order-summary whatsapp-order-summary">
        <h2>Review your order</h2>
        {currentItems.map(({ line, product }) => product && <div className="whatsapp-summary-line" key={line.key}><span>{product.name} × {line.quantity}</span><strong>{product.price === null ? 'Pending' : formatPrice(product.price * line.quantity)}</strong></div>)}
        <div className="whatsapp-summary-total"><span>Estimated total</span><strong>{formatPrice(subtotal)}</strong></div>
        <p>Final availability and amount will be confirmed by Just Salad. No tax, delivery fee, or discount is included.</p>
        {!isValidWhatsAppNumber(WHATSAPP_NUMBER) && <p className="whatsapp-config-note">WhatsApp ordering needs a verified number in <code>client/.env</code>: <code>VITE_WHATSAPP_NUMBER</code> (international digits only, no + or spaces).</p>}
        <form className="whatsapp-customer-form" onSubmit={orderOnWhatsApp}>
          <h3>Your details</h3>
          <label>Name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} placeholder="Your name"/></label>
          <label>Contact number<input autoComplete="tel" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required pattern="[+0-9() .-]{7,24}" maxLength={24} placeholder="Your phone number"/></label>
          <label className="address-label">Address
            <div className="address-autocomplete"><input autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={addressSuggestions.length > 0} aria-controls="address-suggestions" aria-describedby="address-help" value={address} onChange={(event) => { setAddress(event.target.value); setAddressSelected(false); }} required maxLength={300} placeholder="Search street, area or landmark"/>
              {addressSearchState === 'loading' && <span className="address-search-status" role="status">Finding addresses…</span>}
              {addressSuggestions.length > 0 && <ul className="address-suggestions" id="address-suggestions" role="listbox">{addressSuggestions.map((suggestion) => <li key={suggestion.id} role="option" aria-selected="false"><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setAddress(suggestion.label); setAddressSelected(true); setAddressSuggestions([]); }}><MapPin size={15}/><span>{suggestion.label}</span></button></li>)}</ul>}
              {addressSearchState === 'ready' && address.trim().length >= 4 && addressSuggestions.length === 0 && <span className="address-search-status" role="status">No Sambhajinagar match found. Enter the full address with the city name.</span>}
              {addressSearchState === 'unavailable' && <span className="address-search-status" role="status">Suggestions unavailable—enter address manually.</span>}
            </div>
            <small id="address-help" className="address-attribution">Only Chhatrapati Sambhajinagar addresses are accepted. Choose a suggestion or enter the city with your address. Suggestions by Photon / OpenStreetMap.</small>
          </label>
          <label>Special instructions <span>(optional)</span><textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} maxLength={500} rows={3} placeholder="Anything we should know?"/></label>
          {error && <p className="whatsapp-form-error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting || hasInvalidItem || !isValidWhatsAppNumber(WHATSAPP_NUMBER)} className="button whatsapp-order-button"><MessageCircle size={18}/>{submitting ? 'Checking menu…' : 'Order on WhatsApp'}</button>
          {deliveryWhatsAppLink && <a className="delivery-whatsapp-link" href={deliveryWhatsAppLink} target="_blank" rel="noopener noreferrer"><MapPin size={15}/> For delivery, chat with us on WhatsApp</a>}
          <small>WhatsApp opens with your message ready. You’ll need to press Send. This does not confirm the order.</small>
        </form>
      </aside>
    </div>}
  </main>;
}
