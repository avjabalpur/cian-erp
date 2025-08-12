"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Calculator, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuotationById, useCreateQuotation } from "@/hooks/quotation/use-quotations";
import { useItemById } from "@/hooks/items/use-items";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { useManufacturerOptions } from "@/components/shared/options/manufacturer-options";
import { CompanyDetails } from "@/lib/utils/sales-order-utils";
import { useRouter } from "next/navigation";
import { FormTextArea } from "@/components/shared/forms/form-text-area";
import { quotationSchema, type QuotationFormData } from "@/validations/quotation";

interface QuotationContentProps {
  quotationId: number | null;
  isPageMode?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function QuotationContent({
  quotationId,
  isPageMode = false,
  onClose,
  onSuccess
}: QuotationContentProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<string>("CIAN HEALTHCARE");
  const [productId, setProductId] = useState("");
  
  // Get manufacturer options
  const manufacturerOptions = useManufacturerOptions({
    includeDefault: true,
    defaultLabel: "Select Company",
    defaultValue: "-1",
  });

  // Handle company selection change
  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
    // Find the company name from the options
    const selectedOption = manufacturerOptions.find(option => option.value === value);
    if (selectedOption && selectedOption.label !== "Select Company") {
      setSelectedCompany(selectedOption.label);
    }
  };
  
  // Get quotation data if editing
  const { data: quotationData, isLoading: isLoadingQuotation } = useQuotationById(
    quotationId?.toString() || "0"
  );
  
  const createQuotationMutation = useCreateQuotation();

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      items: [],
      charges: {
        inventoryCharges: 0,
        inventoryChargesTaxPercent: 0,
      },
      advancePercentage: 50,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Ensure there's always at least one item
  useEffect(() => {
    if (fields.length === 0) {
      append({
        id: "1",
        productName: "",
        composition: "",
        dosageName: "TABLET",
        productCast: "",
        pPackShort: "",
        soStatus: "",
        pQuantity: 1,
        pFocQty: 0,
        pMrp: 0,
        pBillingRate: 0,
        comments: "",
        taxPercent: 18,
        productExtraCharges: 0,
        productExtraChargesTaxPercent: 0,
      });
    }
  }, [fields.length, append]);

  // Load quotation data when editing
  useEffect(() => {
    if (quotationData && quotationId) {
      // Transform quotation data to form format
      const items = quotationData.products?.map((product: any, index: number) => ({
        id: (index + 1).toString(),
        salesOrderApprovalId: product.sales_order_approval_id,
        productName: product.product_name || "",
        composition: product.composition || "",
        dosageName: product.dosage_name || "TABLET",
        productCast: product.product_cast || "",
        pPackShort: product.p_pack_short || "",
        soStatus: product.so_status || "",
        pQuantity: product.p_quantity || 1,
        pFocQty: product.p_foc_qty || 0,
        pMrp: product.p_mrp || 0,
        pBillingRate: product.p_billing_rate || 0,
        comments: product.comments || "",
        taxPercent: product.tax_percent || 18,
        productExtraCharges: product.product_extra_charges || 0,
        productExtraChargesTaxPercent: product.product_extra_charges_tax_percent || 0,
      })) || [];

      form.reset({
        companyName: quotationData.organizationName || "CIAN HEALTHCARE",
        quotationNumber: quotationData.quotationNumber || "",
        quotationDate: quotationData.quotationDate || new Date().toISOString().split('T')[0],
        customerName: quotationData.customerName || "",
        advancePercentage: quotationData.advancePercentage || 50,
        items: items.length > 0 ? items : [],
        charges: quotationData.charges ? JSON.parse(quotationData.charges) : {
          inventoryCharges: 0,
          inventoryChargesTaxPercent: 0,
        },
      });

      setSelectedCompany(quotationData.organizationName || "CIAN HEALTHCARE");
    }
  }, [quotationData, quotationId, form]);

  // Generate quotation number
  useEffect(() => {
    if (!quotationId) {
      const currentDate = new Date();
      const yearMonth = currentDate.toISOString().slice(2, 7).replace('-', '');
      const randomId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const quotationNumber = `QTD-${yearMonth}-${randomId}`;
      form.setValue("quotationNumber", quotationNumber);
    }
  }, [quotationId, form]);

  const addItem = () => {
    const newItem = {
      id: (fields.length + 1).toString(),
      productName: "",
      composition: "",
      dosageName: "TABLET",
      productCast: "",
      pPackShort: "",
      soStatus: "",
      pQuantity: 1,
      pFocQty: 0,
      pMrp: 0,
      pBillingRate: 0,
      comments: "",
      taxPercent: 18,
      productExtraCharges: 0,
      productExtraChargesTaxPercent: 0,
    };

    append(newItem);
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast({
        title: "Warning",
        description: "At least one item is required",
        variant: "destructive",
      });
    }
  };

  const handleAddProduct = async () => {
    if (!productId.trim()) return;

    try {
      const itemId = parseInt(productId, 10);
      if (isNaN(itemId)) {
        toast({
          title: "Error",
          description: "Please enter a valid Product ID",
          variant: "destructive",
        });
        return;
      }

      // Fetch product details
      const response = await fetch(`/api/items/${itemId}`);
      if (!response.ok) {
        throw new Error("Product not found");
      }
      
      const productData = await response.json();
      
      const newItem = {
        id: (fields.length + 1).toString(),
        salesOrderApprovalId: itemId,
        productName: productData.itemName || "",
        composition: productData.activeIngredient || "",
        dosageName: productData.productType || "TABLET",
        productCast: productData.productGroup || "",
        pPackShort: productData.desiredPackSize || "",
        soStatus: "",
        pQuantity: 1,
        pFocQty: 0,
        pMrp: productData.stdRate || 0,
        pBillingRate: productData.stdRate || 0,
        comments: "",
        taxPercent: 18,
        productExtraCharges: 0,
        productExtraChargesTaxPercent: 0,
      };

      append(newItem);
      setProductId("");
      
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to fetch product details",
        variant: "destructive",
      });
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const items = form.watch("items") || [];
    const charges = form.watch("charges") || { inventoryCharges: 0, inventoryChargesTaxPercent: 0 };
    const advancePercentage = form.watch("advancePercentage") || 0;
    
    let productAmount = 0;
    let productTax = 0;
    
    if (Array.isArray(items)) {
      items.forEach(item => {
        if (item && typeof item === 'object') {
          const itemTotal = (item.pQuantity || 0) * (item.pBillingRate || 0);
          const itemTax = (itemTotal * (item.taxPercent || 0)) / 100;
          const extraCharges = item.productExtraCharges || 0;
          const extraChargesTax = (extraCharges * (item.productExtraChargesTaxPercent || 0)) / 100;
          
          productAmount += itemTotal + extraCharges;
          productTax += itemTax + extraChargesTax;
        }
      });
    }

    const inventoryCharges = charges.inventoryCharges || 0;
    const inventoryTax = (inventoryCharges * (charges.inventoryChargesTaxPercent || 0)) / 100;
    
    const totalAmount = productAmount + productTax + inventoryCharges + inventoryTax;
    const advanceAmount = (totalAmount * advancePercentage) / 100;

    return {
      productAmount,
      productTax,
      inventoryCharges,
      inventoryTax,
      totalAmount,
      advanceAmount,
    };
  };

  const totals = calculateTotals();

  const onSubmit = async (data: QuotationFormData) => {
    try {
      // Ensure we have items
      if (!data.items || data.items.length === 0) {
        toast({
          title: "Error",
          description: "At least one item is required",
          variant: "destructive",
        });
        return;
      }

      const payload = {
        company_name: data.companyName,
        quotation_number: data.quotationNumber,
        quotation_date: data.quotationDate,
        customer_name: data.customerName,
        contact_person: data.contactPerson || "",
        mobile_no: data.mobileNo || "",
        email_id: data.emailId || "",
        payment_term: data.paymentTerm || "",
        prepared_by: data.preparedBy || "",
        final_comment: data.finalComment || "",
        advance_percentage: data.advancePercentage,
        charges: JSON.stringify(data.charges),
        total_amount: totals.totalAmount,
        advance_amount: totals.advanceAmount,
        products: data.items.map(item => ({
          sales_order_approval_id: item.salesOrderApprovalId || 0,
          product_name: item.productName,
          composition: item.composition || "",
          dosage_name: item.dosageName || "TABLET",
          product_cast: item.productCast || "",
          p_pack_short: item.pPackShort || "",
          so_status: item.soStatus || "",
          p_quantity: item.pQuantity,
          p_foc_qty: item.pFocQty || 0,
          p_mrp: item.pMrp || 0,
          p_billing_rate: item.pBillingRate,
          comments: item.comments || "",
          tax_percent: item.taxPercent,
          product_extra_charges: item.productExtraCharges || 0,
          product_extra_charges_tax_percent: item.productExtraChargesTaxPercent || 0,
        })),
      };

      const result = await createQuotationMutation.mutateAsync(payload);
      
      toast({
        title: "Success",
        description: quotationId ? "Quotation updated successfully" : "Quotation created successfully",
      });

      if (onSuccess) {
        onSuccess();
      } else if (isPageMode) {
        router.push('/quotations');
      } else {
        onClose?.();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save quotation",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (isPageMode) {
      router.push('/quotations');
    } else {
      onClose?.();
    }
  };

  const companyDetails = CompanyDetails[selectedCompany as keyof typeof CompanyDetails] || CompanyDetails.CIAN;
  const isLoading = createQuotationMutation.isPending || isLoadingQuotation;

  if (isLoadingQuotation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quotation details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 max-w-full overflow-x-auto">
          {/* Company Header - More Compact */}
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50 py-3">
              <div className="text-center">
                <h2 className="text-xl font-bold text-blue-900">Quotation</h2>
                <h3 className="text-lg font-semibold text-blue-800">{companyDetails.name}</h3>
                <div className="text-xs text-blue-700 mt-1 space-y-1">
                  <div><strong>Corporate Office:</strong> {companyDetails.address}</div>
                  <div className="flex justify-center gap-6">
                    <span><strong>Phone:</strong> {companyDetails.phone}</span>
                    <span><strong>Email:</strong> {companyDetails.email}</span>
                    <span><strong>Website:</strong> {companyDetails.website}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><strong>IDBI Bank:</strong> {companyDetails.account_details.account_number}</div>
                <div><strong>IFSC:</strong> {companyDetails.account_details.ifsc_code}</div>
                <div><strong>Branch:</strong> {companyDetails.account_details.branch}</div>
              </div>
            </CardContent>
          </Card>

          {/* Product Addition Section - More Compact */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Add Product</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label htmlFor="productId" className="text-sm">Product/Item ID</Label>
                  <Input
                    id="productId"
                    placeholder="Enter Product ID"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={handleAddProduct}
                  disabled={!productId.trim()}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quotation Details - More Compact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-3">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="companyName" className="text-sm">Company Name</Label>
                    <Select
                      value={selectedCompany}
                      onValueChange={handleCompanyChange}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Company" />
                      </SelectTrigger>
                      <SelectContent>
                        {manufacturerOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <FormInput
                    control={form.control}
                    name="quotationNumber"
                    label="Quo.No"
                    disabled
                  />
                  
                  <FormInput
                    control={form.control}
                    name="customerName"
                    label="Customer Name"
                    placeholder="Customer Name"
                  />
                  
                  <FormInput
                    control={form.control}
                    name="contactPerson"
                    label="Contact Person"
                    placeholder="Contact Person"
                  />
                  
                  <FormInput
                    control={form.control}
                    name="paymentTerm"
                    label="Payment Term"
                    placeholder="Payment Terms"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-3">
                <div className="space-y-3">
                  <FormInput
                    control={form.control}
                    name="quotationDate"
                    label="Quo.date"
                    inputProps={{ type: "date" }}
                  />
                  
                  <FormInput
                    control={form.control}
                    name="mobileNo"
                    label="Mobile No."
                    placeholder="Mobile Number"
                  />
                  
                  <FormInput
                    control={form.control}
                    name="emailId"
                    label="Email Id"
                    placeholder="Email Address"
                    inputProps={{ type: "email" }}
                  />
                  
                  <FormInput
                    control={form.control}
                    name="preparedBy"
                    label="Prepared By"
                    placeholder="Prepared By"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Table - More Compact */}
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Products</CardTitle>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-10 text-xs">Id</TableHead>
                      <TableHead className="text-xs">Brand Name</TableHead>
                      <TableHead className="text-xs">Composition</TableHead>
                      <TableHead className="text-xs">P-Type</TableHead>
                      <TableHead className="text-xs">P-Cast</TableHead>
                      <TableHead className="text-xs">Packing</TableHead>
                      <TableHead className="text-xs">Flag</TableHead>
                      <TableHead className="text-xs">Qty</TableHead>
                      <TableHead className="text-xs">FOC</TableHead>
                      <TableHead className="text-xs">MRP</TableHead>
                      <TableHead className="text-xs">Rate</TableHead>
                      <TableHead className="text-xs">Total</TableHead>
                      <TableHead className="text-xs">Tax %</TableHead>
                      <TableHead className="text-xs">Tax</TableHead>
                      <TableHead className="text-xs">Charges</TableHead>
                      <TableHead className="text-xs">Tax %</TableHead>
                      <TableHead className="text-xs">Final Total</TableHead>
                      <TableHead className="text-xs">Comment</TableHead>
                      <TableHead className="w-10 text-xs">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const item = form.watch(`items.${index}`) || {};
                      const itemTotal = (item.pQuantity || 0) * (item.pBillingRate || 0);
                      const itemTax = (itemTotal * (item.taxPercent || 0)) / 100;
                      const extraCharges = item.productExtraCharges || 0;
                      const extraChargesTax = (extraCharges * (item.productExtraChargesTaxPercent || 0)) / 100;
                      const finalTotal = itemTotal + itemTax + extraCharges + extraChargesTax;

                      return (
                        <TableRow key={field.id}>
                          <TableCell className="text-xs">{index + 1}</TableCell>
                          <TableCell>
                            <Input
                              {...form.register(`items.${index}.productName`)}
                              placeholder="Product Name"
                              className="min-w-24 h-8 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              {...form.register(`items.${index}.composition`)}
                              placeholder="Composition"
                              className="min-w-24 h-8 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              {...form.register(`items.${index}.dosageName`)}
                              placeholder="Type"
                              className="min-w-20 h-8 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              {...form.register(`items.${index}.productCast`)}
                              placeholder="Cast"
                              className="min-w-20 h-8 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              {...form.register(`items.${index}.pPackShort`)}
                              placeholder="Packing"
                              className="min-w-20 h-8 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              {...form.register(`items.${index}.soStatus`)}
                              placeholder="Flag"
                              className="min-w-16 h-8 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              {...form.register(`items.${index}.pQuantity`, { valueAsNumber: true })}
                              className="min-w-16 h-8 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              {...form.register(`items.${index}.pFocQty`, { valueAsNumber: true })}
                              className="min-w-12 h-8 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              {...form.register(`items.${index}.pMrp`, { valueAsNumber: true })}
                              className="min-w-16 h-8 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              {...form.register(`items.${index}.pBillingRate`, { valueAsNumber: true })}
                              className="min-w-16 h-8 text-xs"
                            />
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            ₹{itemTotal.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              {...form.register(`items.${index}.taxPercent`, { valueAsNumber: true })}
                              className="min-w-12 h-8 text-xs"
                            />
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            ₹{itemTax.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              {...form.register(`items.${index}.productExtraCharges`, { valueAsNumber: true })}
                              className="min-w-16 h-8 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              {...form.register(`items.${index}.productExtraChargesTaxPercent`, { valueAsNumber: true })}
                              className="min-w-12 h-8 text-xs"
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium text-xs">
                            ₹{finalTotal.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Input
                              {...form.register(`items.${index}.comments`)}
                              placeholder="Comment"
                              className="min-w-20 h-8 text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeItem(index)}
                              disabled={fields.length === 1}
                              className="h-6 w-6 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Final Comments and Totals - More Compact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Final Comment</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <FormTextArea
                  label="Final Comment"
                  control={form.control}
                  name="finalComment"
                  rows={4}
                  className="min-h-24"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calculator className="h-4 w-4" />
                  Calculations
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="space-y-3">
                  {/* Inventory Charges */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm">Inventory Charges</Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...form.register("charges.inventoryCharges", { valueAsNumber: true })}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Tax %</Label>
                      <Input
                        type="number"
                        {...form.register("charges.inventoryChargesTaxPercent", { valueAsNumber: true })}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total:</span>
                      <span className="font-medium">₹{totals.totalAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 items-end">
                      <div>
                        <Label className="text-sm">Advance Payment %</Label>
                        <Input
                          type="number"
                          {...form.register("advancePercentage", { valueAsNumber: true })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Amount</div>
                        <div className="font-medium text-sm">₹{totals.advanceAmount.toFixed(2)}</div>
                      </div>
                    </div>

                    {/* Detailed breakdown */}
                    <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                      <div className="flex justify-between">
                        <span>Product Amount:</span>
                        <span>₹{totals.productAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Product Tax:</span>
                        <span>₹{totals.productTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Extra Charges:</span>
                        <span>₹{totals.inventoryCharges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Extra Charges Tax:</span>
                        <span>₹{totals.inventoryTax.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Actions - More Compact */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : quotationId ? "Update Quotation" : "Create Quotation"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
