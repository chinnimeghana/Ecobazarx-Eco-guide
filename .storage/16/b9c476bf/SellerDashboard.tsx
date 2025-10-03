import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Package, BarChart3, Leaf, DollarSign, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import { mockProducts, authService } from '@/lib/auth';
import { toast } from 'sonner';

export default function SellerDashboard() {
  const [products] = useState(mockProducts);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    carbonFootprint: '',
    ecoRating: '',
    image: ''
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Product added successfully! Pending admin approval.');
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      carbonFootprint: '',
      ecoRating: '',
      image: ''
    });
    setShowAddProduct(false);
  };

  const sellerProducts = products.filter(p => p.sellerId === '2'); // Mock seller ID
  const totalRevenue = sellerProducts.reduce((acc, p) => acc + p.price, 0);
  const avgEcoRating = sellerProducts.length > 0 
    ? sellerProducts.reduce((acc, p) => acc + p.ecoRating, 0) / sellerProducts.length 
    : 0;
  const totalCarbonSaved = sellerProducts.reduce((acc, p) => acc + (10 - p.carbonFootprint), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-green-300 to-blue-300 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Leaf className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Seller Dashboard
              </h1>
              <p className="text-gray-600">Manage your eco-friendly products</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          >
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Products</CardTitle>
              <Package className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sellerProducts.length}</div>
              <p className="text-xs opacity-80">Active listings</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs opacity-80">Product value</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Avg Eco Rating</CardTitle>
              <Leaf className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgEcoRating.toFixed(1)}</div>
              <p className="text-xs opacity-80">Sustainability score</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Carbon Saved</CardTitle>
              <TrendingUp className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCarbonSaved.toFixed(1)}kg</div>
              <p className="text-xs opacity-80">CO2 reduction</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="products" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              My Products
            </TabsTrigger>
            <TabsTrigger value="add-product" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Add Product
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <span>My Products</span>
                </CardTitle>
                <CardDescription>Manage your eco-friendly product listings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Eco Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sellerProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.description.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="font-semibold">${product.price}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Leaf className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-600">{product.ecoRating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-product">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  <span>Add New Product</span>
                </CardTitle>
                <CardDescription>List a new eco-friendly product for sale</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter product name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your eco-friendly product..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                          <SelectItem value="Fashion">Fashion</SelectItem>
                          <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                          <SelectItem value="Personal Care">Personal Care</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="carbonFootprint">Carbon Footprint (kg CO2)</Label>
                      <Input
                        id="carbonFootprint"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={newProduct.carbonFootprint}
                        onChange={(e) => setNewProduct({...newProduct, carbonFootprint: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ecoRating">Eco Rating (1-10)</Label>
                      <Input
                        id="ecoRating"
                        type="number"
                        min="1"
                        max="10"
                        step="0.1"
                        placeholder="8.5"
                        value={newProduct.ecoRating}
                        onChange={(e) => setNewProduct({...newProduct, ecoRating: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Product Image URL</Label>
                    <Input
                      id="image"
                      placeholder="https://example.com/image.jpg"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span>Sales Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <span className="font-medium">Total Products Listed</span>
                      <span className="text-2xl font-bold text-blue-600">{sellerProducts.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <span className="font-medium">Average Eco Rating</span>
                      <span className="text-2xl font-bold text-green-600">{avgEcoRating.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                      <span className="font-medium">Total Revenue Potential</span>
                      <span className="text-2xl font-bold text-purple-600">${totalRevenue.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <span>Environmental Impact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <span className="font-medium">Total CO2 Saved</span>
                      <span className="text-2xl font-bold text-green-600">{totalCarbonSaved.toFixed(1)}kg</span>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Your products help customers save</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {totalCarbonSaved.toFixed(1)}kg CO2
                      </p>
                      <p className="text-sm text-gray-600 mt-2">compared to conventional alternatives</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}