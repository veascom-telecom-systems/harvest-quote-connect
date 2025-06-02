
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface RFQsTabProps {
  rfqs: any[];
  rfqsLoading: boolean;
  onManageRFQ: (rfq: any) => void;
}

export const RFQsTab = ({ rfqs, rfqsLoading, onManageRFQ }: RFQsTabProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-green-100">
      <CardHeader>
        <CardTitle>Request for Quotations</CardTitle>
        <CardDescription>Manage customer quote requests</CardDescription>
      </CardHeader>
      <CardContent>
        {rfqsLoading ? (
          <p>Loading RFQs...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFQ ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quoted Price</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfqs.map((rfq) => (
                <TableRow key={rfq.id}>
                  <TableCell className="font-medium">{rfq.id.slice(0, 8)}</TableCell>
                  <TableCell>{rfq.profiles?.full_name || 'Unknown'}</TableCell>
                  <TableCell>{rfq.rfq_items?.length || 0}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rfq.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : rfq.status === 'quoted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {rfq.status}
                    </span>
                  </TableCell>
                  <TableCell>€{rfq.quoted_price || 'TBD'}</TableCell>
                  <TableCell>{new Date(rfq.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onManageRFQ(rfq)}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
