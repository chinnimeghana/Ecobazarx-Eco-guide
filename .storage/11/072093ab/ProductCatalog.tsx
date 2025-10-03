import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ShoppingCart, Leaf, Star, Search, Filter } from 'lucide-react';
import { mockProducts, Product } from '@/lib/auth';
import { toast } from 'sonner';

interface ProductCatalogProps {
  onAddToCart?: (product: Product) => void;
  showAddToCart?: boolean;
}

export default function ProductCatalog({ onAddToCart, showAddToCart = true }: ProductCatalogProps) {
  const [products] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    toast.success(favorites.includes(productId) ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleAddToCart = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg border-0 shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search eco-friendly products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 border-gray-200 focus:border-green-400 focus:ring-green-400"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 h-12 border-gray-200 focus:border-green-400 focus:ring-green-400">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart 
                    className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </Button>
              </div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                  <Leaf className="h-3 w-3 mr-1" />
                  Eco {product.ecoRating}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                  {product.name}
                </CardTitle>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">${product.price}</div>
                </div>
              </div>
              <CardDescription className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">Carbon: {product.carbonFootprint}kg CO2</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-gray-600">{product.ecoRating}/10</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>By {product.sellerName}</span>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>

                {showAddToCart && (
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold transition-all duration-300"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No products found matching your criteria.</div>
          <p className="text-gray-400 mt-2">Try adjusting your search or filter options.</p>
        </div>
      )}
    </div>
  );
}