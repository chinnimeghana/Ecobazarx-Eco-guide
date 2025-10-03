import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Leaf, ShoppingCart, Heart, User, CreditCard, Package } from 'lucide-react';
import ProductCatalog from '@/components/ProductCatalog';
import PaymentSection from '@/components/PaymentSection';
import { Product, authService } from '@/lib/auth';
import { toast } from 'sonner';

export default function BuyerDashboard() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('catalog');
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => [...prev, product]);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handlePaymentComplete = () => {
    setCartItems([]);
    setActiveTab('catalog');
    toast.success('Order placed successfully! Thank you for choosing eco-friendly products.');
  };

  const totalCartValue = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-300 to-green-300 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-green-300 to-purple-300 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Leaf className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                EcoBazar Marketplace
              </h1>
              <p className="text-gray-600">Discover sustainable products for a better tomorrow</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setActiveTab('cart')}
              className="relative hover:bg-green-50 hover:border-green-300"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart ({cartItems.length})
              {cartItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-green-600">
                  {cartItems.length}
                </Badge>
              )}
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Cart Items</CardTitle>
              <ShoppingCart className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cartItems.length}</div>
              <p className="text-xs opacity-80">Products selected</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Cart Value</CardTitle>
              <CreditCard className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCartValue.toFixed(2)}</div>
              <p className="text-xs opacity-80">Total amount</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Eco Impact</CardTitle>
              <Leaf className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cartItems.reduce((acc, item) => acc + (10 - item.carbonFootprint), 0).toFixed(1)}kg
              </div>
              <p className="text-xs opacity-80">CO2 saved</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Eco Discount</CardTitle>
              <Package className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalCartValue * 0.1).toFixed(2)}</div>
              <p className="text-xs opacity-80">10% savings</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="catalog" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Product Catalog
            </TabsTrigger>
            <TabsTrigger value="cart" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Shopping Cart ({cartItems.length})
            </TabsTrigger>
            <TabsTrigger value="checkout" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              Checkout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog">
            <ProductCatalog onAddToCart={addToCart} />
          </TabsContent>

          <TabsContent value="cart">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  <span>Shopping Cart</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <div className="text-gray-500 text-lg">Your cart is empty</div>
                    <p className="text-gray-400 mt-2">Browse our eco-friendly products to get started!</p>
                    <Button 
                      onClick={() => setActiveTab('catalog')}
                      className="mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge className="bg-green-100 text-green-800">
                              <Leaf className="h-3 w-3 mr-1" />
                              Eco {item.ecoRating}
                            </Badge>
                            <span className="text-sm text-gray-500">Saves {(10 - item.carbonFootprint).toFixed(1)}kg CO2</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">${item.price}</div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.id)}
                            className="mt-2 text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total: ${totalCartValue.toFixed(2)}</span>
                        <Button 
                          onClick={() => setActiveTab('checkout')}
                          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        >
                          Proceed to Checkout
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checkout">
            <PaymentSection cartItems={cartItems} onPaymentComplete={handlePaymentComplete} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}