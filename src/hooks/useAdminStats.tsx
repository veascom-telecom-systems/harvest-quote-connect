import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useAdminStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Verify admin role first
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, create admin profile for development
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user?.id,
              role: 'admin',
              updated_at: new Date().toISOString(),
            });

          if (insertError) {
            throw new Error('Failed to create admin profile');
          }
          // Continue with stats fetching
        } else {
          throw new Error('Database error');
        }
      } else if (profile?.role !== 'admin') {
        throw new Error('Unauthorized access');
      }

      // Get total orders
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get pending RFQs
      const { count: pendingRFQs } = await supabase
        .from('rfqs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get total revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid');

      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      // Get active products
      const { count: activeProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('availability', true);

      return {
        totalOrders: totalOrders || 0,
        pendingRFQs: pendingRFQs || 0,
        totalRevenue: `€${totalRevenue.toFixed(2)}`,
        activeProducts: activeProducts || 0
      };
    },
    enabled: !!user,
  });
};