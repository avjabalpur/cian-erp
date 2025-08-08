// Sales Order Approval Options Master
// This file contains all the dropdown options and configuration data for the sales order approval system

export const SalesOrderOptionsMaster = {
  // Current Status Options
  currentStatus: [
    { label: "IN-PROGRESS", value: "IN-PROGRESS", color: "orange", shortName: "IN-PROG", variant: "secondary" },
    { label: "SO-CONFIRMED", value: "SO-CONFIRMED", color: "green", shortName: "SO-CONF", variant: "default" },
    { label: "ADDED-TO-PROGEN", value: "ADDED-TO-PROGEN", color: "blue", shortName: "PROGEN", variant: "outline", disabled: true },
    { label: "REQUEST-CHANGES", value: "REQUEST-CHANGES", color: "purple", shortName: "REQ-CHA", variant: "destructive" },
    { label: "CANCEL", value: "CANCEL", color: "grey", shortName: "CANCEL", variant: "destructive" },
  ],

  // SO Status Options
  soStatus: [
    { label: "NEW", value: "NEW" },
    { label: "REPEAT", value: "REPEAT" },
    { label: "REVISED", value: "REVISED" },
  ],

  // Manufacturer Options
  manufacturerName: [
    { label: "CIAN HEALTHCARE", value: "CIAN HEALTHCARE" },
    { label: "DR. SMITH", value: "DR. SMITH" },
    { label: "Bayberry", value: "Bayberry" },
    { label: "SHEFIATRIC LIFE SCIENCES", value: "SHEFIATRIC LIFE SCIENCES" },
    { label: "CELESTA HEALTHCARE PVT. LTD.", value: "CELESTA HEALTHCARE PVT. LTD." },
    { label: "JM LIFESCIENCES PVT. LTD.", value: "JM LIFESCIENCES PVT. LTD." },
  ],

  // Shelf Life Options
  shelfLife: [
    { label: "NA", value: "NA" },
    { label: "18 Months", value: "18" },
    { label: "24 Months", value: "24" },
    { label: "36 Months", value: "36" },
  ],

  // Dosage Form Options
  dosageName: [
    { label: "TABLET", value: "TABLET" },
    { label: "GEL", value: "GEL" },
    { label: "CAPSULE", value: "CAPSULE" },
    { label: "LIQUID", value: "LIQUID" },
    { label: "OINTMENT", value: "OINTMENT" },
    { label: "POWDER", value: "POWDER" },
    { label: "CREAM", value: "CREAM" },
    { label: "SOFTGEL", value: "SOFTGEL" },
  ],

  // Domino/Stereo Options
  domino: [
    { label: "DOMINO", value: "DOMINO" },
    { label: "STEREO", value: "STEREO" },
  ],

  // Assigned Designer Options (This would typically come from your users table)
  assignedDesigner: [
    { label: "-", value: 0, isDeleted: false },
    { label: "amar", value: 103, isDeleted: false },
    { label: "dn", value: 155, isDeleted: false },
    { label: "masum", value: 106, isDeleted: false },
    { label: "omkar", value: 190, isDeleted: false },
  ],

  // Payment Terms
  paymentTerms: [
    { label: "Advance 100%", value: "ADVANCE_100" },
    { label: "Advance 50%", value: "ADVANCE_50" },
    { label: "Advance 30%", value: "ADVANCE_30" },
    { label: "Net 30 Days", value: "NET_30" },
    { label: "Net 45 Days", value: "NET_45" },
    { label: "Net 60 Days", value: "NET_60" },
    { label: "Net 90 Days", value: "NET_90" },
  ],

  // Tablet Types
  tabletTypes: [
    { label: "Round", value: "ROUND" },
    { label: "Oval", value: "OVAL" },
    { label: "Rectangle", value: "RECTANGLE" },
    { label: "Triangle", value: "TRIANGLE" },
    { label: "Diamond", value: "DIAMOND" },
    { label: "Custom", value: "CUSTOM" },
  ],

  // Tablet Sizes
  tabletSizes: [
    { label: "6mm", value: "6mm" },
    { label: "8mm", value: "8mm" },
    { label: "10mm", value: "10mm" },
    { label: "12mm", value: "12mm" },
    { label: "14mm", value: "14mm" },
    { label: "16mm", value: "16mm" },
    { label: "18mm", value: "18mm" },
    { label: "20mm", value: "20mm" },
  ],

  // Capsule Sizes
  capsuleSizes: [
    { label: "Size 0", value: "SIZE_0" },
    { label: "Size 1", value: "SIZE_1" },
    { label: "Size 2", value: "SIZE_2" },
    { label: "Size 3", value: "SIZE_3" },
    { label: "Size 4", value: "SIZE_4" },
    { label: "Size 5", value: "SIZE_5" },
  ],

  // Shipper Sizes
  shipperSizes: [
    { label: "Small", value: "SMALL" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Large", value: "LARGE" },
    { label: "Extra Large", value: "EXTRA_LARGE" },
  ],

  // Flavour Options
  flavours: [
    { label: "None", value: "NONE" },
    { label: "Mint", value: "MINT" },
    { label: "Orange", value: "ORANGE" },
    { label: "Strawberry", value: "STRAWBERRY" },
    { label: "Vanilla", value: "VANILLA" },
    { label: "Chocolate", value: "CHOCOLATE" },
    { label: "Lemon", value: "LEMON" },
    { label: "Custom", value: "CUSTOM" },
  ],

  // Fragrance Options
  fragrances: [
    { label: "None", value: "NONE" },
    { label: "Lavender", value: "LAVENDER" },
    { label: "Rose", value: "ROSE" },
    { label: "Jasmine", value: "JASMINE" },
    { label: "Citrus", value: "CITRUS" },
    { label: "Custom", value: "CUSTOM" },
  ],

  // Approval Types
  approvalTypes: [
    { label: "Costing Approval", value: "costing", color: "blue" },
    { label: "QA Approval", value: "qa", color: "green" },
    { label: "Designer Approval", value: "designer", color: "purple" },
    { label: "Final QA Approval", value: "final_qa", color: "emerald" },
    { label: "PM Approval", value: "pm", color: "orange" },
    { label: "Final Authorization", value: "final_authorization", color: "red" },
  ],

  // Comment Types
  commentTypes: [
    { label: "General Comment", value: "general" },
    { label: "Approval Comment", value: "approval" },
    { label: "Change Request", value: "change_request" },
    { label: "Technical Comment", value: "technical" },
  ],

  // Document Types
  documentTypes: [
    { label: "Quotation", value: "quotation" },
    { label: "Performa Invoice", value: "performa_invoice" },
    { label: "Technical Drawing", value: "technical_drawing" },
    { label: "Artwork", value: "artwork" },
    { label: "Certificate", value: "certificate" },
    { label: "Other", value: "other" },
  ],
};

// Company Details Configuration
export const CompanyDetails = {
  CIAN: {
    name: "Cian Healthcare Ltd.",
    address: "Office No.301, Konark Icon, Mundhwa - Kharadi Rd, Kirtane Baugh, Magarpatta, Hadapsar, Pune - 411036",
    phone: "020-4147 1234",
    email: "enquiry@cian.co",
    website: "www.cian.co",
    accountDetails: {
      accountNumber: "301102000000745",
      ifscCode: "IBKL0000301",
      branch: "Koregaon Park, Pune",
    },
  },
  "DR SMITH": {
    name: "Dr. Smiths Biotech",
    address: "Office No.301, Konark Icon, Mundhwa - Kharadi Rd, Kirtane Baugh, Magarpatta, Hadapsar, Pune - 411036",
    phone: "020-4147 1234",
    email: "enquiry@drsmiths.co",
    website: "www.cian.co",
    accountDetails: {
      accountNumber: "0769102000003971",
      ifscCode: "IBKL0000769",
      branch: "KONDHWA, PUNE",
    },
  },
  "Bayberry": {
    name: "Bayberry Pharmaceuticals Pvt Ltd.",
    address: "Business Court, Office no.C-314, opposite brand factory, Mukund Nagar, Pune, Maharashtra 411037",
    phone: "",
    email: "",
    website: "",
    accountDetails: {
      accountNumber: "003905030273",
      ifscCode: "ICIC0000039",
      branch: "Shivaji Nagar, Pune",
    },
  },
  "SHEFIATRIC LIFE SCIENCES": {
    name: "SHEFIATRIC LIFE SCIENCES",
    address: "B-214,1st&2nd FLOOR, VAISHALI MARG, OPP.BRIGHTLAND SCHOOL, VAISHALI NAGAR, JAIPUR-302021 Rajasthan | GST. No.: 08BDUPJ5634B2ZE",
    phone: "",
    email: "",
    website: "",
    accountDetails: {
      accountNumber: "59209414043964",
      ifscCode: "HDFC0006418",
      branch: "Chandpole Jaipur",
    },
  },
  "CELESTA HEALTHCARE PVT. LTD.": {
    name: "CELESTA HEALTHCARE PVT. LTD.",
    address: "SHOP NO 6 GROUND FLOOR, MILKAT NO 5709/5, GAT NO 1363, SHIV RASTA, NEAR MEETHA GODOWN, WADKI, TAL HAVELI DIST PUNE 412308.",
    phone: "",
    email: "",
    website: "",
    accountDetails: {
      accountNumber: "",
      ifscCode: "",
      branch: "",
    },
  },
  "JM LIFESCIENCES PVT. LTD.": {
    name: "JM LIFESCIENCES PVT. LTD.",
    address: "224, Bharat Industrial Premises Co.Op.Soc. Ltd., L.B.S Marg,Bhandup (West), Mumbai, Maharashtra, Pin code : 400078",
    phone: "9878882715/9137047791",
    email: "jmlife16@gmail.com",
    website: "https://jmlifesciences.com/",
    accountDetails: {
      accountNumber: "50200001682942",
      ifscCode: "HDFC0002844",
      branch: "Dhanukar Colony Branch",
    },
  },
};

// Pagination Configuration
export const PaginationConfig = {
  position: ["bottomCenter"],
  showSizeChanger: true,
  defaultPageSize: 50,
  pageSizeOptions: ["10", "20", "50", "100"],
  showTitle: true,
  showTotal: (total: number, range: [number, number]) => {
    return `Showing ${range[0]}-${range[1]} of ${total} items`;
  },
};

// Status Color Mapping
export const StatusColorMap = {
  "IN-PROGRESS": { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
  "SO-CONFIRMED": { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
  "ADDED-TO-PROGEN": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
  "REQUEST-CHANGES": { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" },
  "CANCEL": { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" },
};

// Helper function to get status color
export const getStatusColor = (status: string) => {
  return StatusColorMap[status as keyof typeof StatusColorMap] || 
         { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" };
};

// Helper function to get short name for status
export const getStatusShortName = (status: string) => {
  const statusOption = SalesOrderOptionsMaster.currentStatus.find(s => s.value === status);
  return statusOption?.shortName || status;
};

// Helper function to get company details
export const getCompanyDetails = (manufacturerName: string) => {
  const key = manufacturerName.toUpperCase() as keyof typeof CompanyDetails;
  return CompanyDetails[key] || null;
};
