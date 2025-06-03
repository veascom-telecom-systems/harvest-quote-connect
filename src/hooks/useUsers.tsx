import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const verifyAdminRole = async (userId: string) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No profile found, create admin profile for development
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          role: 'admin',
          updated_at: new Date().toISOString(),
        });
      
      if (insertError) {
        throw new Error('Failed to create admin profile');
      }
      return; // Profile created successfully
    }
    throw new Error('Database error');
  }

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized access');
  }
};

export const useUsers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      await verifyAdminRole(user.id);

      // Get users from auth.users and their profiles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Get additional user stats
      const usersWithStats = await Promise.all(
        profiles.map(async (profile) => {
          // Get order count for each user
          const { count: orderCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);

          // Get RFQ count for each user
          const { count: rfqCount } = await supabase
            .from('rfqs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);

          return {
            ...profile,
            orderCount: orderCount || 0,
            rfqCount: rfqCount || 0,
            lastActive: profile.updated_at,
          };
        })
      );

      return usersWithStats;
    },
    enabled: !!user,
  });
};

export const useUpdateUserRole = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      await verifyAdminRole(user.id);

      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    },
  });
};

export const useUserStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      await verifyAdminRole(user.id);

      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get admin users count
      const { count: adminUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      // Get users registered this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: newUsersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', startOfMonth.toISOString());

      // Get active users (users with orders in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: activeUserIds } = await supabase
        .from('orders')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const activeUsers = new Set(activeUserIds?.map(order => order.user_id)).size;

      return {
        totalUsers: totalUsers || 0,
        adminUsers: adminUsers || 0,
        regularUsers: (totalUsers || 0) - (adminUsers || 0),
        newUsersThisMonth: newUsersThisMonth || 0,
        activeUsers: activeUsers || 0,
      };
    },
    enabled: !!user,
  });
};
