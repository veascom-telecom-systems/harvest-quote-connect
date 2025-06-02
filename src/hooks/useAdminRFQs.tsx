
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminRFQs = () => {
  return useQuery({
    queryKey: ['admin-rfqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rfqs')
        .select(`
          *,
          profiles (full_name),
          rfq_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateRFQStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status, quotedPrice, adminNotes }: { 
      id: string; 
      status: string; 
      quotedPrice?: number;
      adminNotes?: string;
    }) => {
      const updates: any = { 
        status,
        admin_notes: adminNotes 
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
