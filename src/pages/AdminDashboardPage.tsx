import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useAdminRFQs, useUpdateRFQStatus } from "@/hooks/useAdminRFQs";
import { useAdminOrders, useUpdateOrder } from "@/hooks/useOrders";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useSecurityAlerts, useActivityLogs, useSecurityStats } from "@/hooks/useSecurity";
import { ProductForm } from "@/components/admin/ProductForm";
import { RFQDialog } from "@/components/admin/RFQDialog";
import { OverviewTab } from "@/components/admin/OverviewTab";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { RFQsTab } from "@/components/admin/RFQsTab";
import { OrdersTab } from "@/components/admin/OrdersTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { SettingsTab } from "@/components/admin/SettingsTab";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, Settings, Shield, Activity, Bell, Database,
  HardDrive, FileText, AlertTriangle
} from "lucide-react";

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<any>(null);
  const [showRFQDialog, setShowRFQDialog] = useState(false);

  const { toast } = useToast();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: products = [], isLoading: productsLoading } = useAdminProducts();
  const { data: rfqs = [], isLoading: rfqsLoading } = useAdminRFQs();
  const { data: orders = [], isLoading: ordersLoading } = useAdminOrders();

  // Security data
  const { data: securityAlerts = [], isLoading: securityAlertsLoading } = useSecurityAlerts();
  const { data: activityLogs = [], isLoading: activityLogsLoading } = useActivityLogs();
  const { data: securityStats, isLoading: securityStatsLoading } = useSecurityStats();
  
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateRFQStatus = useUpdateRFQStatus();
  const updateOrder = useUpdateOrder();

  // AdminGuard handles all authentication and authorization checks

  const handleProductSubmit = async (productData: any) => {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, updates: productData });
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await createProduct.mutateAsync(productData);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct.mutateAsync(id);
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive"
        });
      }
    }
  };

  const handleRFQUpdate = async (id: string, status: string, quotedPrice?: number, adminNotes?: string) => {
    try {
      await updateRFQStatus.mutateAsync({ id, status, quotedPrice, adminNotes });
      setShowRFQDialog(false);
      setSelectedRFQ(null);
      toast({
        title: "Success",
        description: "RFQ updated successfully",
      });
    } catch (error) {
      console.error('Error updating RFQ:', error);
      toast({
        title: "Error",
        description: "Failed to update RFQ",
        variant: "destructive"
      });
    }
  };

  const handleOrderStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateOrder.mutateAsync({ id, updates: { order_status: newStatus } });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <div className="text-sm text-gray-600">
              Welcome, {user?.email} | Role: Admin
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-4">
            <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="products" onClick={() => setActiveTab("products")}>
              <Database className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" onClick={() => setActiveTab("orders")}>
              <FileText className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="rfqs" onClick={() => setActiveTab("rfqs")}>
              <FileText className="w-4 h-4 mr-2" />
              RFQs
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="system">
              <HardDrive className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab
              stats={stats}
              statsLoading={statsLoading}
              rfqs={rfqs}
              rfqsLoading={rfqsLoading}
              orders={orders}
              ordersLoading={ordersLoading}
            />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab />
          </TabsContent>

          <TabsContent value="products">
            <ProductsTab
              products={products}
              productsLoading={productsLoading}
              onAddProduct={() => setShowProductForm(true)}
              onEditProduct={(product) => {
                setEditingProduct(product);
                setShowProductForm(true);
              }}
              onDeleteProduct={handleDeleteProduct}
              deleteProductPending={deleteProduct.isPending}
            />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab
              orders={orders}
              ordersLoading={ordersLoading}
              onUpdateOrderStatus={handleOrderStatusUpdate}
            />
          </TabsContent>

          <TabsContent value="rfqs">
            <RFQsTab
              rfqs={rfqs}
              rfqsLoading={rfqsLoading}
              onManageRFQ={(rfq) => {
                setSelectedRFQ(rfq);
                setShowRFQDialog(true);
              }}
            />
          </TabsContent>

          <TabsContent value="security">
            <div className="grid gap-6">
              {/* Security Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {securityStatsLoading ? '...' : `${securityStats?.securityScore || 85}%`}
                    </div>
                    <p className="text-xs text-muted-foreground">System security rating</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {securityStatsLoading ? '...' : securityStats?.adminUsers || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Active administrators</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {securityStatsLoading ? '...' : securityStats?.recentOrders || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Last 24 hours</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending RFQs</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {securityStatsLoading ? '...' : securityStats?.pendingRFQs || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Awaiting review</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/80 backdrop-blur-sm border-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                    Security Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {securityAlertsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {securityAlerts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Shield className="w-12 h-12 mx-auto mb-4 text-green-500" />
                          <p>No security alerts at this time</p>
                          <p className="text-sm">System is operating normally</p>
                        </div>
                      ) : (
                        securityAlerts.map((alert) => (
                          <div
                            key={alert.id}
                            className={`p-4 rounded-lg ${
                              alert.level === 'high'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : alert.level === 'medium'
                                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-semibold">{alert.message}</span>
                                <div className="text-sm opacity-75 mt-1">Type: {alert.type}</div>
                              </div>
                              <span className="text-sm">{new Date(alert.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activityLogsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activityLogs.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p>No recent activity</p>
                        </div>
                      ) : (
                        activityLogs.map((activity) => (
                          <div key={activity.id} className="flex items-center justify-between border-b pb-2">
                            <div>
                              <p className="font-medium">{activity.action}</p>
                              <p className="text-sm text-gray-500">{activity.user}</p>
                              <p className="text-xs text-gray-400">{activity.details}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">{activity.ip}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                activity.type === 'order'
                                  ? 'bg-green-100 text-green-800'
                                  : activity.type === 'rfq'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {activity.type}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-green-100">
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries({
                      cpu: 45,
                      memory: 62,
                      disk: 78,
                      network: 92
                    }).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="capitalize">{key}</span>
                          <span>{value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              value > 90
                                ? 'bg-red-500'
                                : value > 70
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-green-100">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { time: '00:00', value: 30 },
                          { time: '04:00', value: 25 },
                          { time: '08:00', value: 40 },
                          { time: '12:00', value: 65 },
                          { time: '16:00', value: 55 },
                          { time: '20:00', value: 45 },
                          { time: '24:00', value: 35 }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#22c55e" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleProductSubmit}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          isLoading={createProduct.isPending || updateProduct.isPending}
        />
      )}

      <RFQDialog
        rfq={selectedRFQ}
        open={showRFQDialog}
        onClose={() => {
          setShowRFQDialog(false);
          setSelectedRFQ(null);
        }}
        onUpdate={handleRFQUpdate}
        isLoading={updateRFQStatus.isPending}
      />
    </div>
  );
};

export default AdminDashboardPage;
