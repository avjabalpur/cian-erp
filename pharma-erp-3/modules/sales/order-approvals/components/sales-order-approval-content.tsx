"use client";

import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { SalesOrderUpdateFormValues, salesOrderUpdateSchema } from "../validations/sales-order.schema";
import { 
  useSalesOrderById, 
  useUpdateSalesOrder,
  useSalesOrderStages,
  useChatMessagesBySalesOrder,
  useDocumentsBySalesOrder,
  useSaveTransactionsBySalesOrder,
  useCreateSalesOrderChatMessage,
} from "../hooks";
import { ApprovalButtons } from "./approval-buttons";
import { SOInfoForm } from "./so-info-form";
import { ProductInfoForm } from "./product-info-form";
import { ReferenceDocuments } from "./reference-documents";
import { ChatSidebar } from "./chat-sidebar";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface SalesOrderApprovalContentProps {
  salesOrderId: number;
  isPageMode?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

const currentStatusOptions = [
  { label: 'In Progress', value: 'IN-PROGRESS' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'On Hold', value: 'ON-HOLD' },
];

export function SalesOrderApprovalContent({
  salesOrderId,
  isPageMode = false,
  onClose,
  onSuccess
}: SalesOrderApprovalContentProps) {
  const queryClient = useQueryClient();

  const { data: salesOrder, isLoading } = useSalesOrderById(salesOrderId);
  const { data: chatMessages = [], isLoading: chatMessagesLoading } = useChatMessagesBySalesOrder(salesOrderId);
  const { data: documents = [], isLoading: documentsLoading } = useDocumentsBySalesOrder(salesOrderId);
  const { data: saveTransactions = [], isLoading: transactionsLoading } = useSaveTransactionsBySalesOrder(salesOrderId);
  const { data: stages = [], isLoading: stagesLoading } = useSalesOrderStages(salesOrderId);

  const updateSalesOrderMutation = useUpdateSalesOrder();
  const createChatMessageMutation = useCreateSalesOrderChatMessage();

  const handleStageUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['sales-order-stages', salesOrderId] });
    queryClient.invalidateQueries({ queryKey: ['sales-order', salesOrderId] });
  };

  const form = useForm<SalesOrderUpdateFormValues>({
    resolver: zodResolver(salesOrderUpdateSchema),
    defaultValues: {
      soNumber: "",
      soDate: "",
      soStatus: "repeat",
      customerId: 0,
      dosageName: "-1",
      currentStatus: "IN-PROGRESS",
      assignedDesigner: 0,
      plantEmailSent: false,
      organizationId: "-1",
    },
  });

  useEffect(() => {
    if (salesOrder) {
      form.reset({
        soNumber: salesOrder.soNumber || "",
        soDate: salesOrder.soDate || "",
        soStatus: salesOrder.soStatus || "repeat",
        organizationId: salesOrder.organizationId?.toString() || "-1",
        customerId: salesOrder.customerId || 0,
        paymentTerm: salesOrder.paymentTerm || "",
        quotationDate: salesOrder.quotationDate || "",
        quotationNo: salesOrder.quotationNo || "",
        hsnCode: salesOrder.hsnCode || "",
        itemId: salesOrder.itemId,
        dosageName: salesOrder.dosageName || "-1",
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
        currentStatus: salesOrder.currentStatus || "IN-PROGRESS",
        comments: salesOrder.comments || "",
        assignedDesigner: salesOrder.assignedDesigner || 0,
        plantEmailSent: salesOrder.plantEmailSent || false,
        productCode: salesOrder.productCode || "",
        country: salesOrder.country || "",
        customerGstNo: salesOrder.customerGstNo || "",
        customerName: salesOrder.customerName || "",
        customerCode: "",
        productName: "",
        productCast: "",
      });
    }
  }, [salesOrder, form]);

  // Transform chat messages
  const transformedChatMessages = chatMessages.map((chat) => ({
    id: chat.id.toString(),
    message: chat.comment,
    sender: chat.createdByName || "Unknown User",
    timestamp: new Date(chat.createdAt),
  }));

  const onSubmit = async (values: SalesOrderUpdateFormValues) => {
    try {
      const updateData = {
        ...values,
        customerId: values.customerId ? Number(values.customerId) : undefined,
        itemId: values.itemId ? Number(values.itemId) : undefined,
        organizationId: values.organizationId ? Number(values.organizationId) : undefined,
        divisionId: values.divisionId ? Number(values.divisionId) : undefined,
        assignedDesigner: values.assignedDesigner ? Number(values.assignedDesigner) : undefined,
      };

      await updateSalesOrderMutation.mutateAsync({
        id: salesOrderId,
        data: updateData as any,
      });

      toast.success("Sales order updated successfully");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update sales order");
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      await createChatMessageMutation.mutateAsync({
        salesOrderId,
        data: {
          salesOrderId,
          comment: message,
          isDeleted: false,
        }
      });
      toast.success("Message sent successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to send message");
    }
  };

  const handleLastRead = () => {
    console.log("Last read clicked");
  };

  const handleChatSettings = () => {
    console.log("Chat settings clicked");
  };

  const handleCustomerSelect = (customer: any) => {
    form.setValue("customerId", customer.id);
    form.setValue("customerCode", customer.customerCode || "");
    form.setValue("customerName", customer.customerName || "");
    form.setValue("customerGstNo", customer.gstNo || "");
    form.trigger(["customerId", "customerCode", "customerName"]);
  };

  const handleItemSelect = (item: any) => {
    form.setValue("itemId", item.id);
    form.setValue("productCode", item.itemCode || "");
    form.setValue("productName", item.itemName || "");
    form.setValue("composition", item.composition || "");
    form.setValue("dosageName", item.dosageName || "-1");
    form.trigger(["itemId", "productCode", "productName"]);
  };

  const handleManufacturerSelect = (manufacturer: any) => {
    if (manufacturer && manufacturer.country) {
      form.setValue("country", manufacturer.country);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sales order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
            {/* Header Bar */}
            <div className="border-b bg-gradient-to-r from-slate-50 to-gray-50 p-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-700">Current Status:</span>
                    <Select
                      value={form.watch("currentStatus") || salesOrder?.currentStatus || "IN-PROGRESS"}
                      onValueChange={(value) => form.setValue("currentStatus", value)}
                      disabled={updateSalesOrderMutation.isPending}
                    >
                      <SelectTrigger className="w-48 border-gray-300 bg-white ml-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currentStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Created By:</span>
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {salesOrder?.createdByName || "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Email Sent:</span>
                    <Switch 
                      checked={form.watch("plantEmailSent") || salesOrder?.plantEmailSent || false}
                      onCheckedChange={(checked) => form.setValue("plantEmailSent", checked)}
                      disabled={updateSalesOrderMutation.isPending}
                    />
                  </div>

                  <Button
                    size="sm"
                    type="submit"
                    disabled={updateSalesOrderMutation.isPending}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateSalesOrderMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Content with Tabs */}
            <div className="flex-1 flex flex-col">
              <Tabs defaultValue="basic-info" className="flex-1 flex flex-col">
                <div className="px-3 pt-2">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                    <TabsTrigger value="compare-progen">Compare With Progen</TabsTrigger>
                    <TabsTrigger value="quotations">Quotations</TabsTrigger>
                    <TabsTrigger value="save-history">Save History</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 p-3 overflow-y-auto">
                  <TabsContent value="basic-info" className="space-y-3 h-full">
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                        <CardTitle className="text-lg font-semibold">Approval Stages</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        {stagesLoading ? (
                          <div className="text-center py-4">Loading approval stages...</div>
                        ) : (
                          <ApprovalButtons
                            salesOrderId={salesOrderId}
                            stages={stages}
                            onStageUpdate={handleStageUpdate}
                            disabled={updateSalesOrderMutation.isPending}
                          />
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md">
                      <CardHeader className="p-2 bg-gradient-to-r from-slate-600 to-gray-600 text-white rounded-t-lg">
                        <CardTitle className="text-lg font-semibold">SO Info</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <SOInfoForm
                          control={form.control}
                          disabled={updateSalesOrderMutation.isPending}
                          onCustomerSelect={handleCustomerSelect}
                          onItemSelect={handleItemSelect}
                          onManufacturerSelect={handleManufacturerSelect}
                        />
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md">
                      <CardHeader className="p-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
                        <CardTitle className="text-lg font-semibold">Product Info</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <ProductInfoForm
                          control={form.control}
                          disabled={updateSalesOrderMutation.isPending}
                        />
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md">
                      <CardHeader className="p-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
                        <CardTitle className="text-lg font-semibold">Reference Documents</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <ReferenceDocuments
                          salesOrderId={salesOrderId}
                          disabled={updateSalesOrderMutation.isPending}
                          documents={documents}
                          isLoading={documentsLoading}
                        />
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

                  <TabsContent value="save-history">
                    <Card>
                      <CardContent className="pt-4">
                        {transactionsLoading ? (
                          <div className="text-center py-8">Loading save history...</div>
                        ) : saveTransactions.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                            No save history found
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {saveTransactions.map((transaction) => (
                              <div key={transaction.id} className="bg-white border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold">{transaction.createdByName || "Unknown User"}</span>
                                  <span className="text-xs text-gray-500">{new Date(transaction.createdAt).toLocaleString()}</span>
                                </div>
                                {transaction.diff && (
                                  <pre className="text-xs whitespace-pre-wrap">{transaction.diff}</pre>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </form>
        </FormProvider>
      </div>

      {/* Chat Sidebar */}
      <ChatSidebar
        messages={transformedChatMessages}
        onSendMessage={handleSendMessage}
        onLastRead={handleLastRead}
        onSettings={handleChatSettings}
        disabled={updateSalesOrderMutation.isPending}
      />
    </div>
  );
}

