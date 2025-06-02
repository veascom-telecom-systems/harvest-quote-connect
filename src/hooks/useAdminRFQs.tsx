import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const verifyAdminRole = async (userId: string) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized access');
  }
};

export const useAdminRFQs = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-rfqs'],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      await verifyAdminRole(user.id);

      const { data, error } = await supabase
        .from('rfqs')
        .select(`
          *,
          profiles!rfqs_user_id_fkey (full_name),
          rfq_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useUpdateRFQStatus = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status, quotedPrice, adminNotes }: { 
      id: string; 
      status: string; 
      quotedPrice?: number;
      adminNotes?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      await verifyAdminRole(user.id);

      const updates: any = { 
        status,
        admin_notes: adminNotes,
        quote_responded_by: user.id
      };
      
      if (quotedPrice !== undefined) {
        updates.quoted_price = quotedPrice;
        updates.quoted_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('rfqs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rfqs'] });
      toast({
        title: "Success",
        description: "RFQ updated successfully",
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