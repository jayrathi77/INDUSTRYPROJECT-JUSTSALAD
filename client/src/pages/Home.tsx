import { ArrowLeft, ArrowRight, Clock3, Instagram, Leaf, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products } from '../services/menu';
import { menuPhoto } from '../components/ProductCard';
import { BUSINESS_ADDRESS, BUSINESS_HOURS, BUSINESS_PHONE, BUSINESS_PHONE_LINK, INSTAGRAM_URL, whatsappUrl } from '../components/Header';

export function Home() {
  const [activeCategory, setActiveCategory] = useState('Everything');
  const menuRail = useRef<HTMLDivElement>(null);
  const menuCategories = ['Everything', ...new Set(products.map((product) => product.category))];
  const homeProducts = activeCategory === 'Everything' ? products : products.filter((product) => product.category === activeCategory);
  const wa = whatsappUrl('Hi Just Salad, I have a general enquiry.');
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS_ADDRESS)}`;

  return <main>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow"><Leaf size={15}/> CHHATRAPATI SAMBHAJINAGAR’S 1ST HEALTHY FOOD BRAND</span>
        <h1>Find your<br/><em>fresh favourite.</em></h1>
        <p>Pure vegetarian salads, bowls, wraps, and drinks. Explore the Just Salad menu.</p>
        <div className="hero-actions"><Link className="button button-dark" to="/menu">Explore the menu <ArrowRight size={17}/></Link><Link className="text-link" to="/subscriptions">Discover subscriptions <ArrowRight size={16}/></Link></div>
        <span className="veg-note"><span aria-hidden="true">●</span> Pure vegetarian</span>
      </div>
      <motion.div className="hero-visual" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8 }}>
        <img className="hero-food-photo" src="/images/hero-salad.jpg" alt="Colorful salad bowl with leafy greens, avocado, quinoa, chickpeas, and pomegranate" fetchPriority="high"/>
        <div className="floating-note">A little greener<br/>every day <span>✦</span></div>
        <div className="hero-sticker">FRESH<br/>IS A<br/>FEELING</div>
      </motion.div>
      <div className="hero-scroll">JUST SALAD / MENU</div>
    </section>
    <section className="promise-strip"><span>Salads</span><b>✳</b><span>Bowls</span><b>✳</b><span>Wraps</span><b>✳</b><span>Drinks</span></section>
    <section id="story" className="story-section"><div className="story-art"><div className="story-circle"><span>GROW<br/>GOOD<br/>THINGS</span><Leaf size={58}/></div></div><div className="story-copy"><span className="eyebrow">JUST SALAD / OUR STORY</span><h2>Eat well.<br/><em>Feel like yourself.</em></h2><p>Explore a menu of salads, bowls, wraps, and more, with options for different kinds of days.</p><Link className="text-link" to="/menu">Explore the menu <ArrowRight size={17}/></Link></div></section>
    <section className="section featured home-menu-explorer"><div className="section-top"><div><span className="eyebrow">FRESH PICKS, ALL IN ONE PLACE</span><h2>Find your<br/><em>next favourite.</em></h2></div><div className="menu-rail-controls"><button type="button" aria-label="Scroll menu items left" onClick={() => menuRail.current?.scrollBy({ left: -340, behavior: 'smooth' })}><ArrowLeft size={18}/></button><button type="button" aria-label="Scroll menu items right" onClick={() => menuRail.current?.scrollBy({ left: 340, behavior: 'smooth' })}><ArrowRight size={18}/></button></div></div><div className="home-category-tabs" aria-label="Filter menu images">{menuCategories.map((category) => <button type="button" key={category} className={activeCategory === category ? 'active' : ''} aria-pressed={activeCategory === category} onClick={() => { setActiveCategory(category); if (menuRail.current) menuRail.current.scrollLeft = 0; }}>{category}</button>)}</div><div className="home-menu-rail" ref={menuRail}>{homeProducts.map((product) => { const index = products.indexOf(product); return <article className="home-menu-card" key={product.id}><Link to={`/menu/${product.id}`}><div className="home-menu-image"><img src={menuPhoto(product.category, index)} alt={product.name} loading="lazy" decoding="async"/><span>{product.category}</span></div><div className="home-menu-card-copy"><h3>{product.name}</h3><strong>{product.price === null ? 'Price pending' : `₹${product.price}`}</strong></div><span className="home-menu-discover">View item <ArrowRight size={14}/></span></Link></article>; })}</div><div className="home-menu-footer"><span>Swipe or use the arrows to browse every menu image.</span><Link className="text-link" to="/menu">Explore the full menu <ArrowRight size={16}/></Link></div></section>
    <section className="service-highlights"><article><span>01 / EVERYDAY</span><h3>Make room for good habits.</h3><p>Explore meal subscription options and ask our team about current plans.</p><Link to="/subscriptions" className="text-link">Discover subscriptions <ArrowRight size={16}/></Link></article><article><span>02 / AT WORK</span><h3>Bring fresh to your team.</h3><p>Tell us what your workplace is looking for and we’ll be in touch.</p><Link to="/corporate" className="text-link">Corporate enquiries <ArrowRight size={16}/></Link></article></section>
    <section className="contact-section" id="contact"><div><span className="eyebrow">COME SAY HELLO</span><h2>Find Just Salad<br/><em>in Chhatrapati Sambhajinagar.</em></h2><p>Pure vegetarian · Open daily</p></div><div className="contact-details"><a href={`tel:${BUSINESS_PHONE_LINK}`}><Phone/><span><small>CALL US</small>{BUSINESS_PHONE}</span></a><div><Clock3/><span><small>HOURS</small>{BUSINESS_HOURS}</span></div><a href={mapUrl} target="_blank" rel="noopener noreferrer"><MapPin/><span><small>FIND US</small>{BUSINESS_ADDRESS}</span></a></div></section>
    <section className="social-section"><div><span className="eyebrow">A LITTLE FRESHNESS IN YOUR FEED</span><h2>Let’s stay<br/><em>in the loop.</em></h2><p>Follow Just Salad for updates from our kitchen.</p><a className="button button-dark" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Follow us on Instagram <Instagram size={17}/></a></div><a className="social-photo" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Visit Just Salad on Instagram"><img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80" alt="Colorful salad ingredients"/><span><Instagram size={18}/> @justsalad.csn</span></a></section>
    <section className="closing-cta"><span className="eyebrow">JUST SALAD / MENU</span><h2>Your next favourite<br/><em>is waiting.</em></h2><Link to="/menu" className="button button-cream">See what’s on the menu <ArrowRight size={17}/></Link>{wa && <a className="closing-contact" href={wa} target="_blank" rel="noopener noreferrer"><MessageCircle size={15}/> Chat with us on WhatsApp</a>}</section>
  </main>;
}
