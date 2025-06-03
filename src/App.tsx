
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminGuard } from "@/components/auth/AdminGuard";
import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import RFQPage from "./pages/RFQPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={
                <ProtectedRoute requireAuth={false}>
                  <AuthPage />
                </ProtectedRoute>
              } />
              <Route path="/*" element={
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/cart" element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/rfq" element={
                      <ProtectedRoute>
                        <RFQPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <AdminGuard>
                          <AdminDashboardPage />
                        </AdminGuard>
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
