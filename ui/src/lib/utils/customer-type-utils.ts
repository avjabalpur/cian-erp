import { parseAsString, parseAsInteger, parseAsBoolean } from 'nuqs';

export const customerTypeFilterParsers = {
  pageNumber: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(20),
  search: parseAsString,
  code: parseAsString,
  name: parseAsString,
  isExportType: parseAsBoolean,
  isDomesticType: parseAsBoolean,
  requiresDrugLicense: parseAsBoolean,
  creditTermsApplicable: parseAsBoolean,
  isActive: parseAsBoolean,
  sortBy: parseAsString.withDefault('name'),
  sortDescending: parseAsBoolean.withDefault(false),
};

// Static options for customer type attributes
export const exportTypeOptions = [
  { label: "Export Type", value: "true" },
  { label: "Domestic Type", value: "false" },
];

export const domesticTypeOptions = [
  { label: "Domestic Type", value: "true" },
  { label: "Export Type", value: "false" },
];

export const drugLicenseOptions = [
  { label: "Requires Drug License", value: "true" },
  { label: "No Drug License Required", value: "false" },
];

export const creditTermsOptions = [
  { label: "Credit Terms Applicable", value: "true" },
  { label: "No Credit Terms", value: "false" },
];

export const activeStatusOptions = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

// Helper functions
export const getExportTypeLabel = (value: boolean): string => {
  return value ? "Export Type" : "Domestic Type";
};

export const getDomesticTypeLabel = (value: boolean): string => {
  return value ? "Domestic Type" : "Export Type";
};

export const getDrugLicenseLabel = (value: boolean): string => {
  return value ? "Requires Drug License" : "No Drug License Required";
};

export const getCreditTermsLabel = (value: boolean): string => {
  return value ? "Credit Terms Applicable" : "No Credit Terms";
};

export const getActiveStatusLabel = (value: boolean): string => {
  return value ? "Active" : "Inactive";
};

// --- Form Data Functions ---

export const getCustomerTypeDefaultValues = () => ({
  code: "",
  name: "",
  description: "",
  isExportType: false,
  isDomesticType: true,
  requiresDrugLicense: false,
  creditTermsApplicable: false,
  isActive: true,
});

export const mapCustomerTypeToFormData = (customerType: any) => ({
  code: customerType.code || "",
  name: customerType.name || "",
  description: customerType.description || "",
  isExportType: customerType.isExportType ?? false,
  isDomesticType: customerType.isDomesticType ?? true,
  requiresDrugLicense: customerType.requiresDrugLicense ?? false,
  creditTermsApplicable: customerType.creditTermsApplicable ?? false,
  isActive: customerType.isActive ?? true,
});

export const transformFormDataToApi = (formData: any) => ({
  code: formData.code,
  name: formData.name,
  description: formData.description || null,
  isExportType: formData.isExportType,
  isDomesticType: formData.isDomesticType,
  requiresDrugLicense: formData.requiresDrugLicense,
  creditTermsApplicable: formData.creditTermsApplicable,
  isActive: formData.isActive,
}); 