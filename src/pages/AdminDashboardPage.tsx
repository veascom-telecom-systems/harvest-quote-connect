
import { useState } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useAdminRFQs, useUpdateRFQStatus } from "@/hooks/useAdminRFQs";
import { useAdminOrders, useUpdateOrder } from "@/hooks/useOrders";
import { useAdminStats } from "@/hooks/useAdminStats";
import { ProductForm } from "@/components/admin/ProductForm";
import { RFQDialog } from "@/components/admin/RFQDialog";
import { OverviewTab } from "@/components/admin/OverviewTab";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { RFQsTab } from "@/components/admin/RFQsTab";
import { OrdersTab } from "@/components/admin/OrdersTab";
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
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage products, orders, and RFQs</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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

        {activeTab === "overview" && (
          <OverviewTab
            stats={stats}
            statsLoading={statsLoading}
            rfqs={rfqs}
            rfqsLoading={rfqsLoading}
            orders={orders}
            ordersLoading={ordersLoading}
          />
        )}

        {activeTab === "products" && (
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
        )}

        {activeTab === "rfqs" && (
          <RFQsTab
            rfqs={rfqs}
            rfqsLoading={rfqsLoading}
            onManageRFQ={(rfq) => {
              setSelectedRFQ(rfq);
              setShowRFQDialog(true);
            }}
          />
        )}

        {activeTab === "orders" && (
          <OrdersTab
            orders={orders}
            ordersLoading={ordersLoading}
            onUpdateOrderStatus={handleOrderStatusUpdate}
          />
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
