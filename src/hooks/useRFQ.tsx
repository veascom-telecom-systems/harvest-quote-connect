
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useRFQs = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['rfqs', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('rfqs')
        .select(`
          *,
          rfq_items (*)
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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ rfqData, items }: { rfqData: any; items: any[] }) => {
      if (!user) throw new Error('Not authenticated');

      // Create the RFQ
      const { data: rfq, error: rfqError } = await supabase
        .from('rfqs')
        .insert({
          ...rfqData,
          user_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (rfqError) throw rfqError;

      // Create RFQ items
      const rfqItems = items.map(item => ({
        rfq_id: rfq.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price_at_request: item.unit_price_at_request,
        product_unit: item.product_unit
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
        description: "Request for quotation submitted successfully",
      });
    },
    onError: (error: any) => {
      console.error('RFQ creation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit RFQ",
        variant: "destructive"
      });
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

export const useDeleteRFQ = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // Delete RFQ items first (due to foreign key constraint)
      const { error: itemsError } = await supabase
        .from('rfq_items')
        .delete()
        .eq('rfq_id', id);

      if (itemsError) throw itemsError;

      // Then delete the RFQ
      const { error: rfqError } = await supabase
        .from('rfqs')
        .delete()
        .eq('id', id);

      if (rfqError) throw rfqError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      toast({
        title: "Success",
        description: "RFQ deleted successfully",
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
