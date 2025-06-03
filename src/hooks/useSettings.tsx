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
      return;
    }
    throw new Error('Database error');
  }

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized access');
  }
};

// Default settings structure
const defaultSettings = {
  general: {
    siteName: 'Crop Catch',
    siteDescription: 'Premium Agricultural Products Marketplace',
    contactEmail: 'info@cropcatch.com',
    supportPhone: '+1-555-0123',
    currency: 'EUR',
    timezone: 'Europe/London',
    language: 'en',
  },
  business: {
    taxRate: 20,
    shippingFee: 5.99,
    freeShippingThreshold: 50,
    orderProcessingTime: 24,
    returnPolicyDays: 30,
  },
  notifications: {
    emailNotifications: true,
    orderConfirmations: true,
    rfqNotifications: true,
    marketingEmails: false,
    systemAlerts: true,
  },
  payment: {
    stripeEnabled: true,
    paypalEnabled: false,
    bankTransferEnabled: true,
    minimumOrderAmount: 10,
    maximumOrderAmount: 10000,
  },
  inventory: {
    lowStockThreshold: 10,
    autoReorderEnabled: false,
    trackInventory: true,
    allowBackorders: false,
  },
};

export const useSettings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      await verifyAdminRole(user.id);

      // For now, we'll use localStorage to store settings
      // In production, you'd want to create an app_settings table
      const storedSettings = localStorage.getItem('crop-catch-settings');
      
      if (storedSettings) {
        try {
          const parsed = JSON.parse(storedSettings);
          // Merge with defaults to ensure all settings exist
          return {
            ...defaultSettings,
            ...parsed,
            general: { ...defaultSettings.general, ...parsed.general },
            business: { ...defaultSettings.business, ...parsed.business },
            notifications: { ...defaultSettings.notifications, ...parsed.notifications },
            payment: { ...defaultSettings.payment, ...parsed.payment },
            inventory: { ...defaultSettings.inventory, ...parsed.inventory },
          };
        } catch (error) {
          console.error('Error parsing stored settings:', error);
          return defaultSettings;
        }
      }

      return defaultSettings;
    },
    enabled: !!user,
  });
};

export const useUpdateSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (settings: any) => {
      if (!user) throw new Error('Not authenticated');
      
      await verifyAdminRole(user.id);

      // Store in localStorage for now
      // In production, you'd save to app_settings table
      localStorage.setItem('crop-catch-settings', JSON.stringify(settings));
      
      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
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

export const useResetSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      await verifyAdminRole(user.id);

      // Reset to defaults
      localStorage.removeItem('crop-catch-settings');
      
      return defaultSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast({
        title: "Success",
        description: "Settings reset to defaults",
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

export const useExportSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      await verifyAdminRole(user.id);

      const settings = localStorage.getItem('crop-catch-settings');
      const settingsData = settings ? JSON.parse(settings) : defaultSettings;
      
      // Create downloadable file
      const dataStr = JSON.stringify(settingsData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `crop-catch-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return settingsData;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Settings exported successfully",
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
