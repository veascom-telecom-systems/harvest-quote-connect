
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: ""
  });

  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error);
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive"
          });
        } else if (profile) {
          const fullName = profile.full_name || '';
          const [firstName = '', lastName = ''] = fullName.split(' ');

          setProfileData({
            firstName,
            lastName,
            email: user.email || '',
            company: user.user_metadata?.company || '',
            phone: '',
            address: '',
            city: '',
            country: '',
            postalCode: ''
          });
        } else {
          // No profile found, use user data
          setProfileData({
            firstName: user.user_metadata?.full_name?.split(' ')[0] || '',
            lastName: user.user_metadata?.full_name?.split(' ')[1] || '',
            email: user.email || '',
            company: user.user_metadata?.company || '',
            phone: '',
            address: '',
            city: '',
            country: '',
            postalCode: ''
          });
        }
      } catch (error) {
        console.error('Unexpected error loading profile:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: `${profileData.firstName} ${profileData.lastName}`.trim(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const orderHistory = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "Delivered",
      total: "€145.60",
      items: 3
    },
    {
      id: "ORD-002",
      date: "2024-01-28",
      status: "In Transit",
      total: "€89.40",
      items: 2
    },
    {
      id: "ORD-003",
      date: "2024-02-05",
      status: "Processing",
      total: "€234.80",
      items: 5
    }
  ];

  // Show loading while fetching profile data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
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
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                  className={isEditing ? "" : "bg-green-600 hover:bg-green-700"}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={profileData.company}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={profileData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={profileData.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={profileData.postalCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-4">
                    <Button 
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Account Summary & Order History */}
          <div className="space-y-6">
            {/* Account Summary */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">Jan 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="font-semibold text-green-600">€1,247.30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Verified
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your last 3 orders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderHistory.map((order) => (
                  <div key={order.id} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{order.items} items</span>
                      <span className="font-semibold">{order.total}</span>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                  View All Orders
                </Button>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full border-red-600 text-red-600 hover:bg-red-50"
                  onClick={async () => {
                    try {
                      await signOut();
                      window.location.href = "/";
                    } catch (error) {
                      console.error('Sign out error:', error);
                    }
                  }}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
