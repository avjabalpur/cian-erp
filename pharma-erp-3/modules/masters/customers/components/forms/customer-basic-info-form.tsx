'use client';

import { Card, CardContent } from "@/components/ui/card";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { FormCheckbox } from "@/components/shared/forms/form-checkbox";
import { FormTextArea } from "@/components/shared/forms/form-text-area";
import { useCustomerTypes } from "@/modules/masters/customer-types/hooks";

interface CustomerBasicInfoFormProps {
  control: any;
  customerId?: number;
}

export function CustomerBasicInfoForm({ control, customerId }: CustomerBasicInfoFormProps) {
  const { data: customerTypesData } = useCustomerTypes();
  const customerTypes = customerTypesData?.items || [];

  const customerTypeOptions = [
    { label: 'Select Customer Type', value: '0' },
    ...customerTypes.map(ct => ({ label: `${ct.code} - ${ct.name}`, value: ct.code }))
  ];

  const segmentOptions = [
    { label: 'Select Segment', value: '0' },
    { label: 'Retail', value: 'RETAIL' },
    { label: 'Wholesale', value: 'WHOLESALE' },
    { label: 'Institutional', value: 'INSTITUTIONAL' },
  ];

  const exportTypeOptions = [
    { label: 'Select Export Type', value: '0' },
    { label: 'Direct', value: 'DIRECT' },
    { label: 'Indirect', value: 'INDIRECT' },
  ];

  const continentOptions = [
    { label: 'Select Continent', value: '0' },
    { label: 'Asia', value: 'ASIA' },
    { label: 'Europe', value: 'EUROPE' },
    { label: 'North America', value: 'NORTH_AMERICA' },
    { label: 'South America', value: 'SOUTH_AMERICA' },
    { label: 'Africa', value: 'AFRICA' },
    { label: 'Australia', value: 'AUSTRALIA' },
  ];

  const customerSaleTypeOptions = [
    { label: 'Select Sale Type', value: '0' },
    { label: 'Regular', value: 'REGULAR' },
    { label: 'Special', value: 'SPECIAL' },
  ];

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormInput
            control={control}
            name="locationCode"
            label="Location Code"
            placeholder="Enter location code"
            required
          />
          <FormSelect
            control={control}
            name="customerSaleType"
            label="Customer Sale Type"
            options={customerSaleTypeOptions}
            placeholder="Select sale type"
          />
          <FormInput
            control={control}
            name="customerNumber"
            label="Customer Number"
            placeholder="Enter customer number"
            required
          />
          <FormInput
            control={control}
            name="customerCode"
            label="Customer Code"
            placeholder="Enter customer code"
            required
          />
          <FormInput
            control={control}
            name="customerName"
            label="Customer Name"
            placeholder="Enter customer name"
            required
          />
          <FormInput
            control={control}
            name="shortName"
            label="Short Name"
            placeholder="Enter short name"
          />
          <FormInput
            control={control}
            name="payeeName"
            label="Payee Name"
            placeholder="Enter payee name"
          />
          <FormSelect
            control={control}
            name="customerTypeCode"
            label="Customer Type"
            options={customerTypeOptions}
            placeholder="Select customer type"
          />
          <FormSelect
            control={control}
            name="segmentCode"
            label="Segment"
            options={segmentOptions}
            placeholder="Select segment"
          />
          <FormInput
            control={control}
            name="incomeTaxPanNumber"
            label="Income Tax PAN Number"
            placeholder="Enter PAN number"
          />
          <FormSelect
            control={control}
            name="exportType"
            label="Export Type"
            options={exportTypeOptions}
            placeholder="Select export type"
          />
          <FormInput
            control={control}
            name="gstin"
            label="GSTIN"
            placeholder="Enter GSTIN"
          />
          <FormInput
            control={control}
            name="drugLicenseNumber"
            label="Drug License Number"
            placeholder="Enter drug license number"
          />
          <FormInput
            control={control}
            name="drugLicenseExpiryDate"
            label="Drug License Expiry Date"
            placeholder="Select date"
            inputProps={{ type: "date" }}
          />
          <FormInput
            control={control}
            name="otherLicenseNumber"
            label="Other License Number"
            placeholder="Enter other license number"
          />
          <FormInput
            control={control}
            name="oldCode"
            label="Old Code"
            placeholder="Enter old code"
          />
          <FormInput
            control={control}
            name="customerLotNumber"
            label="Customer Lot Number"
            placeholder="Enter lot number"
          />
          <FormSelect
            control={control}
            name="continent"
            label="Continent"
            options={continentOptions}
            placeholder="Select continent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormTextArea
            control={control}
            name="rebates"
            label="Rebates"
            placeholder="Enter rebates information"
            rows={3}
          />
          <FormTextArea
            control={control}
            name="externalInformation"
            label="External Information"
            placeholder="Enter external information"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormCheckbox
            control={control}
            name="stopInvoice"
            label="Stop Invoice"
            description="Stop invoice generation for this customer"
          />
          <FormCheckbox
            control={control}
            name="isExportCustomer"
            label="Export Customer"
            description="Indicates if this is an export customer"
          />
          <FormCheckbox
            control={control}
            name="isRegisteredDealer"
            label="Registered Dealer"
            description="Indicates if this is a registered dealer"
          />
          <FormCheckbox
            control={control}
            name="isActive"
            label="Active"
            description="Indicates if this customer is active"
          />
        </div>
      </CardContent>
    </Card>
  );
}

