import { parseAsInteger, parseAsString, parseAsBoolean, parseAsIsoDate } from "nuqs";

export interface SelectOption {
  value: string;
  label: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  disabled?: boolean;
  shortName?: string;
}

export interface StatusOption extends SelectOption {
  color: string;
  bgColor?: string;
}

// Current Status Options (Enhanced from original system)
export const currentStatusOptions: StatusOption[] = [
  { 
    label: "IN-PROGRESS", 
    value: "in-progress", 
    color: "orange", 
    shortName: "IN-PROG",
    variant: "outline"
  },
  { 
    label: "SO-CONFIRMED", 
    value: "so-confirmed", 
    color: "green", 
    shortName: "SO-CONF",
    variant: "default"
  },
  { 
    label: "ADDED-TO-PROGEN", 
    value: "added-to-progen", 
    color: "blue", 
    disabled: true, 
    shortName: "PROGEN",
    variant: "secondary"
  },
  { 
    label: "REQUEST-CHANGES", 
    value: "request-changes", 
    color: "purple", 
    disabled: true, 
    shortName: "REQ-CHA",
    variant: "outline"
  },
  { 
    label: "CANCEL", 
    value: "cancel", 
    color: "grey", 
    shortName: "CANCEL",
    variant: "destructive"
  },
];

// Sales Order Status Options (From original system)
export const soStatusOptions: StatusOption[] = [
  { label: "NEW", value: "new", color: "blue", variant: "default" },
  { label: "REPEAT", value: "repeat", color: "orange", variant: "outline" },
  { label: "REVISED", value: "revised", color: "purple", variant: "secondary" },
];

// Product Shelf Life Options
export const pShelfLifeOptions: SelectOption[] = [
  { label: "NA", value: "NA" },
  { label: "18", value: "18" },
  { label: "24", value: "24" },
  { label: "36", value: "36" },
];



// Product Domino Options (From original system)
export const pDominoOptions: SelectOption[] = [
  { label: "DOMINO", value: "domino" },
  { label: "STEREO", value: "stereo" },
];



// Payment Terms Options
export const paymentTermOptions: SelectOption[] = [
  { value: "advance", label: "Advance" },
  { value: "partial", label: "Partial" },
  { value: "credit", label: "Credit" },
  { value: "net_30", label: "Net 30" },
  { value: "net_60", label: "Net 60" },
  { value: "net_90", label: "Net 90" },
  { value: "cod", label: "Cash on Delivery" }
];

// Design Under Options
export const designUnderOptions: SelectOption[] = [
  { value: "design_team", label: "Design Team" },
  { value: "artwork_team", label: "Artwork Team" },
  { value: "external_designer", label: "External Designer" },
  { value: "client_design", label: "Client Design" }
];

// Tablet Type Options
export const tabletTypeOptions: SelectOption[] = [
  { value: "tablet", label: "Tablet" },
  { value: "capsule", label: "Capsule" },
  { value: "syrup", label: "Syrup" },
  { value: "injection", label: "Injection" },
  { value: "cream", label: "Cream" },
  { value: "ointment", label: "Ointment" }
];

// Tablet Size Options
export const tabletSizeOptions: SelectOption[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "extra_large", label: "Extra Large" }
];

// Change Part Options
export const changePartOptions: SelectOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "partial", label: "Partial" }
];

// Shipper Size Options
export const shipperSizeOptions: SelectOption[] = [
  { value: "standard", label: "Standard" },
  { value: "compact", label: "Compact" },
  { value: "large", label: "Large" },
  { value: "custom", label: "Custom" }
];

// Drug Approval Under Options
export const drugApprovalOptions: SelectOption[] = [
  { value: "fda", label: "FDA" },
  { value: "cdsco", label: "CDSCO" },
  { value: "who", label: "WHO" },
  { value: "ema", label: "EMA" },
  { value: "other", label: "Other" }
];


// Sort Options
export const sortOptions: SelectOption[] = [
  { value: "created_at", label: "Created Date" },
  { value: "updated_at", label: "Updated Date" },
  { value: "so_number", label: "SO Number" },
  { value: "so_date", label: "SO Date" },
  { value: "so_status", label: "Status" },
  { value: "customer_name", label: "Customer" },
  { value: "item_name", label: "Item" }
];

  // Sort Order Options
  export const sortOrderOptions: SelectOption[] = [
    { value: "desc", label: "Descending" },
    { value: "asc", label: "Ascending" }
  ];

  // Shelf Life Options
  export const shelfLifeOptions: SelectOption[] = [
    { label: "NA", value: "NA" },
    { label: "18 Months", value: "18" },
    { label: "24 Months", value: "24" },
    { label: "36 Months", value: "36" },
  ];

  // Payment Terms
  export const paymentTerms: SelectOption[] = [
    { label: "Advance 100%", value: "ADVANCE_100" },
    { label: "Advance 50%", value: "ADVANCE_50" },
    { label: "Advance 30%", value: "ADVANCE_30" },
    { label: "Net 30 Days", value: "NET_30" },
    { label: "Net 45 Days", value: "NET_45" },
    { label: "Net 60 Days", value: "NET_60" },
    { label: "Net 90 Days", value: "NET_90" },
  ];

  // Tablet Types
  export const tabletTypes: SelectOption[] = [
    { label: "Round", value: "ROUND" },
    { label: "Oval", value: "OVAL" },
    { label: "Rectangle", value: "RECTANGLE" },
    { label: "Triangle", value: "TRIANGLE" },
    { label: "Diamond", value: "DIAMOND" },
    { label: "Custom", value: "CUSTOM" },
  ];

  // Tablet Sizes
  export const tabletSizes: SelectOption[] = [
    { label: "6mm", value: "6mm" },
    { label: "8mm", value: "8mm" },
    { label: "10mm", value: "10mm" },
    { label: "12mm", value: "12mm" },
    { label: "14mm", value: "14mm" },
    { label: "16mm", value: "16mm" },
    { label: "18mm", value: "18mm" },
    { label: "20mm", value: "20mm" },
  ];

    // Shipper Sizes
    export const shipperSizes: SelectOption[] = [
      { label: "Small", value: "SMALL" },
      { label: "Medium", value: "MEDIUM" },
      { label: "Large", value: "LARGE" },
      { label: "Extra Large", value: "EXTRA_LARGE" },
    ];

      // Flavour Options
  export const flavours: SelectOption[] = [
    { label: "None", value: "NONE" },
    { label: "Mint", value: "MINT" },
    { label: "Orange", value: "ORANGE" },
    { label: "Strawberry", value: "STRAWBERRY" },
    { label: "Vanilla", value: "VANILLA" },
    { label: "Chocolate", value: "CHOCOLATE" },
    { label: "Lemon", value: "LEMON" },
    { label: "Custom", value: "CUSTOM" },
  ];

  // Fragrance Options
  export const fragrances: SelectOption[] = [
    { label: "None", value: "NONE" },
    { label: "Lavender", value: "LAVENDER" },
    { label: "Rose", value: "ROSE" },
    { label: "Jasmine", value: "JASMINE" },
    { label: "Citrus", value: "CITRUS" },
    { label: "Custom", value: "CUSTOM" },
  ];
  export const domino: SelectOption[] = [
    { label: "DOMINO", value: "DOMINO" },
    { label: "STEREO", value: "STEREO" },
  ];

// nuqs Parsers
export const salesOrderParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  sortBy: parseAsString.withDefault("created_at"),
  sortOrder: parseAsString.withDefault("desc") as any,
  search: parseAsString.withDefault(""),
  soStatus: parseAsString.withDefault(""),
  paymentTerm: parseAsString.withDefault(""),
  designUnder: parseAsString.withDefault(""),
  currentStatus: parseAsString.withDefault(""),
  isSubmitted: parseAsBoolean,
  assignedDesigner: parseAsInteger,
  fromDate: parseAsIsoDate,
  toDate: parseAsIsoDate
};

// Utility Functions
export const getStatusColor = (status: string): StatusOption => {
  return soStatusOptions.find(option => option.value === status) || 
         soStatusOptions[0]; 
};

export const getCurrentStatusColor = (status: string): StatusOption => {
  return currentStatusOptions.find(option => option.value === status) || 
         currentStatusOptions[0]; // Default to first option
};

export const getCurrentStatusOption = (status: string): StatusOption => {
  return currentStatusOptions.find(option => option.value === status) || 
         currentStatusOptions[0]; // Default to first option
};

export const getSoStatusOption = (status: string): SelectOption => {
  return soStatusOptions.find(option => option.value === status) || 
         soStatusOptions[0]; // Default to first option
};



export const getPDominoOption = (domino: string): SelectOption => {
  return pDominoOptions.find(option => option.value === domino) || 
         pDominoOptions[0]; // Default to first option
};

export const getPShelfLifeOption = (shelfLife: string): SelectOption => {
  return pShelfLifeOptions.find(option => option.value === shelfLife) || 
         pShelfLifeOptions[0]; // Default to first option
};

export const formatDate = (date: string | Date): string => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return "-";
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount: string | number): string => {
  if (!amount) return "0.00";
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toFixed(2);
};

export const formatQuantity = (quantity: string | number): string => {
  if (!quantity) return "0";
  return quantity.toString();
};

// Filter Default Values
export const defaultSalesOrderFilter = {
  page: 1,
  pageSize: 10,
  sortBy: "created_at",
  sortOrder: "desc" as "asc" | "desc",
  search: "",
  soStatus: "",
  paymentTerm: "",
  designUnder: "",
  currentStatus: "",
  isSubmitted: undefined as boolean | undefined,
  assignedDesigner: undefined as number | undefined,
  fromDate: undefined as Date | undefined,
  toDate: undefined as Date | undefined
};

// Company Details (From original system)
export const CompanyDetails = {
  CIAN: {
    name: "Cian Healthcare Ltd.",
    address: "Office No.301, Konark Icon, Mundhwa - Kharadi Rd, Kirtane Baugh, Magarpatta, Hadapsar, Pune - 411036",
    phone: "020-4147 1234",
    email: "enquiry@cian.co",
    website: "www.cian.co",
    account_details: {
      account_number: "301102000000745",
      ifsc_code: "IBKL0000301",
      branch: "Koregaon Park, Pune",
    },
  },
  "DR SMITH": {
    name: "Dr. Smiths Biotech",
    address: "Office No.301, Konark Icon, Mundhwa - Kharadi Rd, Kirtane Baugh, Magarpatta, Hadapsar, Pune - 411036",
    phone: "020-4147 1234",
    email: "enquiry@drsmiths.co",
    website: "www.cian.co",
    account_details: {
      account_number: "0769102000003971",
      ifsc_code: "IBKL0000769",
      branch: "KONDHWA, PUNE",
    },
  },
  "Bayberry": {
    name: "Bayberry Pharmaceuticals Pvt Ltd.",
    address: "Business Court, Office no.C-314, opposite brand factory, Mukund Nagar, Pune, Maharashtra 411037",
    phone: "",
    email: "",
    website: "",
    account_details: {
      account_number: "003905030273",
      ifsc_code: "ICIC0000039",
      branch: "Shivaji Nagar, Pune",
    },
  },
  "SHEFIATRIC LIFE SCIENCES": {
    name: "SHEFIATRIC LIFE SCIENCES",
    address: "B-214,1st&2nd FLOOR, VAISHALI MARG, OPP.BRIGHTLAND SCHOOL, VAISHALI NAGAR, JAIPUR-302021 Rajasthan | GST. No.: 08BDUPJ5634B2ZE",
    phone: "",
    email: "",
    website: "",
    account_details: {
      account_number: "59209414043964",
      ifsc_code: "HDFC0006418",
      branch: "Chandpole Jaipur",
    },
  },
  "CELESTA HEALTHCARE PVT. LTD.": {
    name: "CELESTA HEALTHCARE PVT. LTD.",
    address: "SHOP NO 6 GROUND FLOOR, MILKAT NO 5709/5, GAT NO 1363, SHIV RASTA, NEAR MEETHA GODOWN, WADKI, TAL HAVELI DIST PUNE 412308.",
    phone: "",
    email: "",
    website: "",
    account_details: {
      account_number: "",
      ifsc_code: "",
      branch: "",
    },
  },
  "JM LIFESCIENCES PVT. LTD.": {
    name: "JM LIFESCIENCES PVT. LTD.",
    address: "224, Bharat Industrial Premises Co.Op.Soc. Ltd., L.B.S Marg,Bhandup (West), Mumbai, Maharashtra, Pin code : 400078",
    phone: "9878882715/9137047791",
    email: "jmlife16@gmail.com",
    website: "https://jmlifesciences.com/ ",
    account_details: {
      account_number: "50200001682942",
      ifsc_code: "HDFC0002844",
      branch: "Dhanukar Colony Branch",
    },
  }
};

// Table pagination properties (From original system)
export const PaginationProps = {
  position: ["bottomCenter"] as any,
  showSizeChanger: true,
  defaultPageSize: 50,
  pageSizeOptions: ["10", "20", "50", "100"],
  showTitle: true,
  showTotal: (total: any, range: any) => `Showing ${range[0]}-${range[1]} of ${total} items`,
}; 