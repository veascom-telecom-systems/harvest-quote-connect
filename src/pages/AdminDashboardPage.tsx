
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const dashboardStats = {
    totalOrders: 145,
    pendingRFQs: 23,
    totalRevenue: "€45,230",
    activeProducts: 89
  };

  const recentRFQs = [
    {
      id: "RFQ-001",
      company: "Fresh Foods Inc.",
      contact: "John Doe",
      items: 5,
      estimatedValue: "€234.60",
      status: "Pending",
      date: "2024-02-08"
    },
    {
      id: "RFQ-002", 
      company: "Green Market Ltd.",
      contact: "Jane Smith",
      items: 3,
      estimatedValue: "€156.20",
      status: "Quoted",
      date: "2024-02-07"
    },
    {
      id: "RFQ-003",
      company: "Organic Supplies Co.",
      contact: "Mike Johnson",
      items: 8,
      estimatedValue: "€412.80",
      status: "Accepted",
      date: "2024-02-06"
    }
  ];

  const products = [
    {
      id: 1,
      name: "Organic Avocados",
      category: "Fresh",
      origin: "Spain",
      price: "€2.50/kg",
      stock: "In Stock",
      sales: 45
    },
    {
      id: 2,
      name: "Fresh Strawberries",
      category: "Fresh",
      origin: "Netherlands",
      price: "€4.20/kg",
      stock: "Low Stock",
      sales: 32
    },
    {
      id: 3,
      name: "Frozen Berries Mix",
      category: "Frozen",
      origin: "Germany",
      price: "€3.80/kg",
      stock: "In Stock",
      sales: 28
    }
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Fresh Foods Inc.",
      items: 3,
      total: "€145.60",
      status: "Processing",
      date: "2024-02-08"
    },
    {
      id: "ORD-002",
      customer: "Green Market Ltd.",
      items: 2,
      total: "€89.40",
      status: "Shipped",
      date: "2024-02-07"
    },
    {
      id: "ORD-003",
      customer: "Organic Supplies Co.",
      items: 5,
      total: "€234.80",
      status: "Delivered",
      date: "2024-02-06"
    }
  ];

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
                      <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalOrders}</p>
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
                      <p className="text-3xl font-bold text-gray-900">{dashboardStats.pendingRFQs}</p>
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
                      <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalRevenue}</p>
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
                      <p className="text-3xl font-bold text-gray-900">{dashboardStats.activeProducts}</p>
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
                    {recentRFQs.slice(0, 3).map((rfq) => (
                      <div key={rfq.id} className="border border-gray-100 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{rfq.id}</p>
                            <p className="text-sm text-gray-600">{rfq.company}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rfq.status === 'Pending' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : rfq.status === 'Quoted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {rfq.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{rfq.items} items</span>
                          <span className="font-semibold">{rfq.estimatedValue}</span>
                        </div>
                      </div>
                    ))}
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
                    {recentOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{order.id}</p>
                            <p className="text-sm text-gray-600">{order.customer}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Processing' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
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
              <Button className="bg-green-600 hover:bg-green-700">
                Add Product
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.origin}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock === 'In Stock' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RFQ ID</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Estimated Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRFQs.map((rfq) => (
                    <TableRow key={rfq.id}>
                      <TableCell className="font-medium">{rfq.id}</TableCell>
                      <TableCell>{rfq.company}</TableCell>
                      <TableCell>{rfq.contact}</TableCell>
                      <TableCell>{rfq.items}</TableCell>
                      <TableCell>{rfq.estimatedValue}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rfq.status === 'Pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : rfq.status === 'Quoted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {rfq.status}
                        </span>
                      </TableCell>
                      <TableCell>{rfq.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Quote</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Processing' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
