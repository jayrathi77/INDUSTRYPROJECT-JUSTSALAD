import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../store/cart';
import { announceCartAdd } from '../utils/cartEvents';
const saladPhotos = ['photo-1540420773420-3366772f4999', 'photo-1540189549336-e6e99c3679fe', 'photo-1490645935967-10de6ba17061'];
const bowlPhotos = ['photo-1512621776951-a57141f2eefd', 'photo-1547592180-85f173990554', 'photo-1505576399274-565b52d4ac71'];
const wrapPhotos = ['photo-1555939594-58d7cb561ad1', 'photo-1528735602780-2552fd46c7af', 'photo-1565299624946-b28f40a0ae38'];
const drinkPhotos = ['photo-1511690743698-d9d85f2fbf38', 'photo-1544145945-f90425340c7e', 'photo-1513558161293-cdacb8f19689'];
export function menuPhoto(category: string, index: number) {
  const normalized = category.toLowerCase();
  const photos = normalized.includes('drink') ? drinkPhotos : normalized.includes('wrap') || normalized.includes('sandwich') ? wrapPhotos : normalized.includes('oatmeal') || normalized.includes('chia') ? bowlPhotos : normalized.includes('bowl') ? bowlPhotos : saladPhotos;
  return `https://images.unsplash.com/${photos[index % photos.length]}?auto=format&fit=crop&w=900&q=82`;
}
export function ProductCard({ product, index = 0, showOrderButton = false }: { product: Product; index?: number; showOrderButton?: boolean }) {
  const add = useCart((state) => state.add);
  const canOrder = product.price !== null && product.availability !== false;
  return <motion.article className="product-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: .4, delay: Math.min(index % 4, 3) * .06 }} whileHover={{ y: -4 }}>
    <Link to={`/menu/${product.id}`} className="product-card-link" aria-label={`View ${product.name} details`}>
      <div className={`product-art photo-art art-${index % 6}`}><img src={menuPhoto(product.category, index)} alt="" loading="lazy" decoding="async"/><span className="photo-category">{product.category}</span></div>
      <div className="product-info"><div className="product-heading"><h3>{product.name}</h3><strong>{product.price === null ? <span className="price-pending">Price pending</span> : `₹${product.price}`}</strong></div><p>{product.description}</p>{product.nutrition && <p className="nutrition">Approx. {product.nutrition.caloriesKcal} kcal · Protein {product.nutrition.proteinG}g · Fiber {product.nutrition.fiberG}g</p>}{product.ambiguity && <p className="ambiguity">{product.ambiguity}</p>}<span className="browse-only">View item details <ArrowUpRight size={13}/></span></div>
    </Link>
    {showOrderButton && <button type="button" className="add-to-order-button" disabled={!canOrder} onClick={() => { add(product.id); announceCartAdd(product.name); }}>{canOrder ? 'Add to Order' : product.availability === false ? 'Unavailable' : 'Price pending'}</button>}
  </motion.article>;
}
