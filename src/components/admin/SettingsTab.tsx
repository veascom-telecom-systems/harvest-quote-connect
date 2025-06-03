import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings, useUpdateSettings, useResetSettings, useExportSettings } from "@/hooks/useSettings";
import { 
  Settings, 
  Building, 
  Bell, 
  CreditCard, 
  Package,
  Save,
  RotateCcw,
  Download,
  AlertTriangle
} from "lucide-react";

export const SettingsTab = () => {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const resetSettings = useResetSettings();
  const exportSettings = useExportSettings();
  
  const [formData, setFormData] = useState(settings || {});
  const [hasChanges, setHasChanges] = useState(false);

  // Update form data when settings load
  useState(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(formData);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      try {
        await resetSettings.mutateAsync();
        setHasChanges(false);
      } catch (error) {
        console.error('Error resetting settings:', error);
      }
    }
  };

  const handleExport = async () => {
    try {
      await exportSettings.mutateAsync();
    } catch (error) {
      console.error('Error exporting settings:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure your application settings and preferences
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!hasChanges || updateSettings.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {updateSettings.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
          {hasChanges && (
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <AlertTriangle className="w-4 h-4" />
              You have unsaved changes
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="business">
            <Building className="w-4 h-4 mr-2" />
            Business
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="w-4 h-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Package className="w-4 h-4 mr-2" />
            Inventory
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic application configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={formData.general?.siteName || ''}
                    onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.general?.contactEmail || ''}
                    onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={formData.general?.siteDescription || ''}
                  onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={formData.general?.currency || ''}
                    onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={formData.general?.timezone || ''}
                    onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={formData.general?.language || ''}
                    onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Settings</CardTitle>
              <CardDescription>Configure business rules and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={formData.business?.taxRate || 0}
                    onChange={(e) => handleInputChange('business', 'taxRate', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="shippingFee">Shipping Fee (€)</Label>
                  <Input
                    id="shippingFee"
                    type="number"
                    step="0.01"
                    value={formData.business?.shippingFee || 0}
                    onChange={(e) => handleInputChange('business', 'shippingFee', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (€)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={formData.business?.freeShippingThreshold || 0}
                    onChange={(e) => handleInputChange('business', 'freeShippingThreshold', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="orderProcessingTime">Processing Time (hours)</Label>
                  <Input
                    id="orderProcessingTime"
                    type="number"
                    value={formData.business?.orderProcessingTime || 0}
                    onChange={(e) => handleInputChange('business', 'orderProcessingTime', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="returnPolicyDays">Return Policy (days)</Label>
                  <Input
                    id="returnPolicyDays"
                    type="number"
                    value={formData.business?.returnPolicyDays || 0}
                    onChange={(e) => handleInputChange('business', 'returnPolicyDays', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email and system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Enable email notifications' },
                { key: 'orderConfirmations', label: 'Order Confirmations', description: 'Send order confirmation emails' },
                { key: 'rfqNotifications', label: 'RFQ Notifications', description: 'Notify about new RFQ requests' },
                { key: 'marketingEmails', label: 'Marketing Emails', description: 'Send promotional emails' },
                { key: 'systemAlerts', label: 'System Alerts', description: 'Critical system notifications' },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between">
                  <div>
                    <Label>{setting.label}</Label>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <Switch
                    checked={formData.notifications?.[setting.key] || false}
                    onCheckedChange={(checked) => handleInputChange('notifications', setting.key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment methods and limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { key: 'stripeEnabled', label: 'Stripe Payments', description: 'Accept credit card payments via Stripe' },
                  { key: 'paypalEnabled', label: 'PayPal Payments', description: 'Accept PayPal payments' },
                  { key: 'bankTransferEnabled', label: 'Bank Transfer', description: 'Accept bank transfer payments' },
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <div>
                      <Label>{setting.label}</Label>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <Switch
                      checked={formData.payment?.[setting.key] || false}
                      onCheckedChange={(checked) => handleInputChange('payment', setting.key, checked)}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minimumOrderAmount">Minimum Order Amount (€)</Label>
                  <Input
                    id="minimumOrderAmount"
                    type="number"
                    value={formData.payment?.minimumOrderAmount || 0}
                    onChange={(e) => handleInputChange('payment', 'minimumOrderAmount', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maximumOrderAmount">Maximum Order Amount (€)</Label>
                  <Input
                    id="maximumOrderAmount"
                    type="number"
                    value={formData.payment?.maximumOrderAmount || 0}
                    onChange={(e) => handleInputChange('payment', 'maximumOrderAmount', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Settings */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Settings</CardTitle>
              <CardDescription>Configure inventory management options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { key: 'trackInventory', label: 'Track Inventory', description: 'Enable inventory tracking' },
                  { key: 'autoReorderEnabled', label: 'Auto Reorder', description: 'Automatically reorder low stock items' },
                  { key: 'allowBackorders', label: 'Allow Backorders', description: 'Allow orders when out of stock' },
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <div>
                      <Label>{setting.label}</Label>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <Switch
                      checked={formData.inventory?.[setting.key] || false}
                      onCheckedChange={(checked) => handleInputChange('inventory', setting.key, checked)}
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={formData.inventory?.lowStockThreshold || 0}
                  onChange={(e) => handleInputChange('inventory', 'lowStockThreshold', parseInt(e.target.value))}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Alert when stock falls below this number
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
