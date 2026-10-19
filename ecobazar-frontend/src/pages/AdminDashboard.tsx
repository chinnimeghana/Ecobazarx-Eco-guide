import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, ShoppingCart, BarChart3, CheckCircle, Trash2, Leaf } from 'lucide-react';
import { authService } from '@/lib/auth';
import { Product } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED' | null;
}

const API_BASE = 'http://localhost:8082';

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAll = async () => {
    try {
      const [usersRes, productsRes] = await Promise.all([
        fetch(`${API_BASE}/api/users`),
        fetch(`${API_BASE}/api/products`),
      ]);
      setUsers(await usersRes.json());
      setProducts(await productsRes.json());
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAll().finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleApprove = async (userId: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}/approve`, { method: 'PUT' });
      if (!res.ok) throw new Error('Failed to approve');
      toast.success('User approved');
      fetchAll();
    } catch (err) {
      toast.error('Failed to approve user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to delete');
      }
      toast.success('User deleted');
      fetchAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to delete');
      }
      toast.success('Product deleted');
      fetchAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const buyers = users.filter(u => u.role === 'BUYER');
  const sellers = users.filter(u => u.role === 'SELLER');

  const totalUsers = users.length;
  const activeSellers = sellers.filter(u => u.status === 'ACTIVE').length;
  const totalProducts = products.length;
  const totalCarbonSaved = products.reduce((acc, p) => acc + (10 - (p.carbonFootprint || 0)), 0);
  const avgEcoRating = products.length > 0
    ? products.reduce((acc, p) => acc + (p.ecoRating || 0), 0) / products.length
    : 0;

  if (loading) return <div className="p-6">Loading...</div>;

  const renderUserTable = (list: AdminUser[], emptyLabel: string) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {list.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-gray-400 py-6">{emptyLabel}</TableCell>
          </TableRow>
        ) : (
          list.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.status === 'ACTIVE' ? 'default' : user.status === 'PENDING' ? 'secondary' : 'destructive'}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {user.status === 'PENDING' && (
                    <Button size="sm" variant="outline" onClick={() => handleApprove(user.id)}>
                      <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      Approve
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <div className="relative z-10">
        {/* Updated Navbar with w-full and flex justify-between */}
        <div className="w-full bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-10">
          <div className="w-full px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Leaf className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  EcoBazar Admin
                </h1>
                <p className="text-gray-600">Sustainable Marketplace Management</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="hover:bg-red-50 hover:border-red-300 hover:text-red-600">
              Logout
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Total Users</CardTitle>
                <Users className="h-4 w-4 opacity-90" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs opacity-80">Registered members</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Active Sellers</CardTitle>
                <ShoppingCart className="h-4 w-4 opacity-90" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSellers}</div>
                <p className="text-xs opacity-80">Approved vendors</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Total Products</CardTitle>
                <BarChart3 className="h-4 w-4 opacity-90" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-xs opacity-80">Listed items</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Carbon Saved</CardTitle>
                <Leaf className="h-4 w-4 opacity-90" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCarbonSaved.toFixed(1)}kg</div>
                <p className="text-xs opacity-80">CO2 reduction</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="buyers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="buyers">Buyers</TabsTrigger>
              <TabsTrigger value="sellers">Sellers</TabsTrigger>
              <TabsTrigger value="products">Product Oversight</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="buyers">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Buyer Management</span>
                  </CardTitle>
                  <CardDescription>Approve or remove buyer accounts</CardDescription>
                </CardHeader>
                <CardContent>{renderUserTable(buyers, 'No buyers yet.')}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sellers">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                    <span>Seller Management</span>
                  </CardTitle>
                  <CardDescription>Approve or remove seller accounts</CardDescription>
                </CardHeader>
                <CardContent>{renderUserTable(sellers, 'No sellers yet.')}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span>Product Oversight</span>
                  </CardTitle>
                  <CardDescription>Monitor all products and their eco-compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Eco Rating</TableHead>
                        <TableHead>Carbon Footprint</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => {
                        const highCarbon = (product.carbonFootprint ?? 0) >= 8;
                        return (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.category?.replace('_', ' ')}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-green-600">{product.ecoRating}</span>
                                <Leaf className="h-4 w-4 text-green-600" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`font-semibold ${highCarbon ? 'text-red-600' : 'text-green-600'}`}>
                                {product.carbonFootprint}kg CO2 {highCarbon && '⚠'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => handleDeleteProduct(product.id)}>
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-pink-600" />
                      <span>Carbon Impact Analytics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                        <span className="font-medium">Total CO2 Reduction</span>
                        <span className="text-2xl font-bold text-green-600">{totalCarbonSaved.toFixed(1)}kg</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                        <span className="font-medium">Avg Product Eco Rating</span>
                        <span className="text-2xl font-bold text-blue-600">{avgEcoRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}