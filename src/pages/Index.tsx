
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, ArrowRight } from "lucide-react";

const Index = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Organic Avocados",
      category: "Fresh",
      origin: "Spain",
      price: "€2.50/kg",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop",
      availability: "In Stock"
    },
    {
      id: 2,
      name: "Fresh Strawberries",
      category: "Fresh",
      origin: "Netherlands",
      price: "€4.20/kg",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop",
      availability: "In Stock"
    },
    {
      id: 3,
      name: "Frozen Berries Mix",
      category: "Frozen",
      origin: "Germany",
      price: "€3.80/kg",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
      availability: "Limited"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CC</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Crop Catch
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/products" className="text-gray-700 hover:text-green-600 transition-colors">
                Products
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-green-600 transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative p-2 hover:bg-green-50 rounded-lg transition-colors">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
              <Link to="/auth">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Fresh & Frozen
            <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Fruits & Vegetables
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Premium quality produce delivered across Europe, East Asia, and America. 
            Request custom quotes for bulk orders and enjoy competitive pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Browse Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/rfq">
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                Request Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium fresh and frozen produce from trusted suppliers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-green-100">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.availability === 'In Stock' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.availability}
                  </span>
                </div>
                <CardDescription>
                  {product.category} • Origin: {product.origin}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">{product.price}</span>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/60 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Crop Catch?</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              </div>
              <h4 className="text-lg font-semibold mb-2">Premium Quality</h4>
              <p className="text-gray-600">Hand-selected fresh and frozen produce from certified suppliers</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              </div>
              <h4 className="text-lg font-semibold mb-2">Custom Quotes</h4>
              <p className="text-gray-600">Request personalized pricing for bulk orders within 24 hours</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
              </div>
              <h4 className="text-lg font-semibold mb-2">Global Shipping</h4>
              <p className="text-gray-600">Reliable delivery across Europe, East Asia, and America</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
              </div>
              <h4 className="text-lg font-semibold mb-2">Order Tracking</h4>
              <p className="text-gray-600">Real-time updates from processing to delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">CC</span>
                </div>
                <span className="text-xl font-bold">Crop Catch</span>
              </div>
              <p className="text-gray-400">
                Premium fresh and frozen produce delivered worldwide with competitive pricing.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Products</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/products" className="hover:text-white transition-colors">Fresh Fruits</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Fresh Vegetables</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Frozen Products</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/rfq" className="hover:text-white transition-colors">Request Quote</Link></li>
                <li><Link to="/tracking" className="hover:text-white transition-colors">Order Tracking</Link></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Customer Support</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Crop Catch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
