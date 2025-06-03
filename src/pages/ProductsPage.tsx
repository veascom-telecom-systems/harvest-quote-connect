
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { ProductsDebugInfo } from "@/components/debug/ProductsDebugInfo";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedOrigin, setSelectedOrigin] = useState("All");
  
  const { data: products = [], isLoading, error, isError, isFetching } = useProducts();
  const { addItem } = useCart();

  // Debug logging
  console.log('ProductsPage: isLoading:', isLoading, 'isError:', isError, 'isFetching:', isFetching);
  console.log('ProductsPage: products count:', products?.length || 0);
  console.log('ProductsPage: error:', error);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesOrigin = selectedOrigin === "All" || product.country_of_origin === selectedOrigin;
    return matchesSearch && matchesCategory && matchesOrigin;
  });

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const origins = ["All", ...Array.from(new Set(products.map(p => p.country_of_origin).filter(Boolean)))];

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

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image_url: product.image_url,
    });
  };

  if (isLoading && !products.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
          <p className="mt-2 text-sm text-gray-500">
            {isFetching ? 'Fetching data...' : 'Initializing...'}
          </p>
        </div>
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 text-lg font-semibold mb-2">Error loading products</p>
          <p className="text-gray-600 mb-4">
            {error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
                  src={product.image_url || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop'} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.availability && product.stock > 0
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.availability && product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <CardDescription>
                  {product.category} • Origin: {product.country_of_origin}
                </CardDescription>
                <StarRating rating={4.5} />
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">€{product.price}/{product.unit}</span>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.availability || product.stock <= 0}
                  >
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

        {filteredProducts.length === 0 && products.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}

        {products.length === 0 && !isLoading && !isError && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products available at the moment.</p>
            <p className="text-gray-500 mt-2">Please check back later for new products.</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              Refresh
            </Button>
          </div>
        )}
      </div>

      {/* Debug Component - only in development */}
      {process.env.NODE_ENV === 'development' && <ProductsDebugInfo />}
    </div>
  );
};

export default ProductsPage;
