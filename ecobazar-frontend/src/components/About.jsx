import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, ShieldCheck, TrendingUp, Users, ArrowLeft, Globe } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col">
      
      {/* Top Navbar Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-10 w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            EcoBazar
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>

      {/* Main Content - Centered with consistent vertical spacing */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 space-y-8 mb-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 py-4">
          <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full text-green-600 shadow-sm">
            <Leaf className="h-10 w-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
            About EcoBazar
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Empowering sustainable shopping through carbon transparency, eco-friendly ratings, and conscious consumer choices.
          </p>
        </div>

        {/* Mission Card */}
        <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 sm:p-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center space-x-3">
              <Globe className="h-7 w-7 text-green-600" />
              <span>Our Mission</span>
            </h2>
            <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
              EcoBazar was built to bridge the gap between everyday convenience and environmental responsibility. 
              We believe that every purchase should tell a story—one that respects our planet, reduces carbon footprints, 
              and supports sustainable alternatives ranging from biodegradable personal care items to energy-efficient technologies.
            </p>
          </CardContent>
        </Card>

        {/* Core Pillars Stack */}
        <div className="space-y-6">
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl rounded-3xl">
            <CardContent className="p-8 sm:p-9 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="p-4 bg-green-50 rounded-2xl text-green-600 shrink-0 shadow-sm">
                <Leaf className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Carbon Transparency</h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Every product lists its estimated CO₂ impact so you can clearly see and compare your environmental footprint.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl rounded-3xl">
            <CardContent className="p-8 sm:p-9 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shrink-0 shadow-sm">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Eco Ratings</h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Products are rated on a 1-10 sustainability scale evaluated across materials, packaging, and lifecycle impact.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl rounded-3xl">
            <CardContent className="p-8 sm:p-9 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="p-4 bg-purple-50 rounded-2xl text-purple-600 shrink-0 shadow-sm">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Community Impact</h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Connecting conscious buyers with dedicated green sellers to scale sustainable commerce worldwide.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Developer Story - Added balanced space with the outer container mb-12 */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 sm:p-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center space-x-3">
              <Users className="h-7 w-7" />
              <span>Built with Passion</span>
            </h2>
            <p className="opacity-95 text-lg sm:text-xl leading-relaxed">
              Developed as a full-stack sustainable e-commerce platform using React, Spring Boot, and MySQL. 
              EcoBazar demonstrates how modern web technologies can champion ecological awareness and seamless role-based order management.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}