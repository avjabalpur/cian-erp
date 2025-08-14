export const SOApprovalOptionsMaster = {
  current_status: [
    { label: "IN-PROGRESS", value: "IN-PROGRESS", color: "orange", shortName: "IN-PROG" },
    { label: "SO-CONFIRMED", value: "SO-CONFIRMED", color: "green", shortName: "SO-CONF" },
    { label: "ADDED-TO-PROGEN", value: "ADDED-TO-PROGEN", color: "blue", disabled: true, shortName: "PROGEN" },
    { label: "REQUEST-CHANGES", value: "REQUEST-CHANGES", color: "purple", disabled: true, shortName: "REQ-CHA" },
    { label: "CANCEL", value: "CANCEL", color: "grey", shortName: "CANCEL" },
  ],

  so_status: [
    { label: "NEW", value: "NEW" },
    { label: "REPEAT", value: "REPEAT" },
    { label: "REVISED", value: "REVISED" },
  ],

  manufacturer_name: [
    { label: "CIAN HEALTHCARE", value: "CIAN HEALTHCARE" },
    { label: "DR. SMITH", value: "DR. SMITH" },
    { label: "Bayberry", value: "Bayberry" },
    { value: "SHEFIATRIC LIFE SCIENCES", label: "SHEFIATRIC LIFE SCIENCES" },
    { value: "CELESTA HEALTHCARE PVT. LTD.", label: "CELESTA HEALTHCARE PVT. LTD." },
    { value: "JM LIFESCIENCES PVT. LTD.", label: "JM LIFESCIENCES PVT. LTD." },
  ],

  p_shelf_life: [
    { label: "NA", value: "NA" },
    { label: "18", value: "18" },
    { label: "24", value: "24" },
    { label: "36", value: "36" },
  ],

  dosage_name: [
    { label: "TABLET", value: "TABLET" },
    { label: "GEL", value: "GEL" },
    { label: "CAPSULE", value: "CAPSULE" },
    { label: "LIQUID", value: "LIQUID" },
    { label: "OINTMENT", value: "OINTMENT" },
    { label: "POWDER", value: "POWDER" },
    { label: "CREAM", value: "CREAM" },
    { label: "SOFTGEL", value: "SOFTGEL" },
  ],

  p_domino: [
    { label: "DOMINO", value: "DOMINO" },
    { label: "STEREO", value: "STEREO" },
  ],

  assigned_designer: [
    { label: "-", value: 0, is_deleted: false },
    { label: "amar", value: 103, is_deleted: false },
    { label: "dn", value: 155, is_deleted: false },
    { label: "masum", value: 106, is_deleted: false },
    { label: "omkar", value: 190, is_deleted: false },
  ],
};

export const CompanyDetails = {
  CIAN: {
    name: "Cian Healthcare Ltd.",
    address:
      "Office No.301, Konark Icon, Mundhwa - Kharadi Rd, Kirtane Baugh, Magarpatta, Hadapsar, Pune - 411036",
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
    address:
      "Office No.301, Konark Icon, Mundhwa - Kharadi Rd, Kirtane Baugh, Magarpatta, Hadapsar, Pune - 411036",
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
    address:
      "Business Court, Office no.C-314, opposite brand factory, Mukund Nagar, Pune, Maharashtra 411037",
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
    address:
      "B-214,1st&2nd FLOOR, VAISHALI MARG, OPP.BRIGHTLAND SCHOOL, VAISHALI NAGAR, JAIPUR-302021 Rajasthan | GST. No.: 08BDUPJ5634B2ZE",
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
    address:
      "SHOP NO 6 GROUND FLOOR, MILKAT NO 5709/5, GAT NO 1363, SHIV RASTA, NEAR MEETHA GODOWN, WADKI, TAL HAVELI DIST PUNE 412308.",
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
    address:
      "224, Bharat Industrial Premises Co.Op.Soc. Ltd., L.B.S Marg,Bhandup (West), Mumbai, Maharashtra, Pin code : 400078",
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

export const PaginationProps: any = {
  position: ["bottomCenter"],
  showSizeChanger: true,
  defaultPageSize: 50,
  pageSizeOptions: ["10", "20", "50", "100"],
  // hideOnSinglePage: true,
  showTitle: true,
  showTotal: (total: any, range: any) => {
    return `Showing ${range[0]}-${range[1]} of ${total} items`;
  },
};
