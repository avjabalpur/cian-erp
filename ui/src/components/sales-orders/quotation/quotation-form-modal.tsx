"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Calculator, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuotationById, useCreateQuotation } from "@/hooks/quotation/use-quotations";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { CompanyDetails } from "@/lib/utils/sales-order-utils";
import { FormTextArea } from "@/components/shared/forms/form-text-area";

// Product line item schema
const quotationItemSchema = z.object({
  id: z.string().optional(),
  salesOrderApprovalId: z.number().optional(),
  productName: z.string().min(1, "Product name is required"),
  composition: z.string().optional(),
  dosageName: z.string().optional(),
  productCast: z.string().optional(),
  pPackShort: z.string().optional(),
  soStatus: z.string().optional(),
  pQuantity: z.number().min(1, "Quantity must be greater than 0"),
  pFocQty: z.number().optional(),
  pMrp: z.number().optional(),
  pBillingRate: z.number().min(0, "Billing rate must be greater than or equal to 0"),
  comments: z.string().optional(),
  taxPercent: z.number().min(0).max(100).default(0),
  productExtraCharges: z.number().default(0),
  productExtraChargesTaxPercent: z.number().min(0).max(100).default(0),
});

// Main quotation schema
const quotationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  quotationNumber: z.string().min(1, "Quotation number is required"),
  quotationDate: z.string().min(1, "Quotation date is required"),
  customerName: z.string().min(1, "Customer name is required"),
  contactPerson: z.string().optional(),
  paymentTerm: z.string().optional(),
  mobileNo: z.string().optional(),
  emailId: z.string().optional(),
  preparedBy: z.string().optional(),
  finalComment: z.string().optional(),
  advancePercentage: z.number().min(0).max(100).default(0),
  items: z.array(quotationItemSchema).min(1, "At least one item is required"),
  charges: z.object({
    inventoryCharges: z.number().default(0),
    inventoryChargesTaxPercent: z.number().default(0),
  }).optional(),
});

type QuotationFormData = z.infer<typeof quotationSchema>;

interface QuotationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (quotationId: number) => void;
  quotationId?: number | null;
}

export function QuotationFormModal({
  isOpen,
  onClose,
  onSuccess,
  quotationId,
}: QuotationFormModalProps) {
  const { toast } = useToast();
  const [selectedCompany, setSelectedCompany] = useState<string>("CIAN HEALTHCARE");
  
  // Get quotation data if editing
  const { data: quotationData, isLoading: isLoadingQuotation } = useQuotationById(
    quotationId?.toString() || "0"
  );
  
  const createQuotationMutation = useCreateQuotation();

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      companyName: "CIAN HEALTHCARE",
      quotationNumber: "",
      quotationDate: new Date().toISOString().split('T')[0],
      customerName: "",
      contactPerson: "",
      paymentTerm: "",
      mobileNo: "",
      emailId: "",
      preparedBy: "",
      finalComment: `Validity of the Offer rate : 7 days

Transportation from the manufacturing site to the destination will be borne by the customer.
If goods are called to Pune Depot the good will be sent by us then the transportation from manufacturing to Pune Depot will be added to the invoice.

Terms
Terms about proceeding manufacturing plan for new product (first time delivery product) and old product.
We Will calculate our manufacturing plan day with the following facts.

1. Sending final quotation to customer.
2. Finalization of Artwork (For new Product)
3. Advance Payment clearance
4. After receiving approval from Drug Office (new product)
5. On hold product due to non-clearing`,
      advancePercentage: 50,
      items: [
        {
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
        }
      ],
      charges: {
        inventoryCharges: 0,
        inventoryChargesTaxPercent: 18,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

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
        items: items.length > 0 ? items : form.getValues("items"),
        charges: quotationData.charges ? JSON.parse(quotationData.charges) : form.getValues("charges"),
      });

      setSelectedCompany(quotationData.organizationName || "CIAN HEALTHCARE");
    }
  }, [quotationData, quotationId, form]);

  // Generate quotation number
  useEffect(() => {
    if (isOpen && !quotationId) {
      const currentDate = new Date();
      const yearMonth = currentDate.toISOString().slice(2, 7).replace('-', '');
      const randomId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const quotationNumber = `QTD-${yearMonth}-${randomId}`;
      form.setValue("quotationNumber", quotationNumber);
    }
  }, [isOpen, quotationId, form]);

  const addItem = () => {
    append({
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
    });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const items = form.watch("items");
    const charges = form.watch("charges");
    const advancePercentage = form.watch("advancePercentage");
    
    let productAmount = 0;
    let productTax = 0;
    
    items.forEach(item => {
      const itemTotal = item.pQuantity * item.pBillingRate;
      const itemTax = (itemTotal * item.taxPercent) / 100;
      const extraCharges = item.productExtraCharges || 0;
      const extraChargesTax = (extraCharges * item.productExtraChargesTaxPercent) / 100;
      
      productAmount += itemTotal + extraCharges;
      productTax += itemTax + extraChargesTax;
    });

    const inventoryCharges = charges?.inventoryCharges || 0;
    const inventoryTax = (inventoryCharges * (charges?.inventoryChargesTaxPercent || 0)) / 100;
    
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

      onSuccess(result.quotation_id || quotationId || 0);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save quotation",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const companyDetails = CompanyDetails[selectedCompany as keyof typeof CompanyDetails] || CompanyDetails.CIAN;

  const isLoading = createQuotationMutation.isPending || isLoadingQuotation;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {quotationId ? "Edit Quotation" : "Create New Quotation"}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Header */}
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-blue-900">Quotation</h2>
                  <h3 className="text-xl font-semibold text-blue-800">{companyDetails.name}</h3>
                  <div className="text-sm text-blue-700 mt-2">
                    <div><strong>Corporate Office:</strong> {companyDetails.address}</div>
                    <div className="flex justify-center gap-4 mt-1">
                      <span><strong>Phone:</strong> {companyDetails.phone}</span>
                      <span><strong>Email:</strong> {companyDetails.email}</span>
                      <span><strong>Website:</strong> {companyDetails.website}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>IDBI Bank Current Account A/c No.:</strong> {companyDetails.account_details.account_number}
                  </div>
                  <div>
                    <strong>IFSC Code:</strong> {companyDetails.account_details.ifsc_code}
                  </div>
                  <div>
                    <strong>Branch:</strong> {companyDetails.account_details.branch}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quotation Details */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {/* <FormSelect
                      control={form.control}
                      name="companyName"
                      label="Company Name"
                      options={manufacturerOptions}
                      onValueChange={(value) => setSelectedCompany(value)}
                    /> */}
                    
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
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <FormInput
                      control={form.control}
                      name="quotationDate"
                      label="Quo.date"
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

            {/* Products Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Products</CardTitle>
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
                        <TableHead className="w-12">Id</TableHead>
                        <TableHead>Brand Name</TableHead>
                        <TableHead>Composition</TableHead>
                        <TableHead>P-Type</TableHead>
                        <TableHead>P-Cast</TableHead>
                        <TableHead>Packing</TableHead>
                        <TableHead>Flag</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>FOC</TableHead>
                        <TableHead>MRP</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Tax %</TableHead>
                        <TableHead>Tax</TableHead>
                        <TableHead>Cylinder Charges</TableHead>
                        <TableHead>Tax</TableHead>
                        <TableHead>Final Total</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead className="w-12">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => {
                        const item = form.watch(`items.${index}`);
                        const itemTotal = item.pQuantity * item.pBillingRate;
                        const itemTax = (itemTotal * item.taxPercent) / 100;
                        const extraCharges = item.productExtraCharges || 0;
                        const extraChargesTax = (extraCharges * item.productExtraChargesTaxPercent) / 100;
                        const finalTotal = itemTotal + itemTax + extraCharges + extraChargesTax;

                        return (
                          <TableRow key={field.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Input
                                {...form.register(`items.${index}.productName`)}
                                placeholder="Product Name"
                                className="min-w-32"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                {...form.register(`items.${index}.composition`)}
                                placeholder="Composition"
                                className="min-w-32"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                {...form.register(`items.${index}.dosageName`)}
                                placeholder="Type"
                                className="min-w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                {...form.register(`items.${index}.productCast`)}
                                placeholder="Cast"
                                className="min-w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                {...form.register(`items.${index}.pPackShort`)}
                                placeholder="Packing"
                                className="min-w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                {...form.register(`items.${index}.soStatus`)}
                                placeholder="Flag"
                                className="min-w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                {...form.register(`items.${index}.pQuantity`, { valueAsNumber: true })}
                                className="min-w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                {...form.register(`items.${index}.pFocQty`, { valueAsNumber: true })}
                                className="min-w-16"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                {...form.register(`items.${index}.pMrp`, { valueAsNumber: true })}
                                className="min-w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                {...form.register(`items.${index}.pBillingRate`, { valueAsNumber: true })}
                                className="min-w-20"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              ₹{itemTotal.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                {...form.register(`items.${index}.taxPercent`, { valueAsNumber: true })}
                                className="min-w-16"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              ₹{itemTax.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                {...form.register(`items.${index}.productExtraCharges`, { valueAsNumber: true })}
                                className="min-w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                {...form.register(`items.${index}.productExtraChargesTaxPercent`, { valueAsNumber: true })}
                                className="min-w-16"
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ₹{finalTotal.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Input
                                {...form.register(`items.${index}.comments`)}
                                placeholder="Comment"
                                className="min-w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeItem(index)}
                                disabled={fields.length === 1}
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

            {/* Final Comments and Totals */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Final Comment</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormTextArea
                    control={form.control}
                    name="finalComment"
                    rows={8}
                    className="min-h-32" label={"Final Comment"}  
                                    />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Calculations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Inventory Charges */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Inventory Charges</Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...form.register("charges.inventoryCharges", { valueAsNumber: true })}
                        />
                      </div>
                      <div>
                        <Label>Tax %</Label>
                        <Input
                          type="number"
                          {...form.register("charges.inventoryChargesTaxPercent", { valueAsNumber: true })}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">₹{totals.totalAmount.toFixed(2)}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 items-end">
                        <div>
                          <Label>Advance Payment %</Label>
                          <Input
                            type="number"
                            {...form.register("advancePercentage", { valueAsNumber: true })}
                          />
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Amount</div>
                          <div className="font-medium">₹{totals.advanceAmount.toFixed(2)}</div>
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

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : quotationId ? "Update Quotation" : "Create Quotation and Print"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
