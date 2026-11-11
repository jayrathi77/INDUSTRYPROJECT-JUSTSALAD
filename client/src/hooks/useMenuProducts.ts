import { useQuery } from '@tanstack/react-query';
import { products } from '../services/menu';
import { api } from '../services/api';
import type { Product } from '../types';
export function useMenuProducts() {
  const query = useQuery({ queryKey: ['menu'], queryFn: () => api<{ items: Product[] }>('/menu'), retry: false });
  return { ...query, products: query.data?.items || products };
}
