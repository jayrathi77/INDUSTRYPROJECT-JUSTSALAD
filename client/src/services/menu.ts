import type { Product } from '../types';
import menu from '../../../server/src/data/menu.json';
export const products = menu as Product[];
export const categories = [...new Set(products.map((item) => item.category))];
export const menuSource = 'PDF menu';
