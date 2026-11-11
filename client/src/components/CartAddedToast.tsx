import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CartAddedToast() {
  const [productName, setProductName] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onAdded = (event: Event) => {
      const detail = (event as CustomEvent<{ productName: string }>).detail;
      setProductName(detail.productName);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setProductName(''), 3500);
    };
    window.addEventListener('just-salad:cart-added', onAdded);
    return () => {
      window.removeEventListener('just-salad:cart-added', onAdded);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return <AnimatePresence>{productName && <motion.aside className="cart-added-toast" role="status" aria-live="polite" initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }}>
    <span className="cart-added-icon"><ShoppingBag size={18}/></span>
    <span className="cart-added-copy"><strong>1 item added to cart</strong><small>{productName}</small></span>
    <Link to="/cart" className="cart-added-link">View cart <ArrowRight size={14}/></Link>
    <button type="button" className="cart-added-close" aria-label="Dismiss message" onClick={() => setProductName('')}><X size={16}/></button>
  </motion.aside>}</AnimatePresence>;
}
