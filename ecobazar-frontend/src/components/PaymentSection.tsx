import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Shield, Truck, Leaf, CheckCircle } from 'lucide-react';
import { Product } from '@/lib/auth';
import { toast } from 'sonner';

interface PaymentSectionProps {
  cartItems: Product[];
  onPaymentComplete?: () => void;
}

export default function PaymentSection({ cartItems, onPaymentComplete }: PaymentSectionProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingName, setBillingName] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const ecoDiscount = subtotal * 0.1; // 10% eco-friendly discount
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal - ecoDiscount + shipping;
  const totalCarbonSaved = cartItems.reduce((acc, item) => acc + (10 - item.carbonFootprint), 0);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success('Payment successful! Your eco-friendly order is confirmed.');
    setIsProcessing(false);
    
    if (onPaymentComplete) {
      onPaymentComplete();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-pink-50 to-blue-50 rounded-lg">
        <div className="text-gray-500 text-lg">Your cart is empty</div>
        <p className="text-gray-400 mt-2">Add some eco-friendly products to get started!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 relative overflow-hidden p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-pink-300 to-blue-300 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-5 animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Complete Your Eco-Friendly Purchase
          </h1>
          <p className="text-gray-600 text-lg">Making a positive impact with every purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Leaf className="h-5 w-5 text-green-600" />
                <span>Order Summary</span>
              </CardTitle>
              <CardDescription>Review your eco-friendly items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">Eco Rating: {item.ecoRating}/10</p>
                    <p className="text-sm text-green-600">Saves {(10 - item.carbonFootprint).toFixed(1)}kg CO2</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${item.price}</p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Eco-Friendly Discount (10%)</span>
                  <span>-${ecoDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">Environmental Impact</span>
                </div>
                <p className="text-green-700">
                  This order will save approximately <strong>{totalCarbonSaved.toFixed(1)}kg of CO2</strong> compared to conventional alternatives!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span>Payment Information</span>
              </CardTitle>
              <CardDescription>Secure checkout with SSL encryption</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="apple">Apple Pay</SelectItem>
                      <SelectItem value="google">Google Pay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === 'card' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="billingName">Cardholder Name</Label>
                      <Input
                        id="billingName"
                        placeholder="John Doe"
                        value={billingName}
                        onChange={(e) => setBillingName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>Free carbon-neutral shipping on orders over $50</span>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Complete Purchase - ${total.toFixed(2)}</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}