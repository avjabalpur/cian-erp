"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { QuotationForm } from "@/components/quotations/quotation-form";

export default function CreateQuotationPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/quotations");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Quotation</h1>
          <p className="text-muted-foreground">
            Create a new sales quotation
          </p>
        </div>
      </div>

      {/* Quotation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quotation Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuotationForm />
        </CardContent>
      </Card>
    </div>
  );
}
