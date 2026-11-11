import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useMenuProducts } from '../hooks/useMenuProducts';

export function Menu() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const orderingMode = useLocation().pathname === '/order-online';
  const { products: items } = useMenuProducts();
  const menuCategories = [...new Set(items.map((product) => product.category))];
  const visible = useMemo(() => items.filter((product) => (category === 'All' || product.category === category) && `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase())), [category, query, items]);

  return <main className={`menu-page ${orderingMode ? 'online-ordering-page' : ''}`}>
    <section className="menu-intro">
      <span className="eyebrow">{orderingMode ? 'BUILD YOUR WHATSAPP ORDER' : 'FRESH FROM OUR KITCHEN'}</span>
      <h1>{orderingMode ? <>Order your <em>favourites.</em></> : <>Find your <em>feel-good.</em></>}</h1>
      <p>{orderingMode ? 'Add available items, review your cart, then send your order to Just Salad on WhatsApp.' : 'Browse the menu and discover something nourishing for your day.'}</p>
      <span className="browse-only">{orderingMode ? 'Prices shown where confirmed' : 'Menu browsing only · Prices shown where confirmed'}</span>
    </section>
    <div className="menu-controls">
      <label className="search-box"><Search size={19}/><input aria-label="Search menu" placeholder="Search something delicious" value={query} onChange={(event) => setQuery(event.target.value)}/></label>
      <span className="menu-count"><SlidersHorizontal size={16}/> {visible.length} items</span>
    </div>
    <div className="category-tabs" aria-label="Menu categories">
      <button className={category === 'All' ? 'active' : ''} onClick={() => setCategory('All')}>Everything</button>
      {menuCategories.map((itemCategory) => <button key={itemCategory} className={category === itemCategory ? 'active' : ''} onClick={() => setCategory(itemCategory)}>{itemCategory}</button>)}
    </div>
    {visible.length ? <div className="product-grid menu-grid">{visible.map((product, index) => <ProductCard key={product.id} product={product} index={index} showOrderButton={orderingMode}/>)}</div> : <div className="empty-results"><span>✿</span><h2>Nothing on the menu by that name.</h2><p>Try another search or browse all categories.</p><button className="button button-dark" onClick={() => { setQuery(''); setCategory('All'); }}>Show everything</button></div>}
    <p className="source-note">Menu transcription from the supplied six-page Just Salad PDF. Items without a clearly stated price are marked pending. Menu card photos are illustrative category photography, not exact item photos.</p>
  </main>;
}
