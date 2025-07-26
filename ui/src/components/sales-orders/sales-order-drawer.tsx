"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { SalesOrder } from "@/types/sales-order"
import { formatDate } from "@/lib/date-utils"

interface SalesOrderDrawerProps {
  salesOrder: SalesOrder | null
  isOpen: boolean
  onClose: () => void
}

export default function SalesOrderDrawer({ salesOrder, isOpen, onClose }: SalesOrderDrawerProps) {
  if (!salesOrder) return null

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Draft: { label: "Draft", variant: "secondary" as const },
      Submitted: { label: "Submitted", variant: "default" as const },
      Approved: { label: "Approved", variant: "default" as const },
      Rejected: { label: "Rejected", variant: "destructive" as const },
      "In Progress": { label: "In Progress", variant: "outline" as const },
      Completed: { label: "Completed", variant: "default" as const },
    }[status] || { label: status, variant: "default" as const }
    
    return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              Sales Order: {salesOrder.soNumber}
            </DrawerTitle>
            <DrawerDescription>
              View sales order details and specifications
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">SO Number</label>
                    <p className="text-sm">{salesOrder.soNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">SO Date</label>
                    <p className="text-sm">{salesOrder.soDate ? formatDate(salesOrder.soDate) : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">{getStatusBadge(salesOrder.soStatus)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                    <p className="text-sm">{salesOrder.currentStatus || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Customer</label>
                    <p className="text-sm">{salesOrder.customerName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Term</label>
                    <p className="text-sm">{salesOrder.paymentTerm || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Quotation No</label>
                    <p className="text-sm">{salesOrder.quotationNo || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Quotation Date</label>
                    <p className="text-sm">{salesOrder.quotationDate ? formatDate(salesOrder.quotationDate) : 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Item</label>
                    <p className="text-sm">{salesOrder.itemName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">HSN Code</label>
                    <p className="text-sm">{salesOrder.hsnCode || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Dosage Name</label>
                    <p className="text-sm">{salesOrder.dosageName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Division</label>
                    <p className="text-sm">{salesOrder.divisionName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Quantity</label>
                    <p className="text-sm">{salesOrder.quantity || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">FOC Quantity</label>
                    <p className="text-sm">{salesOrder.focQty || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">MRP</label>
                    <p className="text-sm">{salesOrder.mrp || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Billing Rate</label>
                    <p className="text-sm">{salesOrder.billingRate || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Costing</label>
                    <p className="text-sm">{salesOrder.costing || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Composition</label>
                    <p className="text-sm">{salesOrder.composition || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Packaging Information */}
            <Card>
              <CardHeader>
                <CardTitle>Packaging Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Pack Short</label>
                    <p className="text-sm">{salesOrder.packShort || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tablet Type</label>
                    <p className="text-sm">{salesOrder.tabletType || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tablet Size</label>
                    <p className="text-sm">{salesOrder.tabletSize || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Capsule Size</label>
                    <p className="text-sm">{salesOrder.capsuleSize || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Shipper Size</label>
                    <p className="text-sm">{salesOrder.shipperSize || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Qty Per Shipper</label>
                    <p className="text-sm">{salesOrder.qtyPerShipper || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">No. of Shipper</label>
                    <p className="text-sm">{salesOrder.noOfShipper || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Flavour</label>
                    <p className="text-sm">{salesOrder.flavour || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fragrance</label>
                    <p className="text-sm">{salesOrder.fragrance || 'N/A'}</p>
                  </div>
                </div>

                {salesOrder.packingStyleDescription && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Packing Style Description</label>
                    <p className="text-sm mt-1">{salesOrder.packingStyleDescription}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Drawing References */}
            <Card>
              <CardHeader>
                <CardTitle>Drawing References</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Shipper Drawing Ref</label>
                    <p className="text-sm">{salesOrder.shipperDrawingRefCode || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">CTN Outer Drawing Ref</label>
                    <p className="text-sm">{salesOrder.ctnOuterDrawingRefNo || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">CTN Inner Drawing Ref</label>
                    <p className="text-sm">{salesOrder.ctnInnerDrawingRefNo || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Foil Drawing Ref</label>
                    <p className="text-sm">{salesOrder.foilDrawingRefNo || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Leaflet Drawing Ref</label>
                    <p className="text-sm">{salesOrder.leafletDrawingRefNo || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tube Drawing Ref</label>
                    <p className="text-sm">{salesOrder.tubeDrawingRefNo || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Label Drawing Ref</label>
                    <p className="text-sm">{salesOrder.labelDrawingRefNo || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Design Under</label>
                    <p className="text-sm">{salesOrder.designUnder || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Drug Approval Under</label>
                    <p className="text-sm">{salesOrder.drugApprovalUnder || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Assigned Designer</label>
                    <p className="text-sm">{salesOrder.assignedDesignerName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Plant Email Sent</label>
                    <p className="text-sm">{salesOrder.plantEmailSent ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Is Submitted</label>
                    <p className="text-sm">{salesOrder.isSubmitted ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {salesOrder.comments && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Comments</label>
                    <p className="text-sm mt-1">{salesOrder.comments}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Audit Information */}
            <Card>
              <CardHeader>
                <CardTitle>Audit Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created By</label>
                    <p className="text-sm">{salesOrder.createdByName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created At</label>
                    <p className="text-sm">{formatDate(salesOrder.createdAt)}</p>
                  </div>
                  {salesOrder.updatedByName && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Updated By</label>
                      <p className="text-sm">{salesOrder.updatedByName}</p>
                    </div>
                  )}
                  {salesOrder.updatedAt && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                      <p className="text-sm">{formatDate(salesOrder.updatedAt)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
} 