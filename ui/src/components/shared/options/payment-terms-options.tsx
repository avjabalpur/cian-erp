"use client";

interface PaymentTermOption {
  label: string;
  value: string;
}

interface UsePaymentTermsOptionsProps {
  includeDefault?: boolean;
  defaultLabel?: string;
  defaultValue?: string;
}

export function usePaymentTermsOptions({
  includeDefault = true,
  defaultLabel = "Select payment term",
  defaultValue = "-1",
}: UsePaymentTermsOptionsProps = {}): PaymentTermOption[] {
  let options: PaymentTermOption[] = [];

  // Add default option if requested
  if (includeDefault) {
    options.push({
      label: defaultLabel,
      value: defaultValue,
    });
  }

  // Common payment terms
  const paymentTerms: PaymentTermOption[] = [
    { label: "Net 30", value: "NET30" },
    { label: "Net 45", value: "NET45" },
    { label: "Net 60", value: "NET60" },
    { label: "Net 90", value: "NET90" },
    { label: "Cash on Delivery", value: "COD" },
    { label: "Advance Payment", value: "ADVANCE" },
    { label: "Letter of Credit", value: "LC" },
    { label: "Bank Transfer", value: "BANK_TRANSFER" },
    { label: "Cheque", value: "CHEQUE" },
    { label: "Credit Card", value: "CREDIT_CARD" },
    { label: "Debit Card", value: "DEBIT_CARD" },
    { label: "UPI", value: "UPI" },
    { label: "Digital Wallet", value: "DIGITAL_WALLET" },
  ];

  return [...options, ...paymentTerms];
}

// Static options for common use cases
export const getPaymentTermsOptions = (): PaymentTermOption[] => {
  return [
    { label: "Select payment term", value: "-1" },
    { label: "Net 30", value: "NET30" },
    { label: "Net 45", value: "NET45" },
    { label: "Net 60", value: "NET60" },
    { label: "Cash on Delivery", value: "COD" },
    { label: "Advance Payment", value: "ADVANCE" },
  ];
};

// Component for direct use in forms
export function PaymentTermsOptions({ 
  includeDefault = true,
  defaultLabel = "Select payment term",
  defaultValue = "",
}: UsePaymentTermsOptionsProps) {
  const options = usePaymentTermsOptions({
    includeDefault,
    defaultLabel,
    defaultValue,
  });

  return options;
}
