import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/lib/types';
import { productService } from '@/lib/productService';
import { useCart } from '@/lib/CartContext';
import { authService } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Leaf, ShoppingCart, Search, Menu, User, Package, Tag } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'ALL', label: 'All Categories' },
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'HOME_GARDEN', label: 'Home & Garden' },
  { value: 'CLOTHING', label: 'Clothing' },
  { value: 'FOOD', label: 'Food' },
  { value: 'PERSONAL_CARE', label: 'Personal Care' },
  { value: 'OTHER', label: 'Other' },
];

const BuyerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProducts().finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="p-6">Loading products...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 w-full">
      {/* Full-width sticky navigation bar with seller dashboard spacing */}
      <div className="w-full bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          
          {/* Left: Menu & Logo */}
          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Tag className="h-4 w-4 mr-2" /> Categories
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {CATEGORIES.map(cat => (
                      <DropdownMenuItem key={cat.value} onClick={() => setSelectedCategory(cat.value)}>
                        {cat.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/order-history')}>
                  <Package className="h-4 w-4 mr-2" /> Order History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <Leaf className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  EcoBazar
                </h1>
                <p className="text-xs text-gray-600">Buyer Dashboard</p>
              </div>
            </div>
          </div>

          {/* Center Links - Increased spacing to space-x-12 to match seller dashboard */}
          <div className="hidden md:flex items-center space-x-12 text-sm font-medium text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-green-600 transition-colors">Home</button>
            <button onClick={() => navigate('/about')} className="hover:text-green-600 transition-colors">About</button>
            <button onClick={() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-green-600 transition-colors">Products</button>
          </div>

          <div className="flex-1 max-w-sm relative mx-6 hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search eco-friendly products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-sm bg-gray-50/50 border-gray-200 focus-visible:ring-green-500 w-full"
            />
          </div>

          {/* Right: Cart and Logout */}
          <div className="flex items-center gap-3">
            <Button variant="outline" className="relative" onClick={() => navigate('/checkout')}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
            <Button onClick={handleLogout} variant="outline" className="hover:bg-red-50 hover:border-red-300 hover:text-red-600">
              Logout
            </Button>
          </div>

        </div>
      </div>

      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Hello, {user?.username ?? 'there'}
          </h1>
          <p className="text-gray-600">
            {selectedCategory === 'ALL' ? 'Browse eco-friendly products' : `Showing: ${CATEGORIES.find(c => c.value === selectedCategory)?.label}`}
          </p>
        </div>

        <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-10">No products match your filters.</p>
          ) : (
            filteredProducts.map(product => {
              const highCarbon = (product.carbonFootprint ?? 0) >= 8;
              return (
                <div
                  key={product.id}
                  className="bg-white/95 border-0 shadow-lg rounded-xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={product.imageUrl || 'https://placehold.co/400x300?text=No+Image'}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <h2 className="font-semibold text-lg">{product.name}</h2>
                      <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                      <p className="mt-1 font-bold text-lg">${product.price}</p>
                      <p className="text-sm text-gray-500">{product.category ? product.category.replace('_', ' ') : 'Uncategorized'}</p>
                      <p className="text-sm text-green-700">Eco Rating: {product.ecoRating ?? '—'} / 10</p>
                      <p className={`text-sm font-medium ${highCarbon ? 'text-red-600' : 'text-gray-500'}`}>
                        Carbon Footprint: {product.carbonFootprint != null ? `${product.carbonFootprint} kg CO₂` : '—'}
                        {highCarbon && ' ⚠ High'}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600"
                      onClick={() => {
                        addToCart(product);
                        toast.success(`${product.name} added to cart`);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;