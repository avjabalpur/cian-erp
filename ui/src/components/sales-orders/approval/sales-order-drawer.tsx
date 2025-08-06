"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  X, 
  Save, 
  Copy, 
  MessageSquare, 
  FileText, 
  Settings,
  CheckCircle,
  User,
  Calendar,
  Clock,
  ArrowLeft
} from "lucide-react";
import { SalesOrder, UpdateSalesOrderData } from "@/types/sales-order";
import { useSalesOrderById } from "@/hooks/sales-order/use-sales-orders";
import { useUpdateSalesOrder } from "@/hooks/sales-order/use-sales-orders";
import { useDosageOptions } from "@/components/shared/options";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/date-utils";
import { SalesOrderChat } from "./sales-order-chat";
import { SalesOrderComments } from "./sales-order-comments-table";
import { SalesOrderDocuments } from "./sales-order-documents-table";
import { SalesOrderApprovalStages } from "./sales-order-approval-stages";
import { RightDrawer } from "../../shared/right-drawer";
import { salesOrderSchema, SalesOrderUpdateFormValues, salesOrderUpdateSchema } from "@/validations/sales-order";



interface SalesOrderDrawerProps {
  salesOrderId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SalesOrderDrawer({ 
  salesOrderId, 
  isOpen, 
  onClose, 
  onSuccess 
}: SalesOrderDrawerProps) {
  const { toast } = useToast();
  const { data: salesOrder, isLoading } = useSalesOrderById(salesOrderId.toString());
  const updateSalesOrderMutation = useUpdateSalesOrder();
  const dosageOptions = useDosageOptions();

  const form = useForm<SalesOrderUpdateFormValues>({
    resolver: zodResolver(salesOrderUpdateSchema),
    defaultValues: {
      soNumber: "",
      soDate: "",
      soStatus: "",
      customerId: 0,
      dosageName: "",
      currentStatus: "",
      plantEmailSent: false,
    },
  });

  React.useEffect(() => {
    if (salesOrder) {
      form.reset({
        soNumber: salesOrder.soNumber || "",
        soDate: salesOrder.soDate || "",
        soStatus: salesOrder.soStatus || "",
        organizationId: salesOrder.organizationId,
        customerId: salesOrder.customerId || 0,
        paymentTerm: salesOrder.paymentTerm || "",
        quotationDate: salesOrder.quotationDate || "",
        quotationNo: salesOrder.quotationNo || "",
        hsnCode: salesOrder.hsnCode || "",
        itemId: salesOrder.itemId,
        dosageName: salesOrder.dosageName || "",
        divisionId: salesOrder.divisionId,
        designUnder: salesOrder.designUnder || "",
        packingStyleDescription: salesOrder.packingStyleDescription || "",
        composition: salesOrder.composition || "",
        packShort: salesOrder.packShort || "",
        tabletType: salesOrder.tabletType || "",
        tabletSize: salesOrder.tabletSize || "",
        changePart: salesOrder.changePart || "",
        capsuleSize: salesOrder.capsuleSize || "",
        shipperSize: salesOrder.shipperSize || "",
        qtyPerShipper: salesOrder.qtyPerShipper || "",
        noOfShipper: salesOrder.noOfShipper || "",
        flavour: salesOrder.flavour || "",
        fragrance: salesOrder.fragrance || "",
        quantity: salesOrder.quantity || "",
        focQty: salesOrder.focQty || "",
        mrp: salesOrder.mrp || "",
        billingRate: salesOrder.billingRate || "",
        costing: salesOrder.costing || "",
        inventoryCharges: salesOrder.inventoryCharges || "",
        cylinderCharge: salesOrder.cylinderCharge || "",
        plateCharges: salesOrder.plateCharges || "",
        domino: salesOrder.domino || "",
        stereo: salesOrder.stereo || "",
        shipperDrawingRefCode: salesOrder.shipperDrawingRefCode || "",
        ctnOuterDrawingRefNo: salesOrder.ctnOuterDrawingRefNo || "",
        ctnInnerDrawingRefNo: salesOrder.ctnInnerDrawingRefNo || "",
        foilDrawingRefNo: salesOrder.foilDrawingRefNo || "",
        leafletDrawingRefNo: salesOrder.leafletDrawingRefNo || "",
        tubeDrawingRefNo: salesOrder.tubeDrawingRefNo || "",
        labelDrawingRefNo: salesOrder.labelDrawingRefNo || "",
        pmOuterCtnStock: salesOrder.pmOuterCtnStock || "",
        pmInnerCtnStock: salesOrder.pmInnerCtnStock || "",
        pmFoilStock: salesOrder.pmFoilStock || "",
        pmLeafletStock: salesOrder.pmLeafletStock || "",
        pmTubeStock: salesOrder.pmTubeStock || "",
        pmLabelStock: salesOrder.pmLabelStock || "",
        drugApprovalUnder: salesOrder.drugApprovalUnder || "",
        currentStatus: salesOrder.currentStatus || "",
        comments: salesOrder.comments || "",
        assignedDesigner: salesOrder.assignedDesigner,
        plantEmailSent: salesOrder.plantEmailSent || false,
      });
    }
  }, [salesOrder, form]);

  const onSubmit = async (values: SalesOrderUpdateFormValues) => {
    try {
      await updateSalesOrderMutation.mutateAsync({
        id: salesOrderId.toString(),
        data: values as UpdateSalesOrderData,
      });
      
      toast({
        title: "Success",
        description: "Sales order updated successfully",
      });
      
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update sales order",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/sales-orders/${salesOrderId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Sales order link copied to clipboard",
    });
  };

  return (
    <RightDrawer isOpen={isOpen} onClose={onClose} title="Sales Order Details" size="full">

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading sales order details...</p>
          </div>
        </div>
      ) : (
        <div className="flex h-full">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h2 className="text-xl font-semibold">
                      Sales Order Approval | {salesOrderId}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {salesOrder?.soNumber} - {salesOrder?.customerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Assigned Designer
                  </Button>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Created By {salesOrder?.createdByName}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Tools
                  </Button>
                  <Button variant="outline" size="sm" onClick={onClose}>
                    Back
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={updateSalesOrderMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateSalesOrderMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" className="border-dashed border-red-500 text-red-500">
                  CANCEL FORM
                </Button>
                <div className="flex items-center gap-2">
                  <Label htmlFor="email-sent" className="text-sm">Email Sent</Label>
                  <Switch id="email-sent" />
                </div>
              </div>

              {/* Current Status */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Current Status:</Label>
                  <Select value={form.watch("currentStatus")} onValueChange={(value) => form.setValue("currentStatus", value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADDED-TO-PROGEN">ADDED-TO-PROGEN</SelectItem>
                      <SelectItem value="IN-PROGRESS">IN-PROGRESS</SelectItem>
                      <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="sm">
                  Request Changes
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="basic-info" className="flex-1 flex flex-col">
              <div className="border-b px-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                  <TabsTrigger value="compare-progen">Compare With Progen</TabsTrigger>
                  <TabsTrigger value="quotations">Quotations</TabsTrigger>
                  <TabsTrigger value="performa-invoice">Performa Invoice</TabsTrigger>
                  <TabsTrigger value="save-history">Save History</TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-auto p-4">
                <TabsContent value="basic-info" className="space-y-6">
                  {/* Approval Stages */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Approval Stages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SalesOrderApprovalStages salesOrderId={salesOrderId} />
                    </CardContent>
                  </Card>

                  {/* Reference Documents */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Reference Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Upload File
                        </Button>
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Attached Documents
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* SO Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>SO Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="soNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>SONO</FormLabel>
                                  <FormControl>
                                    <Input {...field} readOnly />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="soDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>SO Date</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="date" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="dosageName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dosage Name</FormLabel>
                                  <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select dosage" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {dosageOptions.map((option) => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="composition"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Composition</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} rows={3} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>

                  {/* Product Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4">
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>P Quantity</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="focQty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>P FOC Qty</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="billingRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>P Billing Rate</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="mrp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>P MRP</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="compare-progen">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground">Compare With Progen functionality will be implemented here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="quotations">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground">Quotations functionality will be implemented here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performa-invoice">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground">Performa Invoice functionality will be implemented here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="save-history">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground">Save History functionality will be implemented here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Sidebar - Chat */}
          <div className="w-80 border-l flex flex-col">
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Chat Comments</h3>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <SalesOrderChat salesOrderId={salesOrderId} />
            </div>
          </div>
        </div>
      )}
    </RightDrawer>
  );
} 