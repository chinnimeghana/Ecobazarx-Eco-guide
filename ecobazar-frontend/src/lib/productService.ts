import { Product } from './types';

const API_URL = 'http://localhost:8082/api'; // your Spring Boot backend URL

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  updateProductStatus: async (id: number | string, status: 'ACTIVE' | 'REMOVED'): Promise<Product> => {
    const res = await fetch(`${API_URL}/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update product status');
    return res.json();
  }
};
