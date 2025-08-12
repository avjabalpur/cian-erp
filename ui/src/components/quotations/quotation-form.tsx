"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useCreateQuotation } from "@/hooks/quotations/use-create-quotation";
import { quotationSchema } from "@/validations/quotation";
import { QuotationProductTable } from "./quotation-product-table";
import { QuotationCharges } from "./quotation-charges";
import { QuotationSummary } from "./quotation-summary";
import { QuotationHeader } from "./quotation-header";
import { QuotationTerms } from "./quotation-terms";

export function QuotationForm() {
  const { toast } = useToast();
  const router = useRouter();
  const createQuotationMutation = useCreateQuotation();

  const [products, setProducts] = useState<any[]>([]);
  const [charges, setCharges] = useState<any[]>([]);

  const form = useForm({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      companyName: "CIAN",
      quotationNumber: "",
      quotationDate: new Date().toISOString().split('T')[0],
      customerName: "",
      customerContactPerson: "",
      customerMobileNumber: "",
      customerEmail: "",
      paymentTerms: "",
      advancePercentage: 50,
      finalComment: "",
      terms: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const quotationData = {
        ...data,
        products,
        charges,
        totalAmount: calculateTotalAmount(),
        advanceAmount: calculateAdvanceAmount(),
      };

      await createQuotationMutation.mutateAsync(quotationData);
      
      toast({
        title: "Success",
        description: "Quotation created successfully",
      });
      
      router.push("/quotations");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create quotation",
        variant: "destructive",
      });
    }
  };

  const calculateTotalAmount = () => {
    const productsTotal = products.reduce((sum, product) => sum + (product.total || 0), 0);
    const chargesTotal = charges.reduce((sum, charge) => sum + (charge.amount || 0), 0);
    return productsTotal + chargesTotal;
  };

  const calculateAdvanceAmount = () => {
    const total = calculateTotalAmount();
    const advancePercentage = form.watch("advancePercentage") || 0;
    return (total * advancePercentage) / 100;
  };

  const addProduct = () => {
    const newProduct = {
      id: Date.now(),
      productName: "",
      composition: "",
      dosageName: "",
      productCast: "",
      packShort: "",
      quantity: 0,
      focQty: 0,
      mrp: 0,
      billingRate: 0,
      taxPercent: 18,
      total: 0,
    };
    setProducts([...products, newProduct]);
  };

  const addCharges = () => {
    const newCharge = {
      id: Date.now(),
      description: "",
      amount: 0,
      taxPercent: 18,
      total: 0,
    };
    setCharges([...charges, newCharge]);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Company Header */}
      <QuotationHeader />

      {/* Quotation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Quotation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quotationNumber">Quotation Number</Label>
              <Input
                id="quotationNumber"
                {...form.register("quotationNumber")}
                placeholder="QTD-XXXX-XXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quotationDate">Quotation Date</Label>
              <Input
                id="quotationDate"
                type="date"
                {...form.register("quotationDate")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                {...form.register("customerName")}
                placeholder="Customer Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerContactPerson">Contact Person</Label>
              <Input
                id="customerContactPerson"
                {...form.register("customerContactPerson")}
                placeholder="Contact Person"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerMobileNumber">Mobile Number</Label>
              <Input
                id="customerMobileNumber"
                {...form.register("customerMobileNumber")}
                placeholder="Mobile Number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                {...form.register("customerEmail")}
                placeholder="Email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input
                id="paymentTerms"
                {...form.register("paymentTerms")}
                placeholder="Payment Terms"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advancePercentage">Advance Percentage</Label>
              <Input
                id="advancePercentage"
                type="number"
                {...form.register("advancePercentage", { valueAsNumber: true })}
                placeholder="50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Products</CardTitle>
            <Button type="button" onClick={addProduct} variant="outline">
              Add More Products
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <QuotationProductTable
            products={products}
            setProducts={setProducts}
          />
        </CardContent>
      </Card>

      {/* Charges */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Charges</CardTitle>
            <Button type="button" onClick={addCharges} variant="outline">
              Add Charges
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <QuotationCharges
            charges={charges}
            setCharges={setCharges}
          />
        </CardContent>
      </Card>

      {/* Final Comments and Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuotationTerms
          finalComment={form.watch("finalComment")}
          terms={form.watch("terms")}
          onFinalCommentChange={(value) => form.setValue("finalComment", value)}
          onTermsChange={(value) => form.setValue("terms", value)}
        />

        {/* Summary */}
        <QuotationSummary
          totalAmount={calculateTotalAmount()}
          advanceAmount={calculateAdvanceAmount()}
          advancePercentage={form.watch("advancePercentage") || 0}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={createQuotationMutation.isPending}
          className="bg-red-600 hover:bg-red-700"
        >
          {createQuotationMutation.isPending ? "Creating..." : "Create Quotation and Print"}
        </Button>
      </div>
    </form>
  );
}
