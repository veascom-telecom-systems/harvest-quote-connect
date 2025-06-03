
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

const CartPage = () => {
  const { items: cartItems, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();

  const totalValue = getTotalPrice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link to="/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            {cartItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 border-red-600"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear Cart
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-green-100">
            <CardContent>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Start adding some fresh produce to your cart!</p>
              <Link to="/products">
                <Button className="bg-green-600 hover:bg-green-700">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="bg-white/80 backdrop-blur-sm border-green-100">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image_url || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-green-600 font-semibold">€{item.price.toFixed(2)}/{item.unit}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                          min="0"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 0)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="bg-white/80 backdrop-blur-sm border-green-100 sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Items ({cartItems.length})</span>
                    <span>€{totalValue.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Estimated Total</span>
                      <span className="text-green-600">€{totalValue.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      *Final pricing will be provided in your custom quote
                    </p>
                  </div>

                  <Link to="/rfq" className="block w-full">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Request Quote
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Why Request a Quote?</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Custom pricing for bulk orders</li>
                      <li>• Personalized shipping options</li>
                      <li>• 24-hour response guarantee</li>
                      <li>• No commitment until you accept</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
