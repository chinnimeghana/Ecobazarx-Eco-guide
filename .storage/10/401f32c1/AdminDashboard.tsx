import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, ShoppingCart, BarChart3, Settings, CheckCircle, XCircle, Eye, Trash2, Leaf } from 'lucide-react';
import { mockUsers, mockProducts, authService } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [users] = useState(mockUsers);
  const [products] = useState(mockProducts);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const totalUsers = users.length;
  const activeSellers = users.filter(u => u.role === 'seller' && u.status === 'active').length;
  const totalProducts = products.length;
  const totalCarbonSaved = products.reduce((acc, p) => acc + (10 - p.carbonFootprint), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-pink-300 to-blue-300 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Leaf className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                EcoBazar Admin
              </h1>
              <p className="text-gray-600">Sustainable Marketplace Management</p>
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
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Users</CardTitle>
              <Users className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs opacity-80">Registered members</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Active Sellers</CardTitle>
              <ShoppingCart className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSellers}</div>
              <p className="text-xs opacity-80">Approved vendors</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Products</CardTitle>
              <BarChart3 className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs opacity-80">Listed items</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
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

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              User Management
            </TabsTrigger>
            <TabsTrigger value="sellers" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Seller Management
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              Product Oversight
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>User Management</span>
                </CardTitle>
                <CardDescription>Manage all registered users and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'seller' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : user.status === 'pending' ? 'secondary' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <XCircle className="h-4 w-4 text-red-600" />
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

          <TabsContent value="sellers">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  <span>Seller Management</span>
                </CardTitle>
                <CardDescription>Monitor and approve seller registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Seller Name</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Avg Eco Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.filter(u => u.role === 'seller').map((seller) => {
                      const sellerProducts = products.filter(p => p.sellerId === seller.id);
                      const avgRating = sellerProducts.length > 0 
                        ? sellerProducts.reduce((acc, p) => acc + p.ecoRating, 0) / sellerProducts.length 
                        : 0;
                      
                      return (
                        <TableRow key={seller.id}>
                          <TableCell className="font-medium">{seller.username}</TableCell>
                          <TableCell>{sellerProducts.length}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{avgRating.toFixed(1)}</span>
                              <Leaf className="h-4 w-4 text-green-600" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={seller.status === 'active' ? 'default' : 'secondary'}>
                              {seller.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
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
                      <TableHead>Seller</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Eco Rating</TableHead>
                      <TableHead>Carbon Footprint</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sellerName}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-green-600">{product.ecoRating}</span>
                            <Leaf className="h-4 w-4 text-green-600" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${product.carbonFootprint < 5 ? 'text-green-600' : 'text-orange-600'}`}>
                            {product.carbonFootprint}kg CO2
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
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
                      <span className="text-2xl font-bold text-blue-600">
                        {(products.reduce((acc, p) => acc + p.ecoRating, 0) / products.length).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    <span>System Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full justify-start" variant="outline">
                      Manage Product Categories
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      Configure Eco-Rating Rules
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      Set Promotional Banners
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      Generate Monthly Reports
                    </Button>
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