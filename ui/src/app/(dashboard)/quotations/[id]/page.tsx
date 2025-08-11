"use client";

import { useParams } from "next/navigation";
import { QuotationFormModal } from "@/components/sales-orders/quotation";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuotationPage() {
  const params = useParams();
  const router = useRouter();
  const quotationId = parseInt(params.id as string);
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    router.push("/quotations");
  };

  const handleSuccess = () => {
    router.push("/quotations");
  };

  return (
    <QuotationFormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSuccess={handleSuccess}
      quotationId={quotationId}
    />
  );
}
