
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductTableRow } from './ProductTableRow';

interface ProductTableProps {
  products: any[];
  onEditProduct: (product: any) => void;
  onDeleteProduct: (id: string) => void;
  deleteProductPending: boolean;
}

export const ProductTable = ({ 
  products, 
  onEditProduct, 
  onDeleteProduct, 
  deleteProductPending 
}: ProductTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No products found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                onEditProduct={onEditProduct}
                onDeleteProduct={onDeleteProduct}
                deleteProductPending={deleteProductPending}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
