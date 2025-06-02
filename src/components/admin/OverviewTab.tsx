
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCards } from './StatsCards';

interface OverviewTabProps {
  stats: any;
  statsLoading: boolean;
  rfqs: any[];
  rfqsLoading: boolean;
  orders: any[];
  ordersLoading: boolean;
}

export const OverviewTab = ({ 
  stats, 
  statsLoading, 
  rfqs, 
  rfqsLoading, 
  orders, 
  ordersLoading 
}: OverviewTabProps) => {
  return (
    <div className="space-y-8">
      <StatsCards stats={stats} isLoading={statsLoading} />
      
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
  );
};
