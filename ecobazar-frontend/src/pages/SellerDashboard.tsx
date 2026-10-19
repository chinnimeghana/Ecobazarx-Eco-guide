import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Plus, Package, BarChart3, Leaf, DollarSign, TrendingUp, Pencil, Trash2, X, Menu, User, Tag, Search, Check, Ban } from 'lucide-react';
import { authService } from '@/lib/auth';
import { productService } from '@/lib/productService';
import { Product } from '@/lib/types';
import { toast } from 'sonner';

const CATEGORY_OPTIONS: { value: Product['category']; label: string }[] = [
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'HOME_GARDEN', label: 'Home & Garden' },
  { value: 'CLOTHING', label: 'Clothing' },
  { value: 'FOOD', label: 'Food' },
  { value: 'PERSONAL_CARE', label: 'Personal Care' },
  { value: 'OTHER', label: 'Other' },
];

const FILTER_CATEGORIES = [{ value: 'ALL', label: 'All Categories' }, ...CATEGORY_OPTIONS];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  quantity: '',
  category: '' as Product['category'] | '',
  imageUrl: '',
};

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [productData, orderRes] = await Promise.all([
        productService.getProducts(),
        fetch('http://localhost:8082/api/orders').then(res => res.json()).catch(() => [])
      ]);
      setProducts(productData);
      setOrders(orderRes);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: String(product.price),
      quantity: String(product.quantity),
      category: product.category || '',
      imageUrl: product.imageUrl || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewProduct(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.category) {
      toast.error('Please select a category');
      return;
    }

    setSubmitting(true);
    try {
      const url = editingId
        ? `http://localhost:8082/api/products/${editingId}`
        : 'http://localhost:8082/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          quantity: parseInt(newProduct.quantity, 10),
          category: newProduct.category,
          imageUrl: newProduct.imageUrl || null,
        }),
      });

      if (!res.ok) throw new Error(editingId ? 'Failed to update product' : 'Failed to add product');

      toast.success(editingId ? 'Product updated successfully!' : 'Product added successfully!');
      setNewProduct(emptyForm);
      setEditingId(null);
      fetchData();
    } catch (err) {
      toast.error(editingId ? 'Failed to update product' : 'Failed to add product');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      const res = await fetch(`http://localhost:8082/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to delete');
      }
      toast.success('Product deleted');
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete product');
      console.error(err);
    }
  };

  const handleOrderStatusChange = async (orderId: number, status: string) => {
    try {
      const res = await fetch(`http://localhost:8082/api/orders/${orderId}/status?status=${status}`, {
        method: 'PUT',
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      toast.success(`Order #${orderId} ${status.toLowerCase()}`);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err) {
      toast.error('Failed to update order status');
      console.error(err);
    }
  };

  const displayedProducts = products
    .filter(p => selectedCategory === 'ALL' || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalRevenue = products.reduce((acc, p) => acc + p.price, 0);
  const avgEcoRating = products.length > 0
    ? products.reduce((acc, p) => acc + (p.ecoRating || 0), 0) / products.length
    : 0;
  const totalCarbonSaved = products.reduce((acc, p) => acc + (10 - (p.carbonFootprint || 0)), 0);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 w-full">
      {/* Full-width sticky navigation bar with increased gap between nav links */}
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
                    {FILTER_CATEGORIES.map(cat => (
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
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <Leaf className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  EcoBazar
                </h1>
                <p className="text-xs text-gray-600">Seller Dashboard</p>
              </div>
            </div>
          </div>

          {/* Center Links & Search - Increased spacing from space-x-8 to space-x-12 */}
          <div className="hidden md:flex items-center space-x-12 text-sm font-medium text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-green-600 transition-colors">Home</button>
            <button onClick={() => navigate('/about')} className="hover:text-green-600 transition-colors">About</button>
            <button onClick={() => navigate('/products')} className="hover:text-green-600 transition-colors">Products</button>
          </div>

          <div className="flex-1 max-w-sm relative mx-6 hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-9 h-9 text-sm bg-gray-50/50 border-gray-200 focus-visible:ring-green-500 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Right: Logout button */}
          <div>
            <Button onClick={handleLogout} variant="outline" className="hover:bg-red-50 hover:border-red-300 hover:text-red-600">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Seller Dashboard
          </h1>
          <p className="text-gray-600">Manage your eco-friendly products and incoming orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Products</CardTitle>
              <Package className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs opacity-80">All listings</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs opacity-80">Product value</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Avg Eco Rating</CardTitle>
              <Leaf className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgEcoRating.toFixed(1)}</div>
              <p className="text-xs opacity-80">Sustainability score</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-lg">
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

        <Tabs defaultValue="products" value={editingId ? 'add-product' : undefined} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="add-product">{editingId ? 'Edit Product' : 'Add Product'}</TabsTrigger>
            <TabsTrigger value="orders">Incoming Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card id="product-table" className="bg-white/80 backdrop-blur-sm border-0 shadow-lg w-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <span>My Products</span>
                </CardTitle>
                <CardDescription>
                  {selectedCategory === 'ALL' ? 'All products currently listed' : `Showing: ${FILTER_CATEGORIES.find(c => c.value === selectedCategory)?.label}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Eco Rating</TableHead>
                      <TableHead>Carbon Footprint</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img
                            src={product.imageUrl || 'https://placehold.co/60x60?text=No+Image'}
                            alt={product.name}
                            className="w-12 h-12 object-contain rounded bg-gray-50"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description}</div>
                        </TableCell>
                        <TableCell>{product.category ? product.category.replace('_', ' ') : 'Uncategorized'}</TableCell>
                        <TableCell className="font-semibold">${product.price}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Leaf className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-600">{product.ecoRating ?? '—'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              product.carbonFootprint != null && product.carbonFootprint >= 8
                                ? "text-red-600 font-bold bg-red-50 px-2 py-1 rounded"
                                : ""
                            }
                          >
                            {product.carbonFootprint != null ? `${product.carbonFootprint} kg CO₂` : '—'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => startEdit(product)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => handleDelete(product.id)}>
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
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg w-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Plus className="h-5 w-5 text-blue-600" />
                    <span>{editingId ? 'Edit Product' : 'Add New Product'}</span>
                  </span>
                  {editingId && (
                    <Button size="sm" variant="ghost" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-1" /> Cancel edit
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  Carbon footprint and eco rating are calculated automatically based on category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter product name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
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
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
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
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/product.jpg"
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="100"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value: Product['category']) => setNewProduct({ ...newProduct, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORY_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg w-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <span>Incoming Customer Orders</span>
                </CardTitle>
                <CardDescription>
                  List of all orders placed by customers across the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">No incoming orders yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Shipping Address</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-semibold">#{order.id}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                              order.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status || 'PENDING'}
                            </span>
                          </TableCell>
                          <TableCell>{order.shippingAddress || 'N/A'}</TableCell>
                          <TableCell>{order.paymentMethod || 'COD'}</TableCell>
                          <TableCell className="font-semibold text-green-600">${order.totalAmount}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {order.orderItems?.map((item, idx) => (
                                <div key={idx} className="text-sm text-gray-600">
                                  {item.product?.name || item.productName || 'Product'} (x{item.quantity}) - ${item.price}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {(!order.status || order.status === 'PENDING') ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="h-8 bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleOrderStatusChange(order.id, 'ACCEPTED')}
                                >
                                  <Check className="h-4 w-4 mr-1" /> Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-8"
                                  onClick={() => handleOrderStatusChange(order.id, 'REJECTED')}
                                >
                                  <Ban className="h-4 w-4 mr-1" /> Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic font-medium">Processed</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg w-full">
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
                      <span className="text-2xl font-bold text-blue-600">{products.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <span className="font-medium">Average Eco Rating</span>
                      <span className="text-2xl font-bold text-green-600">{avgEcoRating.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                      <span className="font-medium">Total Product Value</span>
                      <span className="text-2xl font-bold text-purple-600">${totalRevenue.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg w-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <span>Environmental Impact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Estimated CO2 saved vs conventional alternatives</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      {totalCarbonSaved.toFixed(1)}kg CO2
                    </p>
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