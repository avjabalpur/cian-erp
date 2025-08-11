"use client";

import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Save,
  MessageCircle
} from "lucide-react";
import { SalesOrder, UpdateSalesOrderData } from "@/types/sales-order";
import { useSalesOrderById } from "@/hooks/sales-order/use-sales-orders";
import { useUpdateSalesOrder } from "@/hooks/sales-order/use-sales-orders";
import { useCommentsBySalesOrder } from "@/hooks/sales-order/use-sales-order-comments";
import { useChatMessagesBySalesOrder } from "@/hooks/sales-order/use-sales-order-chat";
import { useDocumentsBySalesOrder } from "@/hooks/sales-order/use-sales-order-documents";
import { useSaveTransactionsBySalesOrder } from "@/hooks/sales-order/use-sales-order-transactions";
import { useSalesOrderStages } from "@/hooks/sales-order/use-sales-order-stages";
import { useQuotationsBySalesOrder } from "@/hooks/quotation/use-quotations";
import SalesOrderQuotationsTable from "../quotation/sales-order-quotations-table";
import { QuotationFormModal } from "../quotation/quotation-form-modal";
import { ApprovalButtons } from "./approval-buttons";
import { ReferenceDocuments } from "./reference-documents";
import { SOInfoForm } from "./so-info-form";
import { ProductInfoForm } from "./product-info-form";
import { ChatSidebar } from "./chat-sidebar";
import { useRouter } from "next/navigation";
import { currentStatusOptions } from "@/lib/utils/sales-order-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserLookup } from "@/components/shared/lookups/user-lookup";
import { FormLookup } from "@/components/shared/forms/form-lookup";
import { useUserById } from "@/hooks/use-users";
import { useCustomerById } from "@/hooks/customers/use-customers";
import { useItemById } from "@/hooks/items/use-items";
import { useCreateSalesOrderChatMessage } from "@/hooks/sales-order/use-sales-order-chat";
import { Input } from "@/components/ui/input";
import { useCreateSalesOrderComment } from "@/hooks/sales-order/use-sales-order-comments";
import { SalesOrderUpdateFormValues, salesOrderUpdateSchema } from "@/validations/sales-order";
import { SalesOrderChat, SalesOrderComment, SalesOrderDocument, SalesOrderSaveTransaction } from "@/types/sales-order-extended";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface SalesOrderApprovalContentProps {
  salesOrderId: number;
  isPageMode?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function SalesOrderApprovalContent({
  salesOrderId,
  isPageMode = false,
  onClose,
  onSuccess
}: SalesOrderApprovalContentProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const [userLookupOpen, setUserLookupOpen] = useState(false);
  const [quotationFormOpen, setQuotationFormOpen] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] = useState<number | null>(null);
  const { data: salesOrder, isLoading } = useSalesOrderById(salesOrderId.toString());
  const { data: chatMessages = [], isLoading: chatMessagesLoading } = useChatMessagesBySalesOrder(salesOrderId);
  const { data: comments = [], isLoading: commentsLoading } = useCommentsBySalesOrder(salesOrderId);
  const { data: documents = [], isLoading: documentsLoading } = useDocumentsBySalesOrder(salesOrderId);
  const { data: saveTransactions = [], isLoading: transactionsLoading } = useSaveTransactionsBySalesOrder(salesOrderId);
  const { data: quotations = [], isLoading: quotationsLoading } = useQuotationsBySalesOrder(salesOrderId);
  // Get approval stages for this sales order
  const { data: stages = [], isLoading: stagesLoading } = useSalesOrderStages(salesOrderId);
  
  const updateSalesOrderMutation = useUpdateSalesOrder();
  const queryClient = useQueryClient();

  const handleStageUpdate = () => {
    // Invalidate and refetch stages data
    queryClient.invalidateQueries({ queryKey: ['sales-order-stages', salesOrderId] });
    queryClient.invalidateQueries({ queryKey: ['sales-order-by-id', salesOrderId.toString()] });
  };

  const form = useForm<SalesOrderUpdateFormValues>({
    resolver: zodResolver(salesOrderUpdateSchema),
    defaultValues: {
      soNumber: "",
      soDate: "",
      soStatus: "REPEAT", // Default readonly value
      customerId: 0,
      dosageName: "-1", // Default value - will be populated from item lookup
      currentStatus: "IN-PROGRESS", // Default status
      assignedDesigner: 0, // Default assigned designer
      plantEmailSent: false,
      organizationId: "-1", // Default readonly value
    },
  });

    // Fetch assigned designer user data
  const assignedDesignerId = form.watch("assignedDesigner") || salesOrder?.assignedDesigner;
  const { data: assignedDesignerUser } = useUserById(assignedDesignerId?.toString() || "");
  
  // Fetch customer and item details when form is loaded with existing data
  const customerId = form.watch("customerId") || salesOrder?.customerId;
  const itemId = form.watch("itemId") || salesOrder?.itemId;
  
  const { data: customerDetails } = useCustomerById(customerId?.toString() || "");
  const { data: itemDetails } = useItemById(itemId || 0);
  
  // Handle customer selection from lookup
  const handleCustomerSelect = (selectedCustomer: any) => {
    console.log("Customer selected:", selectedCustomer);
    
    form.setValue("customerId", selectedCustomer.id);
    form.setValue("customerCode", selectedCustomer.customerCode || "");
    form.setValue("customerName", selectedCustomer.customerName || "");
    form.setValue("customerGstNo", selectedCustomer.gstNo || "");
    form.setValue("country", selectedCustomer.country || "");
    
    // Trigger form validation
    form.trigger(["customerId", "customerCode", "customerName"]);
    
    console.log("Form values after customer selection:", form.getValues());
  };

  // Handle item selection from lookup
  const handleItemSelect = (selectedItem: any) => {
    console.log("Item selected:", selectedItem);
    
    form.setValue("itemId", selectedItem.id);
    form.setValue("productCode", selectedItem.itemCode || "");
    form.setValue("productName", selectedItem.itemName || "");
    form.setValue("composition", selectedItem.composition || "");
         form.setValue("dosageName", selectedItem.dosageName || "-1");
    
    // Trigger form validation
    form.trigger(["itemId", "productCode", "productName"]);
    
    console.log("Form values after item selection:", form.getValues());
  };

  // Handle manufacturer selection from dropdown
  const handleManufacturerSelect = (selectedManufacturer: any) => {
    console.log("Manufacturer selected:", selectedManufacturer);
    
    if (selectedManufacturer && selectedManufacturer.country) {
      form.setValue("country", selectedManufacturer.country);
      console.log("Country auto-populated:", selectedManufacturer.country);
    }
    
    // Debug: Log the current form values
    console.log("Current form values after manufacturer selection:", form.getValues());
    console.log("Organization ID in form:", form.getValues("organizationId"));
  };

  // Handle user selection from lookup
  const handleUserSelect = (userId: number) => {
    console.log("User selected:", userId);
    
    form.setValue("assignedDesigner", userId);
    
    // Update the sales order data immediately for UI feedback
    if (salesOrder) {
      salesOrder.assignedDesigner = userId;
    }
    
    // Trigger form validation
    form.trigger(["assignedDesigner"]);
    
    console.log("Form values after user selection:", form.getValues());
  };

  // Get user display value for FormLookup
  const getUserDisplayValue = (userId: number | string) => {
    if (!userId || userId === 0) return "";
    
    // Use the fetched user data if available
    if (assignedDesignerUser && assignedDesignerUser.id === Number(userId)) {
      return `${assignedDesignerUser.firstName} ${assignedDesignerUser.lastName}`;
    }
    
    // Fallback to showing the user ID
    return `User ID: ${userId}`;
  };

    React.useEffect(() => {
    if (salesOrder) {
      form.reset({
        soNumber: salesOrder.soNumber || "",
        soDate: salesOrder.soDate || "",
        soStatus: salesOrder.soStatus || "REPEAT",
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
        // Set readonly field defaults
        customerName: salesOrder.customerName || "",
        customerCode: "", // Will be populated from customer lookup
        productName: "", // Will be populated from item lookup
        productCast: "", // Will be populated from item lookup
      });
    }
  }, [salesOrder, form]);
  
  // Populate customer and item details when they are fetched
  React.useEffect(() => {
    if (customerDetails && salesOrder?.customerId) {
      form.setValue("customerName", customerDetails.customerName || "");
      form.setValue("customerCode", customerDetails.customerCode || "");
      form.setValue("customerGstNo", customerDetails.gstin || "");
    }
  }, [customerDetails, salesOrder?.customerId, form]);
  
  React.useEffect(() => {
    if (itemDetails && salesOrder?.itemId) {
      form.setValue("productName", itemDetails.itemName || "");
      form.setValue("productCode", itemDetails.itemCode || "");
      form.setValue("composition", itemDetails.composition || "");
      form.setValue("dosageName", itemDetails.dosageName || "-1");
    }
  }, [itemDetails, salesOrder?.itemId, form]);

  // Transform chat messages for the chat sidebar
  const transformedChatMessages = chatMessages.map((chat: SalesOrderChat) => ({
    id: chat.id.toString(),
    message: chat.comment,
    sender: chat.createdByName || "Unknown User",
    timestamp: new Date(chat.createdAt),
  }));

  // Filter save transactions for this sales order
  const salesOrderTransactions = saveTransactions.filter(
    (transaction: SalesOrderSaveTransaction) => transaction.salesOrderId === salesOrderId
  );

  const onSubmit = async (values: SalesOrderUpdateFormValues) => {
    try {
      console.log("Form values before conversion:", values);
      console.log("Organization ID before conversion:", values.organizationId);
      console.log("Dosage Name before conversion:", values.dosageName);
      
      // Convert string values to numbers where needed
      const updateData = {
        ...values,
        customerId: values.customerId ? Number(values.customerId) : undefined,
        itemId: values.itemId ? Number(values.itemId) : undefined,
        organizationId: values.organizationId ? Number(values.organizationId) : undefined,
        divisionId: values.divisionId ? Number(values.divisionId) : undefined,
        assignedDesigner: values.assignedDesigner ? Number(values.assignedDesigner) : undefined,
      };
      
      console.log("Update data after conversion:", updateData);
      console.log("Organization ID after conversion:", updateData.organizationId);
      console.log("Dosage Name after conversion:", updateData.dosageName);

      await updateSalesOrderMutation.mutateAsync({
        id: salesOrderId.toString(),
        data: updateData as UpdateSalesOrderData,
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
    const url = `${window.location.origin}/sales-order-approval/${salesOrderId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Sales order link copied to clipboard",
    });
  };

  const handleClose = () => {
    if (isPageMode) {
      router.push('/sales-order-approval');
    } else {
      onClose?.();
    }
  };

  // Get the create chat message mutation
  const createChatMessageMutation = useCreateSalesOrderChatMessage();
  const createCommentMutation = useCreateSalesOrderComment();

  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        salesOrderId,
        data: {
          salesOrderId,
          comments: newComment,
          type: "comment",
          status: "pending",
        },
      });
      setNewComment("");
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      await createChatMessageMutation.mutateAsync({
        salesOrderId,
        data: {
          salesOrderId,
          comment: message
        }
      });
      
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleLastRead = () => {
    console.log("Last read clicked");
    // Handle last read logic here
  };

  const handleChatSettings = () => {
    console.log("Chat settings clicked");
    // Handle chat settings logic here
  };

  // Quotation handlers
  const handleCreateQuotation = () => {
    setSelectedQuotationId(null);
    setQuotationFormOpen(true);
  };

  const handleEditQuotation = (quotationId: number) => {
    setSelectedQuotationId(quotationId);
    setQuotationFormOpen(true);
  };

  const handleViewQuotation = (quotationId: number) => {
    window.open(`/quotations/${quotationId}`, '_blank');
  };

  const handleQuotationFormSuccess = (quotationId: number) => {
    setQuotationFormOpen(false);
    setSelectedQuotationId(null);
    toast({
      title: "Success",
      description: selectedQuotationId ? "Quotation updated successfully" : "Quotation created successfully",
    });
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
            <div className="border-b bg-gradient-to-r from-slate-50 to-gray-50 p-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-700">Current Status:</span>
                    <Select
                      value={form.watch("currentStatus") || salesOrder?.currentStatus || "IN-PROGRESS"}
                      onValueChange={(value) => {
                        form.setValue("currentStatus", value);
                        // Update the sales order data immediately for UI feedback
                        if (salesOrder) {
                          salesOrder.currentStatus = value;
                        }
                      }}
                      disabled={updateSalesOrderMutation.isPending}
                    >
                      <SelectTrigger className="w-48 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currentStatusOptions.map((option) => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            disabled={option.disabled}
                          >
                              {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">Assigned Designer:</span>
                    <div className="w-48">
                      <FormLookup
                        control={form.control}
                        name="assignedDesigner"
                        label=""
                        placeholder="Select Designer"
                        disabled={updateSalesOrderMutation.isPending}
                        onLookupClick={() => setUserLookupOpen(true)}
                        displayValue={(value) => getUserDisplayValue(value)}
                        className="space-y-0"
                        inputProps={{
                          className: "cursor-pointer hover:bg-blue-50 transition-colors border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white shadow-sm"
                        }}
                      />
                    </div>
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
                      onCheckedChange={(checked) => {
                        form.setValue("plantEmailSent", checked);
                        // Update the sales order data immediately for UI feedback
                        if (salesOrder) {
                          salesOrder.plantEmailSent = checked;
                        }
                      }}
                      disabled={updateSalesOrderMutation.isPending}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                    />
                  </div>

                  <Button
                    size="sm"
                    type="submit"
                    disabled={updateSalesOrderMutation.isPending}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateSalesOrderMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Content with Tabs */}
            <div className="flex-1 flex flex-col">
              <Tabs defaultValue="basic-info" className="border-0 flex-1 flex flex-col">
                <div className="px-3">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                    <TabsTrigger value="compare-progen">Compare With Progen</TabsTrigger>
                    <TabsTrigger value="quotations">Quotations</TabsTrigger>
                    <TabsTrigger value="performa-invoice">Performa Invoice</TabsTrigger>
                    <TabsTrigger value="save-history">Save History</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 p-3">
                  <TabsContent value="basic-info" className="space-y-3 h-full">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                      <CardHeader className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          Approval Stages
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        {stagesLoading ? (
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                            <p className="text-gray-600">Loading approval stages...</p>
                          </div>
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

                    <Card className="border-0 shadow-md bg-gradient-to-br from-slate-50 to-gray-50">
                      <CardHeader className="p-2 bg-gradient-to-r from-slate-600 to-gray-600 text-white rounded-t-lg">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          SO Info
                        </CardTitle>
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

                    <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-green-50">
                      <CardHeader className="p-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          Product Info
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <ProductInfoForm
                              control={form.control}
                              disabled={updateSalesOrderMutation.isPending}
                            />
                          </div>
                          
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
                      <CardHeader className="p-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          Reference Documents
                        </CardTitle>
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
                    <SalesOrderQuotationsTable
                      quotations={quotations}
                      salesOrderId={salesOrderId}
                      onView={(quotation) => handleViewQuotation(quotation.id)}
                      onEdit={(quotation) => handleEditQuotation(quotation.id)}
                      onCreate={handleCreateQuotation}
                    />
                  </TabsContent>

                  <TabsContent value="performa-invoice">
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-muted-foreground">Performa Invoice functionality will be implemented here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="save-history">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50">
                      <CardHeader className="p-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          Save History
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        {transactionsLoading ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto mb-3"></div>
                            <p className="text-gray-600">Loading save history...</p>
                          </div>
                        ) : salesOrderTransactions.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground bg-white rounded-lg border border-gray-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                              <div className="w-8 h-8 bg-violet-200 rounded-full flex items-center justify-center">
                                <div className="w-4 h-4 bg-violet-400 rounded-full"></div>
                              </div>
                            </div>
                            <p className="text-lg font-medium text-gray-500">No save history found</p>
                            <p className="text-sm text-gray-400">Changes will appear here when you save</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {salesOrderTransactions.map((transaction: SalesOrderSaveTransaction) => (
                              <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold text-gray-800 bg-violet-100 px-3 py-1 rounded-full">
                                    {transaction.createdByName || "Unknown User"}
                                  </span>
                                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                    {new Date(transaction.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                {transaction.diff && (
                                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-violet-200">
                                    <pre className="whitespace-pre-wrap font-mono text-xs">
                                      {transaction.diff}
                                    </pre>
                                  </div>
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

       {/* User Lookup Modal */}
       <UserLookup
         isOpen={userLookupOpen}
         onClose={() => setUserLookupOpen(false)}
         onSelect={handleUserSelect}
         title="Select Assigned Designer"
       />

       {/* Quotation Form Modal */}
       <QuotationFormModal
         isOpen={quotationFormOpen}
         onClose={() => setQuotationFormOpen(false)}
         onSuccess={handleQuotationFormSuccess}
         quotationId={selectedQuotationId}
       />
     </div>
   );
 } 