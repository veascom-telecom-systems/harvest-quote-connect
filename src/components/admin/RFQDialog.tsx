
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RFQ {
  id: string;
  status: string;
  quoted_price: number | null;
  admin_notes: string | null;
  profiles: { full_name: string } | null;
  rfq_items: Array<{
    product_name: string;
    quantity: number;
    unit_price_at_request: number | null;
  }>;
}

interface RFQDialogProps {
  rfq: RFQ | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, status: string, quotedPrice?: number, adminNotes?: string) => void;
  isLoading?: boolean;
}

export const RFQDialog = ({ rfq, open, onClose, onUpdate, isLoading }: RFQDialogProps) => {
  const [status, setStatus] = useState(rfq?.status || 'pending');
  const [quotedPrice, setQuotedPrice] = useState(rfq?.quoted_price?.toString() || '');
  const [adminNotes, setAdminNotes] = useState(rfq?.admin_notes || '');

  const handleSubmit = () => {
    if (!rfq) return;
    
    onUpdate(
      rfq.id, 
      status, 
      quotedPrice ? parseFloat(quotedPrice) : undefined,
      adminNotes
    );
  };

  if (!rfq) return null;

  const estimatedValue = rfq.rfq_items.reduce((total, item) => {
    return total + (item.quantity * (item.unit_price_at_request || 0));
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>RFQ Details - {rfq.id}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Customer</Label>
              <p className="text-sm font-medium">{rfq.profiles?.full_name || 'Unknown'}</p>
            </div>
            <div>
              <Label>Items Count</Label>
              <p className="text-sm font-medium">{rfq.rfq_items.length}</p>
            </div>
          </div>

          <div>
            <Label>Requested Items</Label>
            <div className="border rounded-md p-3 space-y-2">
              {rfq.rfq_items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.product_name}</span>
                  <span>Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Estimated Value</Label>
            <p className="text-sm font-medium">€{estimatedValue.toFixed(2)}</p>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quotedPrice">Quoted Price (€)</Label>
            <Input
              id="quotedPrice"
              type="number"
              step="0.01"
              value={quotedPrice}
              onChange={(e) => setQuotedPrice(e.target.value)}
              placeholder="Enter quoted price"
            />
          </div>

          <div>
            <Label htmlFor="adminNotes">Admin Notes</Label>
            <Textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes..."
              rows={3}
            />
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update RFQ'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
