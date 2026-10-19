import { Product } from './types';
import { authService } from './auth';

const API_URL = 'http://localhost:8082/api/products';

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  getProduct: async (id: number | string): Promise<Product> => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  },
};