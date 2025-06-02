
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useAdminRFQs, useUpdateRFQStatus } from "@/hooks/useAdminRFQs";
import { useAdminOrders, useUpdateOrder } from "@/hooks/useOrders";
import { useAdminStats } from "@/hooks/useAdminStats";
import { ProductForm } from "@/components/admin/ProductForm";
import { RFQDialog } from "@/components/admin/RFQDialog";
import { useToast } from "@/hooks/use-toast";

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<any>(null);
  const [showRFQDialog, setShowRFQDialog] = useState(false);
  
  const { toast } = useToast();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: rfqs = [], isLoading: rfqsLoading } = useAdminRFQs();
  const { data: orders = [], isLoading: ordersLoading } = useAdminOrders();
  
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateRFQStatus = useUpdateRFQStatus();
  const updateOrder = useUpdateOrder();

  const handleProductSubmit = async (productData: any) => {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, updates: productData });
      } else {
        await createProduct.mutateAsync(productData);
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleRFQUpdate = async (id: string, status: string, quotedPrice?: number, adminNotes?: string) => {
    try {
      await updateRFQStatus.mutateAsync({ id, status, quotedPrice, adminNotes });
      setShowRFQDialog(false);
      setSelectedRFQ(null);
    } catch (error) {
      console.error('Error updating RFQ:', error);
    }
  };

  const handleOrderStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateOrder.mutateAsync({ id, updates: { order_status: newStatus } });
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (showProductForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8">
        <ProductForm
          product={editingProduct}
          onSubmit={handleProductSubmit}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          isLoading={createProduct.isPending || updateProduct.isPending}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage products, orders, and RFQs</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm rounded-lg">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview" },
                { id: "products", label: "Products" },
                { id: "rfqs", label: "RFQs" },
                { id: "orders", label: "Orders" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {statsLoading ? '...' : stats?.totalOrders}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending RFQs</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {statsLoading ? '...' : stats?.pendingRFQs}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {statsLoading ? '...' : stats?.totalRevenue}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Products</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {statsLoading ? '...' : stats?.activeProducts}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white/80 backdrop-blur-sm border-green-100">
                <CardHeader>
                  <CardTitle>Recent RFQs</CardTitle>
                  <CardDescription>Latest quote requests requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rfqsLoading ? (
                      <p>Loading...</p>
                    ) : (
                      rfqs.slice(0, 3).map((rfq) => (
                        <div key={rfq.id} className="border border-gray-100 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold">{rfq.id.slice(0, 8)}</p>
                              <p className="text-sm text-gray-600">{rfq.profiles?.full_name || 'Unknown'}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rfq.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : rfq.status === 'quoted'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {rfq.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{rfq.rfq_items?.length || 0} items</span>
                            <span className="font-semibold">€{rfq.quoted_price || 'TBD'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-green-100">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ordersLoading ? (
                      <p>Loading...</p>
                    ) : (
                      orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="border border-gray-100 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold">{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-gray-600">{order.profiles?.full_name || 'Unknown'}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.order_status === 'pending_payment' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.order_status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {order.order_status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{order.order_items?.length || 0} items</span>
                            <span className="font-semibold">€{order.total_amount}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <Card className="bg-white/80 backdrop-blur-sm border-green-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </div>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setShowProductForm(true)}
              >
                Add Product
              </Button>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <p>Loading products...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.country_of_origin}</TableCell>
                        <TableCell>€{product.price}/{product.unit}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.availability && product.stock > 0
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.availability && product.stock > 0 ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setEditingProduct(product);
                                setShowProductForm(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={deleteProduct.isPending}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* RFQs Tab */}
        {activeTab === "rfqs" && (
          <Card className="bg-white/80 backdrop-blur-sm border-green-100">
            <CardHeader>
              <CardTitle>Request for Quotations</CardTitle>
              <CardDescription>Manage customer quote requests</CardDescription>
            </CardHeader>
            <CardContent>
              {rfqsLoading ? (
                <p>Loading RFQs...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>RFQ ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Quoted Price</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rfqs.map((rfq) => (
                      <TableRow key={rfq.id}>
                        <TableCell className="font-medium">{rfq.id.slice(0, 8)}</TableCell>
                        <TableCell>{rfq.profiles?.full_name || 'Unknown'}</TableCell>
                        <TableCell>{rfq.rfq_items?.length || 0}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rfq.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : rfq.status === 'quoted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {rfq.status}
                          </span>
                        </TableCell>
                        <TableCell>€{rfq.quoted_price || 'TBD'}</TableCell>
                        <TableCell>{new Date(rfq.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedRFQ(rfq);
                              setShowRFQDialog(true);
                            }}
                          >
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <Card className="bg-white/80 backdrop-blur-sm border-green-100">
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Track and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <p>Loading orders...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                        <TableCell>{order.profiles?.full_name || 'Unknown'}</TableCell>
                        <TableCell>{order.order_items?.length || 0}</TableCell>
                        <TableCell>€{order.total_amount}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.order_status === 'pending_payment' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.order_status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : order.order_status === 'shipped'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {order.order_status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.payment_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {order.payment_status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <select 
                            value={order.order_status}
                            onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                            className="text-xs border rounded px-2 py-1"
                          >
                            <option value="pending_payment">Pending Payment</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>

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
