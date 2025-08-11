"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ItemDetailPageProps {
  itemId: number;
}

export default function ItemDetailPage({ itemId }: ItemDetailPageProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Item Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item #{itemId}</CardTitle>
          <CardDescription>
            Detailed information about this item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Item detail page is under development. Item ID: {itemId}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
