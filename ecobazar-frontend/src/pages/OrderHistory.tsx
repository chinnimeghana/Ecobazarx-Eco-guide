import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, ArrowLeft, Package } from 'lucide-react';
import { authService } from '@/lib/auth';

interface OrderItemView {
  id: number;
  quantity: number;
  price: number;
  product: { id: number; name: string; imageUrl: string | null };
}
interface OrderView {
  id: number;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  orderItems: OrderItemView[];
  createdAt: string;
}

export default function OrderHistory() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [orders, setOrders] = useState<OrderView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetch(`http://localhost:8082/api/orders/buyer/${user.id}`, {
      headers: { ...authService.getAuthHeaders() },
    })
      .then(res => res.json())
      .then(setOrders)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <div className="p-6">Loading your orders...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Leaf className="h-8 w-8 text-green-600" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Order History
          </h1>
        </div>

        {orders.length === 0 ? (
          <Card className="bg-white/90">
            <CardContent className="pt-6 text-center text-gray-500">
              You haven't placed any orders yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id} className="bg-white/90">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-4 w-4 text-green-600" />
                    Order #{order.id}
                  </CardTitle>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {order.status}
                  </span>
                </CardHeader>
                <CardContent className="space-y-2">
                  {order.orderItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.product?.name ?? 'Product'} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 pt-1">
                    Shipped to: {order.shippingAddress} • {order.paymentMethod}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Button variant="outline" className="mt-6" onClick={() => navigate('/buyer-dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shopping
        </Button>
      </div>
    </div>
  );
}