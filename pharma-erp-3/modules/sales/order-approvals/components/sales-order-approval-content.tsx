"use client";

import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, MessageSquare, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  const [isChatOpen, setIsChatOpen] = useState(true);

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

  const handleChatClose = () => {
    setIsChatOpen(false);
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
            <div className="border-b bg-gradient-to-r from-slate-50 to-gray-50 px-3 py-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">Status:</span>
                    <Select
                      value={form.watch("currentStatus") || salesOrder?.currentStatus || "IN-PROGRESS"}
                      onValueChange={(value) => form.setValue("currentStatus", value)}
                      disabled={updateSalesOrderMutation.isPending}
                    >
                      <SelectTrigger className="w-40 h-7 text-xs border-gray-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currentStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-xs">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Created By:</span>
                    <span className="text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                      {salesOrder?.createdByName || "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">Email Sent:</span>
                    <Switch 
                      checked={form.watch("plantEmailSent") || salesOrder?.plantEmailSent || false}
                      onCheckedChange={(checked) => form.setValue("plantEmailSent", checked)}
                      disabled={updateSalesOrderMutation.isPending}
                      className="scale-75"
                    />
                  </div>

                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="h-7 text-xs"
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Chat
                  </Button>

                  <Button
                    size="sm"
                    type="submit"
                    disabled={updateSalesOrderMutation.isPending}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 h-7 text-xs"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    {updateSalesOrderMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Content with Tabs */}
            <div className="flex-1 flex flex-col">
              <Tabs defaultValue="basic-info" className="flex-1 flex flex-col">
                <div className="px-2 pt-1">
                  <TabsList className="grid w-full grid-cols-4 h-8">
                    <TabsTrigger value="basic-info" className="text-xs">Basic Info</TabsTrigger>
                    <TabsTrigger value="compare-progen" className="text-xs">Compare Progen</TabsTrigger>
                    <TabsTrigger value="quotations" className="text-xs">Quotations</TabsTrigger>
                    <TabsTrigger value="save-history" className="text-xs">Save History</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 p-2 overflow-y-auto">
                  <TabsContent value="basic-info" className="space-y-2 mt-0">
                    {/* Approval Stages */}
                    {stagesLoading ? (
                      <div className="text-center py-2 text-xs">Loading...</div>
                    ) : (
                      <ApprovalButtons
                        salesOrderId={salesOrderId}
                        stages={stages}
                        onStageUpdate={handleStageUpdate}
                        disabled={updateSalesOrderMutation.isPending}
                      />
                    )}

                      {/* SO Info Accordion */}
                      <Accordion type="single" collapsible defaultValue="so-info" className="w-full">
                        <AccordionItem value="so-info" className="border rounded-md">
                          <AccordionTrigger className="px-3 py-2 hover:no-underline">
                            <span className="text-sm font-semibold">SO Info</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-3 pb-3">
                            <SOInfoForm
                              control={form.control}
                              disabled={updateSalesOrderMutation.isPending}
                              onCustomerSelect={handleCustomerSelect}
                              onItemSelect={handleItemSelect}
                              onManufacturerSelect={handleManufacturerSelect}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      {/* Product Info Accordion */}
                      <Accordion type="single" collapsible defaultValue="product-info" className="w-full">
                        <AccordionItem value="product-info" className="border rounded-md">
                          <AccordionTrigger className="px-3 py-2 hover:no-underline">
                            <span className="text-sm font-semibold">Product Info</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-3 pb-3">
                            <ProductInfoForm
                              control={form.control}
                              disabled={updateSalesOrderMutation.isPending}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                    {/* Reference Documents Accordion */}
                    <Accordion type="single" collapsible defaultValue="documents" className="w-full">
                      <AccordionItem value="documents" className="border rounded-md">
                        <AccordionTrigger className="px-3 py-2 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-2">
                            <span className="text-sm font-semibold">Reference Documents</span>
                            {!documentsLoading && documents.length > 0 && (
                              <Badge variant="outline" className="text-xs h-5">
                                {documents.length} file{documents.length !== 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3">
                          <ReferenceDocuments
                            salesOrderId={salesOrderId}
                            disabled={updateSalesOrderMutation.isPending}
                            documents={documents}
                            isLoading={documentsLoading}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>

                  <TabsContent value="compare-progen" className="mt-0">
                    <div>
                      <h3 className="text-sm font-semibold">Compare With Progen</h3>
                      <p className="text-sm text-muted-foreground">Compare With Progen functionality will be implemented here.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="quotations" className="mt-0">
                    <div>
                      <h3 className="text-sm font-semibold">Quotations</h3>
                      <p className="text-sm text-muted-foreground">Quotations functionality will be implemented here.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="save-history" className="mt-0">
                    <div>
                      <h3 className="text-sm font-semibold">Save History</h3>
                      <p className="text-sm text-muted-foreground">Save History functionality will be implemented here.</p>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </form>
        </FormProvider>
      </div>

      {/* Chat Sidebar - Toggleable with slide animation */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isChatOpen ? 'w-80' : 'w-0'
        } overflow-hidden`}
      >
        <ChatSidebar
          messages={transformedChatMessages}
          onSendMessage={handleSendMessage}
          onClose={handleChatClose}
          disabled={updateSalesOrderMutation.isPending}
        />
      </div>
    </div>
  );
}

