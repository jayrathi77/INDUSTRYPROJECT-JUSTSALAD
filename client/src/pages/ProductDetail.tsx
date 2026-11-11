import { ArrowLeft, ArrowRight, Leaf } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ProductCard, menuPhoto } from '../components/ProductCard';
import { useMenuProducts } from '../hooks/useMenuProducts';
export function ProductDetail() {
  const { id } = useParams(); const { products } = useMenuProducts();
  const product = products.find((item) => item.id === id);
  if (!product) return <main className="product-detail-missing"><span className="eyebrow">JUST SALAD / MENU</span><h1>We couldn’t find that item.</h1><Link className="button button-dark" to="/menu"><ArrowLeft size={16}/> Back to the menu</Link></main>;
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  return <main className="product-detail-page">
    <Link to="/menu" className="detail-back"><ArrowLeft size={16}/> Back to the menu</Link>
    <section className="product-detail-hero">
      <div className="detail-image-wrap"><img src={menuPhoto(product.category, products.indexOf(product))} alt={`Illustrative ${product.category.toLowerCase()} photo`} fetchPriority="high"/><span>Illustrative category photo</span></div>
      <div className="detail-copy"><span className="eyebrow"><Leaf size={14}/> {product.category}</span><h1>{product.name}</h1><p className="detail-description">{product.description}</p><div className="detail-price">{product.price === null ? <span className="price-pending">Price pending confirmation</span> : `₹${product.price.toLocaleString('en-IN')}`}</div>
        {product.options?.length ? <section className="detail-variants"><h2>Available variants</h2>{product.options.map((option) => <div key={option.name}><strong>{option.name}</strong><p>{option.choices.map((choice, index) => `${choice}${option.prices?.[index] !== undefined ? ` · ₹${option.prices[index]}` : ''}`).join('  /  ')}</p></div>)}</section> : null}
        {product.nutrition && <section className="detail-nutrition"><h2>Nutrition information</h2><p>Approximate values per serving</p><div><span>{product.nutrition.caloriesKcal}<small>kcal</small></span><span>{product.nutrition.proteinG}g<small>protein</small></span><span>{product.nutrition.carbsG}g<small>carbs</small></span><span>{product.nutrition.fiberG}g<small>fiber</small></span><span>{product.nutrition.fatG}g<small>fat</small></span></div></section>}
        {product.ambiguity && <p className="detail-ambiguity"><strong>Price / menu note:</strong> {product.ambiguity}</p>}
        <p className="detail-browse-note">WhatsApp order requests are confirmed by the restaurant.</p>
      </div>
    </section>
    {related.length > 0 && <section className="related-menu"><div className="section-top"><div><span className="eyebrow">MORE FROM {product.category.toUpperCase()}</span><h2>You might also like.</h2></div><Link className="text-link" to="/menu">Explore full menu <ArrowRight size={16}/></Link></div><div className="product-grid">{related.map((item, index) => <ProductCard key={item.id} product={item} index={index}/>)}</div></section>}
  </main>;
}
