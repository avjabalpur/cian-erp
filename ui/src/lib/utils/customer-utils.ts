import { createParser } from 'nuqs/server';
import { z } from 'zod';

// --- Filter Parsers ---

export const customerFilterParsers = {
  pageNumber: createParser(z.coerce.number().min(1).default(1)),
  pageSize: createParser(z.coerce.number().min(1).max(100).default(20)),
  search: createParser(z.string().optional()),
  customerCode: createParser(z.string().optional()),
  customerName: createParser(z.string().optional()),
  customerTypeCode: createParser(z.string().optional()),
  gstin: createParser(z.string().optional()),
  isActive: createParser(z.coerce.boolean().optional()),
  isExportCustomer: createParser(z.coerce.boolean().optional()),
  sortBy: createParser(z.string().default('customerName')),
  sortDescending: createParser(z.coerce.boolean().default(false)),
};

// --- Static Options ---

export const customerTypeOptions = [
  { label: "Select Customer Type", value: "" },
  { label: "Domestic", value: "DOMESTIC" },
  { label: "Export", value: "EXPORT" },
  { label: "Government", value: "GOVERNMENT" },
  { label: "Institutional", value: "INSTITUTIONAL" },
  { label: "Retail", value: "RETAIL" },
  { label: "Wholesale", value: "WHOLESALE" },
];

export const segmentOptions = [
  { label: "Select Segment", value: "" },
  { label: "Pharmaceutical", value: "PHARMA" },
  { label: "Healthcare", value: "HEALTHCARE" },
  { label: "Cosmetics", value: "COSMETICS" },
  { label: "Food", value: "FOOD" },
  { label: "Chemical", value: "CHEMICAL" },
  { label: "Other", value: "OTHER" },
];

export const exportTypeOptions = [
  { label: "Select Export Type", value: "" },
  { label: "Direct Export", value: "DIRECT" },
  { label: "Indirect Export", value: "INDIRECT" },
  { label: "Deemed Export", value: "DEEMED" },
];

export const continentOptions = [
  { label: "Select Continent", value: "" },
  { label: "Asia", value: "ASIA" },
  { label: "Europe", value: "EUROPE" },
  { label: "North America", value: "NORTH_AMERICA" },
  { label: "South America", value: "SOUTH_AMERICA" },
  { label: "Africa", value: "AFRICA" },
  { label: "Australia", value: "AUSTRALIA" },
  { label: "Antarctica", value: "ANTARCTICA" },
];

export const customerSaleTypeOptions = [
  { label: "Select Sale Type", value: "" },
  { label: "Cash", value: "CASH" },
  { label: "Credit", value: "CREDIT" },
  { label: "Consignment", value: "CONSIGNMENT" },
  { label: "Trial", value: "TRIAL" },
];

// --- Helper Functions ---

export const getCustomerTypeLabel = (value: string): string => {
  const option = customerTypeOptions.find(opt => opt.value === value);
  return option?.label || value;
};

export const getSegmentLabel = (value: string): string => {
  const option = segmentOptions.find(opt => opt.value === value);
  return option?.label || value;
};

export const getExportTypeLabel = (value: string): string => {
  const option = exportTypeOptions.find(opt => opt.value === value);
  return option?.label || value;
};

export const getContinentLabel = (value: string): string => {
  const option = continentOptions.find(opt => opt.value === value);
  return option?.label || value;
};

export const getCustomerSaleTypeLabel = (value: string): string => {
  const option = customerSaleTypeOptions.find(opt => opt.value === value);
  return option?.label || value;
};

// --- Form Data Functions ---

export const getCustomerDefaultValues = () => ({
  locationCode: "",
  customerNumber: "",
  customerCode: "",
  customerName: "",
  shortName: "",
  payeeName: "",
  customerTypeCode: "",
  segmentCode: "",
  incomeTaxPanNumber: "",
  customerSaleType: "",
  exportType: "",
  gstin: "",
  drugLicenseNumber: "",
  drugLicenseExpiryDate: "",
  otherLicenseNumber: "",
  oldCode: "",
  customerLotNumber: "",
  stopInvoice: false,
  isExportCustomer: false,
  isRegisteredDealer: false,
  isRecordClosed: false,
  isActive: true,
  continent: "",
  rebates: "",
  externalInformation: "",
});

export const mapCustomerToFormData = (customer: any) => ({
  locationCode: customer.locationCode || "",
  customerNumber: customer.customerNumber || "",
  customerCode: customer.customerCode || "",
  customerName: customer.customerName || "",
  shortName: customer.shortName || "",
  payeeName: customer.payeeName || "",
  customerTypeCode: customer.customerTypeCode || "",
  segmentCode: customer.segmentCode || "",
  incomeTaxPanNumber: customer.incomeTaxPanNumber || "",
  customerSaleType: customer.customerSaleType || "",
  exportType: customer.exportType || "",
  gstin: customer.gstin || "",
  drugLicenseNumber: customer.drugLicenseNumber || "",
  drugLicenseExpiryDate: customer.drugLicenseExpiryDate || "",
  otherLicenseNumber: customer.otherLicenseNumber || "",
  oldCode: customer.oldCode || "",
  customerLotNumber: customer.customerLotNumber || "",
  stopInvoice: customer.stopInvoice || false,
  isExportCustomer: customer.isExportCustomer || false,
  isRegisteredDealer: customer.isRegisteredDealer || false,
  isRecordClosed: customer.isRecordClosed || false,
  isActive: customer.isActive ?? true,
  continent: customer.continent || "",
  rebates: customer.rebates || "",
  externalInformation: customer.externalInformation || "",
});

export const transformFormDataToApi = (formData: any) => ({
  locationCode: formData.locationCode || null,
  customerNumber: formData.customerNumber,
  customerCode: formData.customerCode,
  customerName: formData.customerName,
  shortName: formData.shortName || null,
  payeeName: formData.payeeName || null,
  customerTypeCode: formData.customerTypeCode || null,
  segmentCode: formData.segmentCode || null,
  incomeTaxPanNumber: formData.incomeTaxPanNumber || null,
  customerSaleType: formData.customerSaleType || null,
  exportType: formData.exportType || null,
  gstin: formData.gstin || null,
  drugLicenseNumber: formData.drugLicenseNumber || null,
  drugLicenseExpiryDate: formData.drugLicenseExpiryDate || null,
  otherLicenseNumber: formData.otherLicenseNumber || null,
  oldCode: formData.oldCode || null,
  customerLotNumber: formData.customerLotNumber || null,
  stopInvoice: formData.stopInvoice,
  isExportCustomer: formData.isExportCustomer,
  isRegisteredDealer: formData.isRegisteredDealer,
  isRecordClosed: formData.isRecordClosed,
  isActive: formData.isActive,
  continent: formData.continent || null,
  rebates: formData.rebates || null,
  externalInformation: formData.externalInformation || null,
}); 