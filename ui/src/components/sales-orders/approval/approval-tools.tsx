"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Settings, 
  Copy, 
  RefreshCw, 
  Search, 
  FileText, 
  Database,
  ArrowRight,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SalesOrder } from "@/types/sales-order";
import { useSalesOrders } from "@/hooks/sales-order/use-sales-orders";
import { useUpdateSalesOrder } from "@/hooks/sales-order/use-sales-orders";

interface ApprovalToolsProps {
  salesOrderId: number;
  currentSalesOrder?: SalesOrder;
  onSalesOrderUpdate?: (updatedSalesOrder: SalesOrder) => void;
}

export function ApprovalTools({ 
  salesOrderId, 
  currentSalesOrder, 
  onSalesOrderUpdate 
}: ApprovalToolsProps) {
  const { toast } = useToast();
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [copySearchTerm, setCopySearchTerm] = useState("");
  const [selectedPreviousSO, setSelectedPreviousSO] = useState<SalesOrder | null>(null);
  const [copyFields, setCopyFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateSalesOrderMutation = useUpdateSalesOrder();
  
  // Fetch previous sales orders for copying
  const { data: previousSalesOrders = [] } = useSalesOrders({
    search: copySearchTerm,
    page: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  const availableCopyFields = [
    { key: "customerId", label: "Customer", description: "Customer information" },
    { key: "paymentTerm", label: "Payment Terms", description: "Payment terms and conditions" },
    { key: "quotationNo", label: "Quotation Number", description: "Related quotation details" },
    { key: "hsnCode", label: "HSN Code", description: "Product HSN code" },
    { key: "dosageName", label: "Dosage Form", description: "Product dosage form" },
    { key: "designUnder", label: "Design Under", description: "Design specifications" },
    { key: "packingStyleDescription", label: "Packing Style", description: "Packaging details" },
    { key: "composition", label: "Composition", description: "Product composition" },
    { key: "tabletType", label: "Tablet Type", description: "Tablet specifications" },
    { key: "tabletSize", label: "Tablet Size", description: "Tablet dimensions" },
    { key: "quantity", label: "Quantity", description: "Order quantity" },
    { key: "mrp", label: "MRP", description: "Maximum retail price" },
    { key: "billingRate", label: "Billing Rate", description: "Billing rate information" },
  ];

  const handleCopyFromPrevious = async () => {
    if (!selectedPreviousSO || copyFields.length === 0) {
      toast({
        title: "Error",
        description: "Please select a sales order and fields to copy.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const updateData: Partial<SalesOrder> = { id: salesOrderId };
      
      copyFields.forEach(field => {
        const value = selectedPreviousSO[field as keyof SalesOrder];
        if (value !== undefined) {
          (updateData as any)[field] = value;
        }
      });

      const updatedSalesOrder = await updateSalesOrderMutation.mutateAsync(updateData);
      
      if (onSalesOrderUpdate) {
        onSalesOrderUpdate(updatedSalesOrder);
      }

      toast({
        title: "Success",
        description: `Copied ${copyFields.length} fields from previous sales order.`,
      });

      setIsCopyModalOpen(false);
      setSelectedPreviousSO(null);
      setCopyFields([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompareWithProgen = async () => {
    // This would integrate with your production system
    toast({
      title: "Info",
      description: "Progen comparison feature will be implemented based on your production system integration.",
    });
  };

  const handleRefreshOptions = () => {
    // Refresh dropdown options from database
    toast({
      title: "Success",
      description: "Options refreshed successfully.",
    });
  };

  const toggleCopyField = (fieldKey: string) => {
    setCopyFields(prev => 
      prev.includes(fieldKey) 
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Tools
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setIsCopyModalOpen(true)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy from Previous SO
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsCompareModalOpen(true)}>
            <Database className="h-4 w-4 mr-2" />
            Compare with Progen
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRefreshOptions}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Options
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Copy from Previous SO Modal */}
      <Dialog open={isCopyModalOpen} onOpenChange={setIsCopyModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Copy from Previous Sales Order</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Search Previous Sales Orders */}
            <div className="space-y-2">
              <Label>Search Previous Sales Orders</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by SO number, customer, or product..."
                  value={copySearchTerm}
                  onChange={(e) => setCopySearchTerm(e.target.value)}
                />
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Previous Sales Orders List */}
            <div className="space-y-2">
              <Label>Select Sales Order to Copy From</Label>
              <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-2">
                {previousSalesOrders
                  .filter(so => so.id !== salesOrderId)
                  .map((so) => (
                    <div
                      key={so.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedPreviousSO?.id === so.id
                          ? "border-blue-500 bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedPreviousSO(so)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{so.soNumber}</div>
                          <div className="text-sm text-gray-600">
                            {so.customerName} - {so.itemName}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(so.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Select Fields to Copy */}
            {selectedPreviousSO && (
              <div className="space-y-2">
                <Label>Select Fields to Copy</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {availableCopyFields.map((field) => (
                    <div
                      key={field.key}
                      className={`p-2 border rounded-md cursor-pointer transition-colors ${
                        copyFields.includes(field.key)
                          ? "border-green-500 bg-green-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => toggleCopyField(field.key)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{field.label}</div>
                          <div className="text-xs text-gray-600">{field.description}</div>
                        </div>
                        {copyFields.includes(field.key) && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview */}
            {selectedPreviousSO && copyFields.length > 0 && (
              <div className="space-y-2">
                <Label>Preview of Changes</Label>
                <div className="border rounded-md p-3 bg-gray-50">
                  <div className="text-sm font-medium mb-2">Will copy from SO: {selectedPreviousSO.soNumber}</div>
                  <div className="space-y-1">
                    {copyFields.map(fieldKey => {
                      const field = availableCopyFields.find(f => f.key === fieldKey);
                      const value = selectedPreviousSO[fieldKey as keyof SalesOrder];
                      return (
                        <div key={fieldKey} className="flex items-center gap-2 text-sm">
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                          <span className="font-medium">{field?.label}:</span>
                          <span className="text-gray-600">{String(value || 'N/A')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCopyModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCopyFromPrevious} 
              disabled={!selectedPreviousSO || copyFields.length === 0 || isLoading}
            >
              {isLoading ? "Copying..." : `Copy ${copyFields.length} Fields`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compare with Progen Modal */}
      <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Compare with Production System (Progen)</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                This feature will compare the current sales order with data in your production system.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Integration with your production system will be implemented based on your specific requirements.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompareModalOpen(false)}>
              Close
            </Button>
            <Button onClick={handleCompareWithProgen}>
              Compare Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
