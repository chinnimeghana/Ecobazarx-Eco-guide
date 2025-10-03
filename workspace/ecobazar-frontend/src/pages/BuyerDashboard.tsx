import React, { useEffect, useState } from 'react';
import { Product } from '@/lib/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BuyerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all active products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products?status=active`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProducts().finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded shadow">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="mt-1 font-bold">${product.price}</p>
            <p className="text-sm text-green-700">Eco Rating: {product.ecoRating}</p>
            <p className="text-sm text-gray-500">Carbon Footprint: {product.carbonFootprint} kg CO₂</p>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
              onClick={() => alert('Add to cart functionality')}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerDashboard;
