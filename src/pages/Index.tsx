
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Truck, Shield, Star } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
            Fresh Produce, Direct from Farm
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with premium suppliers and get the freshest fruits and vegetables delivered to your business. 
            Quality guaranteed, sustainability focused.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link to="/products">Browse Products</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/rfq">Request Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Crop Catch?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardHeader>
                <Leaf className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Farm Fresh Quality</CardTitle>
                <CardDescription>
                  Direct sourcing from verified farms ensures maximum freshness and quality for your business.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardHeader>
                <Truck className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Reliable Delivery</CardTitle>
                <CardDescription>
                  Temperature-controlled logistics and on-time delivery guarantee your produce arrives fresh.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardHeader>
                <Shield className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Quality Assurance</CardTitle>
                <CardDescription>
                  Rigorous quality checks and food safety standards ensure you receive only the best products.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-green-600">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of businesses already sourcing premium produce through Crop Catch.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/auth">Sign Up Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
