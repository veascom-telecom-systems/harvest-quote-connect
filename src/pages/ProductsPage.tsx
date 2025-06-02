
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart } from "lucide-react";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedOrigin, setSelectedOrigin] = useState("All");

  const products = [
    {
      id: 1,
      name: "Organic Avocados",
      category: "Fresh",
      origin: "Spain",
      price: "€2.50/kg",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop",
      availability: "In Stock",
      description: "Premium quality organic avocados, perfect for healthy meals",
      rating: 4.8
    },
    {
      id: 2,
      name: "Fresh Strawberries",
      category: "Fresh",
      origin: "Netherlands",
      price: "€4.20/kg",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop",
      availability: "In Stock",
      description: "Sweet and juicy strawberries, freshly harvested",
      rating: 4.9
    },
    {
      id: 3,
      name: "Frozen Berries Mix",
      category: "Frozen",
      origin: "Germany",
      price: "€3.80/kg",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
      availability: "Limited",
      description: "Mix of frozen blueberries, raspberries, and blackberries",
      rating: 4.7
    },
    {
      id: 4,
      name: "Organic Carrots",
      category: "Fresh",
      origin: "France",
      price: "€1.80/kg",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop",
      availability: "In Stock",
      description: "Fresh organic carrots, perfect for cooking and snacking",
      rating: 4.6
    },
    {
      id: 5,
      name: "Frozen Spinach",
      category: "Frozen",
      origin: "Italy",
      price: "€2.90/kg",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop",
      availability: "In Stock",
      description: "Premium frozen spinach, rich in nutrients",
      rating: 4.5
    },
    {
      id: 6,
      name: "Bell Peppers",
      category: "Fresh",
      origin: "Netherlands",
      price: "€3.20/kg",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
      availability: "In Stock",
      description: "Colorful mix of fresh bell peppers",
      rating: 4.4
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesOrigin = selectedOrigin === "All" || product.origin === selectedOrigin;
    return matchesSearch && matchesCategory && matchesOrigin;
  });

  const categories = ["All", "Fresh", "Frozen"];
  const origins = ["All", "Spain", "Netherlands", "Germany", "France", "Italy"];

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Product Catalog
          </h1>
          <p className="text-gray-600 mt-2">Browse our selection of fresh and frozen produce</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-green-100">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Products</Label>
              <Input
                id="search"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="origin">Origin</Label>
              <select
                id="origin"
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              >
                {origins.map(origin => (
                  <option key={origin} value={origin}>{origin}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
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
                <StarRating rating={product.rating} />
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">{product.price}</span>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
                <Button variant="outline" className="w-full mt-2 border-green-600 text-green-600 hover:bg-green-50">
                  View Reviews
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
