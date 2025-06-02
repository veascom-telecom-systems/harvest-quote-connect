
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface OrdersTabProps {
  orders: any[];
  ordersLoading: boolean;
  onUpdateOrderStatus: (id: string, status: string) => void;
}

export const OrdersTab = ({ orders, ordersLoading, onUpdateOrderStatus }: OrdersTabProps) => {
  return (
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
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
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
  );
};
