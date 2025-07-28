"use client";

import { useParams } from "next/navigation";
import { SalesOrderDetails } from "@/components/sales-orders/sales-order-details";

export default function SalesOrderDetailsPage() {
  const params = useParams();
  const salesOrderId = params.id as string;

  return <SalesOrderDetails salesOrderId={parseInt(salesOrderId)} />;
} 