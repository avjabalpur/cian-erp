"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { QuotationTable } from "@/components/quotations/quotation-table";
import { QuotationFilters } from "@/components/quotations/quotation-filters";

export default function QuotationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateQuotation = () => {
    router.push("/quotations/create");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">
            Manage and create sales quotations
          </p>
        </div>
        <Button onClick={handleCreateQuotation} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Quotation
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <QuotationFilters />
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search quotations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-80"
            />
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Quotations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuotationTable searchQuery={searchQuery} />
        </CardContent>
      </Card>
    </div>
  );
}
