import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, ShoppingCart, Users, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShoppingCart className="h-8 w-8 text-green-600" />,
      title: "Eco-Friendly Marketplace",
      description: "Discover sustainable products that make a positive environmental impact"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Multi-Role System",
      description: "Admin, Seller, and Buyer roles with specialized dashboards and features"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Carbon Footprint Tracking",
      description: "Monitor and reduce your environmental impact with detailed analytics"
    }
  ];

  const benefits = [
    "Browse eco-friendly products with sustainability ratings",
    "Track carbon footprint reduction for every purchase",
    "Seller management with eco-compliance monitoring",
    "Admin oversight with comprehensive analytics",
    "Secure payment processing with eco-discounts",
    "Real-time environmental impact calculations"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-300 to-blue-300 rounded-full opacity-10 animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Leaf className="h-12 w-12 text-green-600 animate-bounce" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              EcoBazar
            </h1>
          </div>
          <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Your Sustainable Marketplace for Eco-Friendly Products
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Join the green revolution! Shop sustainable products, track your environmental impact, 
            and make a positive difference with every purchase.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/login')}
              className="h-14 px-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Start Shopping
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              variant="outline"
              className="h-14 px-8 border-2 border-purple-300 hover:bg-purple-50 text-purple-700 font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              <Users className="h-5 w-5 mr-2" />
              Join as Seller
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Why Choose EcoBazar?
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          
          <Card className="bg-gradient-to-br from-green-100 to-blue-100 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <Leaf className="h-6 w-6 text-green-600 mr-2" />
                Environmental Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">2,500kg</div>
                  <p className="text-gray-600">CO2 Saved by Our Community</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                  <p className="text-gray-600">Eco-Friendly Products</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">5,000+</div>
                  <p className="text-gray-600">Happy Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of eco-conscious shoppers and sellers making the world more sustainable
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/signup')}
              className="h-12 px-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Get Started Today
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="h-12 px-8 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold transition-all duration-300"
            >
              Already Have Account?
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}