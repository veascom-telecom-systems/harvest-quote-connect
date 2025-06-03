
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Plus } from 'lucide-react';
import { ProductFilters } from './ProductFilters';
import { ProductTable } from './ProductTable';

interface ProductsTabProps {
  products: any[];
  productsLoading: boolean;
  onAddProduct: () => void;
  onEditProduct: (product: any) => void;
  onDeleteProduct: (id: string) => void;
  deleteProductPending: boolean;
}

export const ProductsTab = ({ 
  products, 
  productsLoading, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct,
  deleteProductPending 
}: ProductsTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.country_of_origin?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.availability && product.stock > 0) ||
                         (statusFilter === 'inactive' && (!product.availability || product.stock === 0));
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-green-100">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Product Management
          </CardTitle>
          <CardDescription>Manage your product catalog with advanced filtering and search</CardDescription>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={onAddProduct}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </CardHeader>
      <CardContent>
        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
          filteredCount={filteredProducts.length}
          totalCount={products.length}
        />

        {productsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2">Loading products...</span>
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
            deleteProductPending={deleteProductPending}
          />
        )}
      </CardContent>
    </Card>
  );
};
