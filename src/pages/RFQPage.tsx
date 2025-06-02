
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const RFQPage = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    deliveryAddress: "",
    country: "",
    preferredDeliveryDate: "",
    specialRequirements: "",
    urgency: "standard"
  });

  const { toast } = useToast();

  const cartItems = [
    {
      id: 1,
      name: "Organic Avocados",
      quantity: 5,
      unit: "kg",
      estimatedPrice: 12.50
    },
    {
      id: 2,
      name: "Fresh Strawberries",
      quantity: 3,
      unit: "kg",
      estimatedPrice: 12.60
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Placeholder for RFQ submission
    toast({
      title: "Quote Request Submitted!",
      description: "We'll review your request and respond within 24 hours.",
    });
  };

  const totalEstimatedValue = cartItems.reduce((sum, item) => sum + item.estimatedPrice, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Cart
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Request for Quotation
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* RFQ Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardHeader>
                <CardTitle>Quote Request Details</CardTitle>
                <CardDescription>
                  Please provide your information to receive a customized quote within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input
                          id="contactPerson"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Delivery Information</h3>
                    
                    <div>
                      <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                      <textarea
                        id="deliveryAddress"
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background min-h-20"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                          required
                        >
                          <option value="">Select Country</option>
                          <option value="germany">Germany</option>
                          <option value="france">France</option>
                          <option value="spain">Spain</option>
                          <option value="italy">Italy</option>
                          <option value="netherlands">Netherlands</option>
                          <option value="uk">United Kingdom</option>
                          <option value="usa">United States</option>
                          <option value="japan">Japan</option>
                          <option value="china">China</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="preferredDeliveryDate">Preferred Delivery Date</Label>
                        <Input
                          id="preferredDeliveryDate"
                          name="preferredDeliveryDate"
                          type="date"
                          value={formData.preferredDeliveryDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Requirements */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Additional Requirements</h3>
                    
                    <div>
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <select
                        id="urgency"
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                      >
                        <option value="standard">Standard (7-10 days)</option>
                        <option value="urgent">Urgent (3-5 days)</option>
                        <option value="express">Express (1-2 days)</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="specialRequirements">Special Requirements</Label>
                      <textarea
                        id="specialRequirements"
                        name="specialRequirements"
                        value={formData.specialRequirements}
                        onChange={handleInputChange}
                        placeholder="Any special packaging, certifications, or handling requirements..."
                        className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background min-h-20"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    Submit Quote Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-green-100 sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.quantity} {item.unit}</p>
                    </div>
                    <p className="font-semibold">€{item.estimatedPrice.toFixed(2)}</p>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Estimated Total</span>
                    <span className="text-green-600">€{totalEstimatedValue.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    *This is an estimate. Final pricing will be provided in your custom quote.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>1. We review your request</li>
                    <li>2. Custom quote prepared</li>
                    <li>3. Quote sent within 24 hours</li>
                    <li>4. You accept or negotiate</li>
                    <li>5. Payment & shipping arranged</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFQPage;
