
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardsProps {
  stats: {
    totalOrders: number;
    pendingRFQs: number;
    totalRevenue: string;
    activeProducts: number;
  } | undefined;
  isLoading: boolean;
}

export const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  const statItems = [
    {
      label: "Total Orders",
      value: stats?.totalOrders,
      bgColor: "bg-green-100",
      dotColor: "bg-green-500"
    },
    {
      label: "Pending RFQs",
      value: stats?.pendingRFQs,
      bgColor: "bg-blue-100",
      dotColor: "bg-blue-500"
    },
    {
      label: "Total Revenue",
      value: stats?.totalRevenue,
      bgColor: "bg-purple-100",
      dotColor: "bg-purple-500"
    },
    {
      label: "Active Products",
      value: stats?.activeProducts,
      bgColor: "bg-orange-100",
      dotColor: "bg-orange-500"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{item.label}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '...' : item.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center`}>
                <div className={`w-6 h-6 ${item.dotColor} rounded-full`}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
