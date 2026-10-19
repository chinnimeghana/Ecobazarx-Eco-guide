import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/lib/CartContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
  const { cart, placeOrder, placingOrder } = useCart();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardPin, setCardPin] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedSummary, setPlacedSummary] = useState<{ total: number; items: number } | null>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantityInCart, 0);

  const handleConfirm = async () => {
    if (!shippingAddress.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }
    if (paymentMethod === 'UPI' && !upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID');
      return;
    }
    if (paymentMethod === 'CARD') {
      if (cardNumber.replace(/\s/g, '').length < 12) {
        toast.error('Please enter a valid card number');
        return;
      }
      if (cardPin.length < 4) {
        toast.error('Please enter your card PIN');
        return;
      }
      // Note: card number/PIN are never sent to the backend — collected here only
      // to complete the UI flow. A real payment integration (Stripe/Razorpay) would
      // replace this with a secure, PCI-compliant payment form.
    }

    try {
      setPlacedSummary({ total, items: cart.length });
      await placeOrder(shippingAddress, paymentMethod);
      setOrderPlaced(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to place order');
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-gray-600">Your cart is empty.</p>
            <Button onClick={() => navigate('/buyer-dashboard')}>Back to Shopping</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
        <Card className="max-w-md w-full bg-white/90">
          <CardContent className="pt-10 pb-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">Order Placed Successfully!</h2>
            <div className="text-left bg-gray-50 rounded-lg p-4 space-y-1 text-sm">
              <p><span className="font-medium">Items:</span> {placedSummary?.items}</p>
              <p><span className="font-medium">Total:</span> ${placedSummary?.total.toFixed(2)}</p>
              <p><span className="font-medium">Shipping to:</span> {shippingAddress}</p>
              <p><span className="font-medium">Payment:</span> {paymentMethod === 'CARD' ? 'Card' : paymentMethod === 'UPI' ? 'UPI' : 'Cash on Delivery'}</p>
            </div>
            <Button className="w-full" onClick={() => navigate('/buyer-dashboard')}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Leaf className="h-8 w-8 text-green-600" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Checkout
          </h1>
        </div>

        <Card className="bg-white/90 mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantityInCart}</span>
                <span>${(item.price * item.quantityInCart).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Shipping & Payment</CardTitle>
            <CardDescription>Enter your details to complete the order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Shipping Address</Label>
              <Textarea
                placeholder="Enter your full shipping address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COD">Cash on Delivery</SelectItem>
                  <SelectItem value="CARD">Credit / Debit Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === 'CARD' && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="col-span-2 space-y-2">
                  <Label>Card Number</Label>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                  />
                </div>
                <div className="space-y-2">
                  <Label>PIN</Label>
                  <Input
                    type="password"
                    placeholder="****"
                    value={cardPin}
                    onChange={(e) => setCardPin(e.target.value)}
                    maxLength={6}
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'UPI' && (
              <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                <Label>UPI ID</Label>
                <Input
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600"
                disabled={placingOrder}
                onClick={handleConfirm}
              >
                {placingOrder ? 'Placing order...' : 'Confirm Order'}
              </Button>
              <Button variant="outline" onClick={() => navigate('/buyer-dashboard')}>
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}