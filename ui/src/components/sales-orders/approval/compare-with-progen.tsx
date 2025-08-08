"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowRight, 
  ArrowLeftRight, 
  RefreshCw, 
  Database, 
  AlertTriangle,
  CheckCircle,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SalesOrder } from "@/types/sales-order";

interface CompareWithProgenProps {
  salesOrder?: SalesOrder;
  progenData?: any; // This would be the data from your production system
  compareableFields?: string[];
  onRefreshProgenData?: () => void;
  onSyncFromProgen?: (fieldKey: string, value: any) => void;
}

// Mock Progen data - in real app, this would come from your production system API
const mockProgenData = {
  sono: "MRK/24-25/12345",
  so_date: "2024-01-15",
  customer_name: "ABC Pharmaceuticals Ltd",
  product_name: "Paracetamol Tablets 500mg",
  composition: "Paracetamol IP 500mg",
  hsn_code: "30049099",
  quantity: 10000,
  mrp: "150.00",
  billing_rate: "120.00",
  packing_style_description: "10X10 Alu-Alu Blister",
  last_updated: "2024-01-20T10:30:00Z",
  status: "Active"
};

const comparableFields = [
  { key: "sono", label: "SO Number", description: "Sales order number" },
  { key: "so_date", label: "SO Date", description: "Sales order date" },
  { key: "customer_name", label: "Customer Name", description: "Customer information" },
  { key: "product_name", label: "Product Name", description: "Product information" },
  { key: "composition", label: "Composition", description: "Product composition" },
  { key: "hsn_code", label: "HSN Code", description: "HSN classification code" },
  { key: "quantity", label: "Quantity", description: "Order quantity" },
  { key: "mrp", label: "MRP", description: "Maximum retail price" },
  { key: "billing_rate", label: "Billing Rate", description: "Billing rate" },
  { key: "packing_style_description", label: "Packing Style", description: "Packaging details" },
];

export function CompareWithProgen({
  salesOrder,
  progenData = mockProgenData,
  compareableFields = comparableFields,
  onRefreshProgenData,
  onSyncFromProgen
}: CompareWithProgenProps) {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleRefreshProgen = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onRefreshProgenData?.();
      toast({
        title: "Success",
        description: "Progen data refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh Progen data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSyncField = (fieldKey: string, progenValue: any) => {
    onSyncFromProgen?.(fieldKey, progenValue);
    toast({
      title: "Success",
      description: `Synced ${fieldKey} from Progen`,
    });
  };

  const getFieldValue = (obj: any, fieldKey: string) => {
    // Map sales order fields to the comparison fields
    const fieldMapping: { [key: string]: string } = {
      sono: "soNumber",
      so_date: "soDate",
      customer_name: "customerName",
      product_name: "itemName",
      composition: "composition",
      hsn_code: "hsnCode",
      quantity: "quantity",
      mrp: "mrp",
      billing_rate: "billingRate",
      packing_style_description: "packingStyleDescription",
    };
    
    const mappedKey = fieldMapping[fieldKey] || fieldKey;
    return obj?.[mappedKey] || "-";
  };

  const getComparisonStatus = (salesOrderValue: any, progenValue: any) => {
    if (salesOrderValue === progenValue) return "match";
    if (!salesOrderValue && progenValue) return "missing";
    if (salesOrderValue && !progenValue) return "extra";
    return "different";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "match":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "different":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "missing":
        return <ArrowLeftRight className="h-4 w-4 text-red-600" />;
      case "extra":
        return <ArrowRight className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "match":
        return <Badge variant="default" className="bg-green-100 text-green-800">Match</Badge>;
      case "different":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Different</Badge>;
      case "missing":
        return <Badge variant="destructive">Missing</Badge>;
      case "extra":
        return <Badge variant="secondary">Extra</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Compare with Production System (Progen)</h3>
          <p className="text-sm text-muted-foreground">
            Compare current sales order data with production system data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshProgen}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Progen Data
          </Button>
        </div>
      </div>

      {/* Progen Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Production System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {new Date(progenData?.last_updated || Date.now()).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Status: {progenData?.status || "Unknown"}</p>
              <p className="text-xs text-muted-foreground">Production System</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Field Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Field Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {compareableFields.map((field) => {
              const salesOrderValue = getFieldValue(salesOrder, field.key);
              const progenValue = getFieldValue(progenData, field.key);
              const status = getComparisonStatus(salesOrderValue, progenValue);

              return (
                <div
                  key={field.key}
                  className={`border rounded-lg p-4 transition-colors ${
                    selectedField === field.key ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedField(selectedField === field.key ? null : field.key)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <span className="font-medium">{field.label}</span>
                      {getStatusBadge(status)}
                    </div>
                    {status !== "match" && progenValue !== "-" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSyncField(field.key, progenValue);
                        }}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Sync
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-muted-foreground">Current (Sales Order)</Label>
                      <Input
                        value={salesOrderValue}
                        readOnly
                        className="mt-1 h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Progen (Production)</Label>
                      <Input
                        value={progenValue}
                        readOnly
                        className="mt-1 h-8"
                      />
                    </div>
                  </div>

                  {selectedField === field.key && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">{field.description}</p>
                      {status === "different" && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                          <strong>Note:</strong> Values differ between systems. Consider syncing if the Progen value is correct.
                        </div>
                      )}
                      {status === "missing" && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-xs">
                          <strong>Missing:</strong> This field is missing in the sales order but exists in Progen.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Comparison Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {compareableFields.filter(f => 
                  getComparisonStatus(getFieldValue(salesOrder, f.key), getFieldValue(progenData, f.key)) === "match"
                ).length}
              </p>
              <p className="text-sm text-muted-foreground">Matching</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {compareableFields.filter(f => 
                  getComparisonStatus(getFieldValue(salesOrder, f.key), getFieldValue(progenData, f.key)) === "different"
                ).length}
              </p>
              <p className="text-sm text-muted-foreground">Different</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {compareableFields.filter(f => 
                  getComparisonStatus(getFieldValue(salesOrder, f.key), getFieldValue(progenData, f.key)) === "missing"
                ).length}
              </p>
              <p className="text-sm text-muted-foreground">Missing</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {compareableFields.filter(f => 
                  getComparisonStatus(getFieldValue(salesOrder, f.key), getFieldValue(progenData, f.key)) === "extra"
                ).length}
              </p>
              <p className="text-sm text-muted-foreground">Extra</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
