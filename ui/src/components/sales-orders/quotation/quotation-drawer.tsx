"use client";

import { RightDrawer } from "@/components/shared/right-drawer";
import { QuotationContent } from "./quotation-content";

interface QuotationDrawerProps {
  quotationId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function QuotationDrawer({
  quotationId,
  isOpen,
  onClose,
  onSuccess
}: QuotationDrawerProps) {
  const title = quotationId 
    ? `Edit Quotation | ${quotationId}` 
    : "Create New Quotation";

  return (
    <RightDrawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title} 
      size="full"
    >
      <QuotationContent
        quotationId={quotationId}
        isPageMode={false}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </RightDrawer>
  );
}
