import React, { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { productService } from '@/lib/productService';

const ProductDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  if (loading) return <div className="text-center mt-10">Loading products...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Product Catalog</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div
            key={product.id}
            className="relative border rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300 bg-white group"
          >
            <img
              src={product.imageUrl || '/placeholder.png'}
              alt={product.name}
              className="w-full h-48 object-cover"
            />

            <span
              className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded ${
                product.status === 'ACTIVE' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {product.status}
            </span>

            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <button
                className="bg-white text-black px-4 py-2 rounded mb-2 hover:bg-gray-200"
                onClick={() => openModal(product)}
              >
                Quick View
              </button>
              <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200">
                Add to Wishlist
              </button>
            </div>

            <div className="p-4 flex flex-col justify-between h-48">
              <div>
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <p className="text-lg font-bold mb-2">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
              </div>
              <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Animated Quick View Modal */}
      {selectedProduct && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
            isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className={`bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 transform transition-transform duration-300 ${
              isModalOpen ? 'scale-100' : 'scale-90'
            }`}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={selectedProduct.imageUrl || '/placeholder.png'}
                alt={selectedProduct.name}
                className="w-full md:w-1/2 h-64 object-cover rounded"
              />
              <div className="flex flex-col justify-between md:w-1/2">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                  <p className="text-gray-700 mb-2">{selectedProduct.description}</p>
                  <p className="text-lg font-bold mb-2">${selectedProduct.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Quantity: {selectedProduct.quantity}</p>
                  <p
                    className={`text-sm font-semibold ${
                      selectedProduct.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    Status: {selectedProduct.status}
                  </p>
                </div>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDashboard;
