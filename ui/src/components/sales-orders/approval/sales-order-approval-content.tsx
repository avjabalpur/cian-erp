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
  Copy,
  User,
  Settings,
  ArrowLeft,
  X
} from "lucide-react";
import { SalesOrder, UpdateSalesOrderData } from "@/types/sales-order";
import { useSalesOrderById } from "@/hooks/sales-order/use-sales-orders";
import { useUpdateSalesOrder } from "@/hooks/sales-order/use-sales-orders";
import { useCommentsBySalesOrder } from "@/hooks/sales-order/use-sales-order-comments";
import { useChatMessagesBySalesOrder } from "@/hooks/sales-order/use-sales-order-chat";
import { useDocumentsBySalesOrder } from "@/hooks/sales-order/use-sales-order-documents";
import { useSalesOrderSaveTransactions } from "@/hooks/sales-order/use-sales-order-transactions";
import { useToast } from "@/hooks/use-toast";
import { SalesOrderUpdateFormValues, salesOrderUpdateSchema } from "@/validations/sales-order";
import { SalesOrderChat, SalesOrderComment, SalesOrderDocument, SalesOrderSaveTransaction } from "@/types/sales-order-extended";
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
  
  // State for user lookup
  const [userLookupOpen, setUserLookupOpen] = useState(false);
  
  // Fetch sales order data
  const { data: salesOrder, isLoading } = useSalesOrderById(salesOrderId.toString());
  
  // Fetch related data
  const { data: comments = [], isLoading: commentsLoading } = useCommentsBySalesOrder(salesOrderId);
  const { data: chatMessages = [], isLoading: chatLoading } = useChatMessagesBySalesOrder(salesOrderId);
  const { data: documents = [], isLoading: documentsLoading } = useDocumentsBySalesOrder(salesOrderId);
  const { data: saveTransactions = [], isLoading: transactionsLoading } = useSalesOrderSaveTransactions();
  
  const updateSalesOrderMutation = useUpdateSalesOrder();

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

  // Mock approval data - in real app, this would come from API
  const approvalData = {
    costing: null as "approved" | "rejected" | "pending" | null,
    qa: null,
    finalAuthorization: null,
    designer: null,
    finalQa: null,
    pm: null,
  };


  const handleApprovalClick = (type: string) => {
    console.log(`Approval clicked: ${type}`);
    // Handle approval logic here
  };

  const handleUploadFile = () => {
    console.log("Upload file clicked");
    // Handle file upload logic here
  };

  const handleViewAttachedDocuments = () => {
    console.log("View attached documents clicked");
    // Handle view documents logic here
  };

  const handleSendMessage = (message: string) => {
    console.log("Send message:", message);
    // Handle send message logic here
  };

  const handleLastRead = () => {
    console.log("Last read clicked");
    // Handle last read logic here
  };

  const handleChatSettings = () => {
    console.log("Chat settings clicked");
    // Handle chat settings logic here
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
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  {/* Current Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Current Status:</span>
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
                      <SelectTrigger className="w-48">
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

                  {/* Assigned Designer Lookup */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Assigned Designer:</span>
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
                          className: "cursor-pointer hover:bg-muted/50 transition-colors"
                        }}
                      />
                    </div>
                  </div>

                  {/* Created By Info */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Created By:</span>
                    <span className="text-sm text-muted-foreground">
                      {salesOrder?.createdByName || "Unknown"}
                    </span>
                  </div>

                  {/* Email Sent Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Email Sent:</span>
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
                    />
                  </div>
                </div>

                {/* Save Button */}
                <Button
                  size="sm"
                  type="submit"
                  disabled={updateSalesOrderMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateSalesOrderMutation.isPending ? "Saving..." : "Save"}
                </Button>
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
                  <TabsContent value="basic-info" className="space-y-2 h-full">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">Approval Stages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ApprovalButtons
                          approvals={approvalData}
                          onApprovalClick={handleApprovalClick}
                          disabled={updateSalesOrderMutation.isPending}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">SO Info</CardTitle>
                      </CardHeader>
                      <CardContent>
                                                 <SOInfoForm
                           control={form.control}
                           disabled={updateSalesOrderMutation.isPending}
                           onCustomerSelect={handleCustomerSelect}
                           onItemSelect={handleItemSelect}
                           onManufacturerSelect={handleManufacturerSelect}
                         />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">Product Info</CardTitle>
                      </CardHeader>
                      <CardContent>
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
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">Reference Documents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ReferenceDocuments
                          onUploadFile={handleUploadFile}
                          onViewAttachedDocuments={handleViewAttachedDocuments}
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

                  <TabsContent value="performa-invoice">
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-muted-foreground">Performa Invoice functionality will be implemented here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="save-history">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">Save History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {transactionsLoading ? (
                          <div className="text-center py-4">Loading save history...</div>
                        ) : salesOrderTransactions.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No save history found for this sales order.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {salesOrderTransactions.map((transaction: SalesOrderSaveTransaction) => (
                              <div key={transaction.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">
                                    {transaction.createdByName || "Unknown User"}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(transaction.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                {transaction.diff && (
                                  <div className="text-sm text-muted-foreground">
                                    <pre className="whitespace-pre-wrap bg-muted p-2 rounded">
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
     </div>
   );
 } 