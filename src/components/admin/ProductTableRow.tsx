
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';

interface ProductTableRowProps {
  product: any;
  onEditProduct: (product: any) => void;
  onDeleteProduct: (id: string) => void;
  deleteProductPending: boolean;
}

export const ProductTableRow = ({ 
  product, 
  onEditProduct, 
  onDeleteProduct, 
  deleteProductPending 
}: ProductTableRowProps) => {
  const getStatusBadge = (product: any) => {
    if (product.availability && product.stock > 0) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (product.stock === 0) {
      return <Badge className="bg-yellow-100 text-yellow-800">Out of Stock</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock < 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <div className="flex items-center space-x-3">
          {product.image_url && (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-10 h-10 rounded-md object-cover"
            />
          )}
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-gray-500 truncate max-w-[200px]">
              {product.description}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{product.category || 'Uncategorized'}</Badge>
      </TableCell>
      <TableCell>{product.country_of_origin || 'N/A'}</TableCell>
      <TableCell className="font-medium">
        €{product.price || 0}/{product.unit || 'unit'}
      </TableCell>
      <TableCell>
        <span className={`font-medium ${getStockStatus(product.stock || 0)}`}>
          {product.stock || 0}
        </span>
      </TableCell>
      <TableCell>
        {getStatusBadge(product)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEditProduct(product)}
            className="hover:bg-blue-50"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDeleteProduct(product.id)}
            disabled={deleteProductPending}
            className="hover:bg-red-50 text-red-600 border-red-200"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
