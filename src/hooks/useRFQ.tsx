
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

export const useRFQs = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['rfqs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('rfqs')
        .select(`
          *,
          rfq_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateRFQ = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (rfqData: { notes?: string; items: any[] }) => {
      if (!user) throw new Error('User not authenticated');

      // Create RFQ
      const { data: rfq, error: rfqError } = await supabase
        .from('rfqs')
        .insert({
          user_id: user.id,
          notes: rfqData.notes,
          status: 'pending',
        })
        .select()
        .single();

      if (rfqError) throw rfqError;

      // Create RFQ items
      const rfqItems = rfqData.items.map(item => ({
        rfq_id: rfq.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        product_unit: item.product_unit,
        unit_price_at_request: item.unit_price_at_request,
      }));

      const { error: itemsError } = await supabase
        .from('rfq_items')
        .insert(rfqItems);

      if (itemsError) throw itemsError;

      return rfq;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      toast({
        title: "Success",
        description: "RFQ submitted successfully",
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

export const useAdminRFQs = () => {
  return useQuery({
    queryKey: ['admin-rfqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rfqs')
        .select(`
          *,
          profiles (full_name),
          rfq_items (
            *,
            products (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateRFQ = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
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
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
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
