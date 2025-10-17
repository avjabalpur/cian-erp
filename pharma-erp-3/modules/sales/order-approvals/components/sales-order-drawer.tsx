'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSalesOrderById } from '../hooks';

interface SalesOrderDrawerProps {
  salesOrderId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SalesOrderDrawer({
  salesOrderId,
  open,
  onOpenChange,
  onSuccess
}: SalesOrderDrawerProps) {
  const { data: salesOrder, isLoading } = useSalesOrderById(salesOrderId || 0);

  return (
    <RightDrawer 
      open={open} 
      onOpenChange={onOpenChange} 
      title={`Sales Order: ${salesOrder?.soNumber || salesOrderId}`}
      size="full"
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : salesOrder ? (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">SO Number</p>
                    <p className="font-medium">{salesOrder.soNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium text-orange-600">{salesOrder.customerName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Item</p>
                    <p className="font-medium text-purple-600">{salesOrder.itemName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{salesOrder.quantity || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge>{salesOrder.soStatus}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Stage</p>
                    <Badge variant="outline">{salesOrder.currentStatus || 'Pending'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Product Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Composition</p>
                    <p className="text-sm">{salesOrder.composition || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pack Short</p>
                    <p className="text-sm">{salesOrder.packShort || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MRP</p>
                    <p className="text-sm">{salesOrder.mrp || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Billing Rate</p>
                    <p className="text-sm">{salesOrder.billingRate || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Full approval workflow features will be available soon.
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-8">Sales Order not found</div>
        )}
      </div>
    </RightDrawer>
  );
}

