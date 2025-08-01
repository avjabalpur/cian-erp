
CREATE TABLE IF NOT EXISTS config_lists (
    id SERIAL PRIMARY KEY,
    list_code VARCHAR(50) UNIQUE NOT NULL,  -- 'hsn_type', 'gs_id', etc.
    list_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

CREATE TABLE IF NOT EXISTS config_list_values (
    id SERIAL PRIMARY KEY,
    list_id INTEGER NOT NULL,
    value_code VARCHAR(50) NOT NULL,
    value_name VARCHAR(100) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    extra_data JSONB,  -- For additional attributes if needed (using JSONB for better performance)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    CONSTRAINT fk_config_list_values_list_id FOREIGN KEY (list_id) REFERENCES config_lists(id) ON DELETE CASCADE,
    CONSTRAINT unique_list_value UNIQUE (list_id, value_code)
);

CREATE TABLE IF NOT EXISTS config_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_name VARCHAR(150) NOT NULL,
    description TEXT,
    string_value TEXT,
    integer_value BIGINT,
    boolean_value BOOLEAN,
    decimal_value NUMERIC(15,4),
    default_value TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

CREATE TABLE IF NOT EXISTS location_type (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    location_type_id INTEGER NOT NULL REFERENCES location_type(id),
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    address1 VARCHAR(100),
    address2 VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    zip VARCHAR(10),
    phone VARCHAR(15),
    email VARCHAR(100),
    website VARCHAR(100),
    gstin_number VARCHAR(50),
    tds_cycle VARCHAR(50),
    employment_status_code Varchar(50),
    esi_office_code VARCHAR(50),
    exc_regin_code VARCHAR(50),
    st_regn_code VARCHAR(50),
    cin_number VARCHAR(50),
    interface_code VARCHAR(50),  
    license_number VARCHAR(50),
    ecc_number VARCHAR(50),
    range VARCHAR(50),
    division VARCHAR(50),
    collectorate VARCHAR(50),
    drug_license_number1 VARCHAR(50),
    drug_license_number2 VARCHAR(50),
    food_license_number VARCHAR(50),
    cst_regn_number VARCHAR(50),
    vat_tin_number VARCHAR(50),
    pan_number VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

CREATE TABLE IF NOT EXISTS users (
  srno SERIAL PRIMARY KEY,
  username varchar(50) ,
  password varchar(50),
  usertype varchar(50),
  status varchar(100),
  depthead varchar(30) ,
  dept varchar(45),
  loccd varchar(45)
);

CREATE TABLE IF NOT EXISTS sales_orders (
  id SERIAL PRIMARY KEY,
  created_by INTEGER,
  created_at TIMESTAMP NULL,
  updated_by INTEGER,
  updated_at TIMESTAMP NULL,
  current_status VARCHAR(200),
  comments TEXT,
  is_submitted INTEGER DEFAULT 0,
  is_deleted INTEGER DEFAULT 0,
  assigned_designer INTEGER,
  plant_email_sent INTEGER,
  so_number VARCHAR(200),
  so_date TIMESTAMP,
  so_status TEXT CHECK (so_status IN ('new', 'repeat', 'revised')),
  organization_id INTEGER,
  customer_id INTEGER,
  payment_term VARCHAR(200),
  quotation_date TIMESTAMP,
  quotation_no VARCHAR(200),
  hsn_code VARCHAR(200),
  item_id INTEGER,
  dosage_name VARCHAR(200),
  divisionId INTEGER,
  design_under VARCHAR(200),
  packing_style_description TEXT,
  composition TEXT,
  pack_short VARCHAR(200),
  tablet_type VARCHAR(200),
  tablet_size VARCHAR(200),
  change_part VARCHAR(200),
  capsule_size VARCHAR(200),
  shipper_size VARCHAR(200),
  qty_per_shipper VARCHAR(200),
  no_of_shipper VARCHAR(200),
  flavour VARCHAR(200),
  fragrance VARCHAR(200),
  quantity VARCHAR(200),
  foc_qty VARCHAR(20),
  mrp VARCHAR(200),
  billing_rate VARCHAR(200),
  costing VARCHAR(200),
  inventory_charges VARCHAR(200),
  cylinder_charge VARCHAR(200),
  plate_charges VARCHAR(200),
  domino VARCHAR(200),
  stereo VARCHAR(200),
  shipper_drawing_ref_code VARCHAR(200),
  ctn_outer_drawing_ref_no VARCHAR(200),
  ctn_inner_drawing_ref_no VARCHAR(200),
  foil_drawing_ref_no VARCHAR(200),
  leaflet_drawing_ref_no VARCHAR(200),
  tube_drawing_ref_no VARCHAR(200),
  label_drawing_ref_no VARCHAR(200),
  pm_outer_ctn_stock VARCHAR(200),
  pm_inner_ctn_stock VARCHAR(200),
  pm_foil_stock VARCHAR(200),
  pm_leaflet_stock VARCHAR(200),
  pm_tube_stock VARCHAR(200),
  pm_label_stock VARCHAR(200),
  drug_approval_under VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS sales_order_stages (
  id SERIAL PRIMARY KEY,
  sales_order_id INTEGER,
  stage_name VARCHAR(200),
  is_approved INTEGER DEFAULT 0,
  created_by INTEGER,
  created_at TIMESTAMP NULL,
  updated_by INTEGER,
  updated_at TIMESTAMP NULL,
  is_deleted INTEGER DEFAULT 0
);


CREATE TABLE IF NOT EXISTS sales_order_chat (
  id SERIAL PRIMARY KEY,
  sales_order_id INTEGER,
  comment TEXT,
  created_by INTEGER,
  created_at TIMESTAMP NULL,
  CONSTRAINT fk_sales_order
    FOREIGN KEY (sales_order_id) 
    REFERENCES sales_orders(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sales_order_comments (
  id SERIAL PRIMARY KEY,
  sales_order_id INTEGER,
  created_by INTEGER,
  created_at TIMESTAMP NULL,
  comments VARCHAR(500),
  status VARCHAR(200),
  type VARCHAR(200),
  is_deleted INTEGER DEFAULT 0,
  CONSTRAINT fk_sales_order_comments
    FOREIGN KEY (sales_order_id) 
    REFERENCES sales_orders(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sales_order_documents (
  id SERIAL PRIMARY KEY,
  sales_order_id INTEGER,
  tag VARCHAR(200),
  file_name VARCHAR(200),
  file_path VARCHAR(500),
  file_type VARCHAR(100),
  metadata TEXT,
  is_deleted INTEGER DEFAULT 0,
  created_by INTEGER,
  created_at TIMESTAMP NULL,
  CONSTRAINT fk_sales_order_documents
    FOREIGN KEY (sales_order_id) 
    REFERENCES sales_orders(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sales_order_performa_invoice (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NULL,
  created_by INTEGER,
  is_deleted INTEGER DEFAULT 0,
  exporter_name VARCHAR(200),
  organization_id INTEGER,
  consignee_name VARCHAR(400),
  consignee_contact_details VARCHAR(400),
  consignee_address TEXT,
  performa_invoice_number VARCHAR(40),
  performa_invoice_date DATE,
  exporters_reference_number VARCHAR(200),
  other_references VARCHAR(400),
  other_buyer_name VARCHAR(400),
  country_of_origin VARCHAR(60),
  country_of_final_destination VARCHAR(60),
  prepration VARCHAR(200),
  port_of_discharge VARCHAR(400),
  place_of_receipt_by_pre_carrier VARCHAR(200),
  final_destination VARCHAR(200),
  terms_of_delivery VARCHAR(400),
  payment_terms VARCHAR(400),
  shipment_mode VARCHAR(60),
  port_of_loading VARCHAR(60),
  additionalCharges TEXT,
  total_amount FLOAT,
  previous_performa_invoice_id INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sales_order_performa_invoice_items (
  id SERIAL PRIMARY KEY,
  performa_invoice_id INTEGER,
  sales_order_id INTEGER,
  is_deleted INTEGER DEFAULT 0,
  item_id INTEGER,
  composition TEXT,
  dosage_name VARCHAR(200),
  product_cast VARCHAR(200),
  p_pack_short TEXT,
  p_quantity FLOAT,
  p_foc_qty FLOAT,
  p_billing_rate FLOAT
);

CREATE TABLE IF NOT EXISTS sales_order_quotation (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NULL,
  created_by INTEGER,
  is_deleted INTEGER DEFAULT 0,
  organization_id INTEGER,
  quotation_number VARCHAR(200),
  quotation_date DATE,
  customer_id INTEGER,
  advance_percentage FLOAT,
  charges TEXT,
  total_amount FLOAT,
  advance_amount FLOAT,
  prev_copy_quotation_id INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sales_order_quotation_items (
  id SERIAL PRIMARY KEY,
  quotation_id INTEGER,
  sales_order_id INTEGER,
  is_deleted INTEGER DEFAULT 0,
  item_id INTEGER,
  composition TEXT,
  dosage_name VARCHAR(200),
  product_cast VARCHAR(200),
  p_pack_short TEXT,
  so_status VARCHAR(200),
  p_quantity FLOAT,
  p_foc_qty FLOAT,
  p_mrp FLOAT,
  p_billing_rate FLOAT,
  comments TEXT,
  tax_percent FLOAT,
  product_extra_charges FLOAT,
  product_extra_charges_tax_percent FLOAT
);

CREATE TABLE IF NOT EXISTS sales_order_save_transactions (
  id SERIAL PRIMARY KEY,
  sales_order_id INTEGER,
  created_by INTEGER,
  created_at TIMESTAMP NULL,
  diff TEXT
);

CREATE TABLE IF NOT EXISTS ci_sessions (
  session_id VARCHAR(40) NOT NULL DEFAULT '0',
  ip_address VARCHAR(45) NOT NULL DEFAULT '0',
  user_agent VARCHAR(120),
  last_activity INTEGER NOT NULL DEFAULT 0,
  user_data TEXT
);

CREATE TABLE IF NOT EXISTS debitors_status (
  srno SERIAL PRIMARY KEY,
  custcd VARCHAR(45) NOT NULL,
  note1 VARCHAR(45) NOT NULL,
  note2 VARCHAR(45) NOT NULL,
  note3 VARCHAR(45) NOT NULL,
  note4 VARCHAR(45) NOT NULL,
  note5 VARCHAR(45) NOT NULL,
  overdue VARCHAR(45) NOT NULL,
  note1date VARCHAR(45) NOT NULL,
  note2date VARCHAR(45) NOT NULL,
  note3date VARCHAR(45) NOT NULL,
  note4date VARCHAR(45) NOT NULL,
  note5date VARCHAR(45) NOT NULL,
  overduesmith VARCHAR(45) NOT NULL,
  today VARCHAR(45) NOT NULL,
  tomorrow VARCHAR(45) NOT NULL,
  colorcd VARCHAR(45) NOT NULL,
  classification VARCHAR(45) NOT NULL,
  narration VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS drk_postatus (
  srno SERIAL PRIMARY KEY,
  pono VARCHAR(45) NOT NULL,
  itemcd VARCHAR(45) NOT NULL,
  itemname VARCHAR(45) NOT NULL,
  shortname VARCHAR(45) NOT NULL,
  ordinhand VARCHAR(45) NOT NULL,
  totcompaning VARCHAR(45) NOT NULL,
  extracap VARCHAR(45) NOT NULL,
  changepart VARCHAR(45) NOT NULL,
  mfgstatus VARCHAR(45) NOT NULL,
  rmstatus VARCHAR(45) NOT NULL,
  pmstatus VARCHAR(45) NOT NULL,
  comment VARCHAR(45) NOT NULL,
  plandate VARCHAR(45) NOT NULL,
  dispdate VARCHAR(45) NOT NULL,
  postatus VARCHAR(45) NOT NULL,
  ctninnerstatus VARCHAR(45) NOT NULL,
  ctnouterstatus VARCHAR(45) NOT NULL,
  foilstatus VARCHAR(45) NOT NULL,
  yeild VARCHAR(45) NOT NULL,
  pvctype VARCHAR(45) NOT NULL,
  pvcsize VARCHAR(45) NOT NULL,
  thikness VARCHAR(45) NOT NULL,
  pvcqty VARCHAR(45) NOT NULL,
  shipersize VARCHAR(45) NOT NULL,
  shipertype VARCHAR(45) NOT NULL,
  shipershrtname VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS employee (
  srno SERIAL PRIMARY KEY,
  empno INTEGER NOT NULL,
  name VARCHAR(300) NOT NULL,
  expr VARCHAR(200) NOT NULL,
  designation VARCHAR(300) NOT NULL,
  gender VARCHAR(150) NOT NULL,
  maritalstatus VARCHAR(150) NOT NULL,
  dob VARCHAR(50) NOT NULL,
  fathername VARCHAR(300) NOT NULL,
  contactno VARCHAR(50) NOT NULL,
  email VARCHAR(300) NOT NULL,
  specialisation VARCHAR(500) NOT NULL,
  language VARCHAR(500) NOT NULL,
  addr VARCHAR(500) NOT NULL,
  city VARCHAR(200) NOT NULL,
  dist VARCHAR(200) NOT NULL,
  state VARCHAR(200) NOT NULL,
  pin VARCHAR(50) NOT NULL,
  basic VARCHAR(200) NOT NULL,
  hq VARCHAR(200) NOT NULL,
  exhq VARCHAR(200) NOT NULL,
  outstation VARCHAR(200) NOT NULL,
  salestarget VARCHAR(200) NOT NULL,
  incentiveregular VARCHAR(200) NOT NULL,
  incentiveextra VARCHAR(200) NOT NULL,
  targetcust VARCHAR(200) NOT NULL,
  incentive VARCHAR(200) NOT NULL,
  call1 VARCHAR(200) NOT NULL,
  penalty VARCHAR(200) NOT NULL,
  username VARCHAR(200) NOT NULL,
  pass VARCHAR(200) NOT NULL,
  dateofjoin VARCHAR(50) NOT NULL,
  penaltyless DOUBLE PRECISION NOT NULL,
  penaltylate DOUBLE PRECISION NOT NULL,
  target2 VARCHAR(300) NOT NULL,
  resignationdate VARCHAR(50) NOT NULL,
  dailywork VARCHAR(100) NOT NULL,
  weeklywork VARCHAR(300) NOT NULL,
  monthlywork VARCHAR(500) NOT NULL,
  detaildesc VARCHAR(1000) NOT NULL,
  offerletter VARCHAR(100) NOT NULL,
  appointmentletter VARCHAR(100) NOT NULL,
  usersrno INTEGER NOT NULL,
  working_status VARCHAR(20) NOT NULL DEFAULT 'Working',
  department VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS mst_category (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  register_date VARCHAR(255),
  status VARCHAR(255) -- 0=>Inactive, 1=>Active, 2=>Blocked
);

CREATE TABLE IF NOT EXISTS mst_cian_export (
  cian_export_id SERIAL PRIMARY KEY,
  brand_name VARCHAR(255),
  manager_name VARCHAR(255),
  pack VARCHAR(255),
  pack_style VARCHAR(255),
  generic_name VARCHAR(255),
  composition VARCHAR(255),
  category VARCHAR(255),
  dosage_name VARCHAR(255),
  country VARCHAR(255),
  country_name VARCHAR(250) NOT NULL,
  company_client VARCHAR(255),
  agreed_term VARCHAR(255),
  cif VARCHAR(255),
  fob VARCHAR(255),
  ex_factory VARCHAR(255),
  moq VARCHAR(255),
  average_rate INTEGER,
  product_mnf_cost INTEGER,
  status VARCHAR(255),           -- 1=>CDA Signed, 2=>Dist Agmt Signed
  dossier_work VARCHAR(255),     -- 1=>Consultant, 2=>In-House
  product_approval VARCHAR(255), -- 1=>Available,2=>To be Applied
  pp_copy VARCHAR(250),
  approval_date VARCHAR(255),
  loa VARCHAR(255),              -- 1=>Sent, 2=>Pending, 3=>Not Required
  qty_sample_require VARCHAR(255),
  fsc VARCHAR(255),              -- 1=>Available, 2=>To be Applied, 3=>Not Required
  fsc_copy VARCHAR(250),
  copp VARCHAR(255),             -- 1=>Available, 2=>To be Applied, 3=>Not Required
  copp_copy VARCHAR(250),
  stability VARCHAR(255),        -- 1=>Available, 2=>To be Made Available
  stability_copy VARCHAR(250),
  amv VARCHAR(255),              -- 1=>Available, 2=>To Be Procured, 3=>Not Required
  amv_copy VARCHAR(250),
  dmf VARCHAR(255),              -- 1=>Available, 2=>To Be Procured, 3=>Not Required
  dmf_copy VARCHAR(250),
  ba_be VARCHAR(255),            -- 1=>Available, 2=>To Be Procured, 3=>Not Required
  ba_be_copy VARCHAR(250),
  psur VARCHAR(255),             -- 1=>Available, 2=>To Be Procured, 3=>Not Required
  psur_copy VARCHAR(250),
  rest_dossier_team VARCHAR(255),-- 1=>Available, 2=>To Be Procured, 3=>Not Required
  dossier_status VARCHAR(250),   -- Ready, Under Preparation
  dossier_sent VARCHAR(255),     -- 1=>Hard Copy & Date, 2=>Email & Date 3=>E Submission & Date
  dossier_copy VARCHAR(250),
  dossier_date VARCHAR(250),
  sample_sent VARCHAR(255),      -- 1=>Sent,2=>Pending
  review_status VARCHAR(255),
  registration_no VARCHAR(255),
  registration_date VARCHAR(255),
  expiry_date VARCHAR(255),
  registartion_received VARCHAR(255),
  registartion_copy VARCHAR(250),
  cian_status VARCHAR(255),      -- 0=>Inactive,1=>Active
  created_date VARCHAR(255),
  updated_date VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS mst_cian_plant (
  id SERIAL PRIMARY KEY,
  department VARCHAR(255),
  item_name VARCHAR(255),
  composition TEXT,
  transfer_order_num VARCHAR(255),
  tnx_date VARCHAR(255),
  po_qty VARCHAR(255),
  recive_qty VARCHAR(255),
  pnd_qty VARCHAR(255),
  dispatch_date VARCHAR(255),
  current_status VARCHAR(255),
  rm_plant VARCHAR(255),
  pm_plant VARCHAR(255),
  rm_office VARCHAR(255),
  pm_office VARCHAR(255),
  naration VARCHAR(255),
  last_given_date1 VARCHAR(255),
  naration1 VARCHAR(255),
  last_given_date2 VARCHAR(255),
  naration2 VARCHAR(255),
  last_given_date3 VARCHAR(255),
  naration3 VARCHAR(255),
  bde_name VARCHAR(255),
  sales_party_name VARCHAR(255),
  is_edit VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS mst_country (
  country_id SERIAL PRIMARY KEY,
  country_name VARCHAR(255),
  register_date VARCHAR(255),
  status VARCHAR(255)  -- 0=>Inactive, 1=>Active, 2=>Blocked
);

CREATE TABLE IF NOT EXISTS dosage (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  register_date VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS mst_email_template_macros (
  macro_id SERIAL PRIMARY KEY,
  macros VARCHAR(100) NOT NULL,
  value VARCHAR(100) NOT NULL,
  created_date TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS mst_privileges (
  privileges_id INTEGER PRIMARY KEY,
  privilege_name VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS mst_role (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS mst_users (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(20) NOT NULL,
  first_name VARCHAR(150),
  last_name VARCHAR(150),
  user_email VARCHAR(250),
  user_password VARCHAR(150) NOT NULL,
  gender VARCHAR(100) NOT NULL,
  profile_picture VARCHAR(20),
  user_type VARCHAR(1) NOT NULL CHECK (user_type IN ('1', '2')), -- 1=>Normal, 2=>admin
  is_dashboard INTEGER CHECK (is_dashboard IN (0, 1)),
  role_id INTEGER NOT NULL,
  user_status VARCHAR(1) NOT NULL CHECK (user_status IN ('0', '1', '2')), -- 0=>Inactive, 1=>Active, 2=>Blocked
  activation_code VARCHAR(20),
  imei_number VARCHAR(100) NOT NULL,
  Is_skipped INTEGER,
  zodiac_sign VARCHAR(100),
  fb_id VARCHAR(25),
  g_id VARCHAR(255),
  user_birth_date VARCHAR(100),
  register_date TIMESTAMP,
  email_verified INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS partywiseorder (
  srno SERIAL PRIMARY KEY,
  order_date VARCHAR(20) NOT NULL,
  username VARCHAR(200) NOT NULL,
  partyname VARCHAR(200) NOT NULL,
  productname VARCHAR(200),
  productcode VARCHAR(200) NOT NULL,
  customercode VARCHAR(200) NOT NULL,
  order_qun VARCHAR(200) NOT NULL,
  temp_rate VARCHAR(100) NOT NULL,
  bill_amount DOUBLE PRECISION NOT NULL,
  location VARCHAR(200) NOT NULL,
  financial_year VARCHAR(200) NOT NULL,
  note VARCHAR(1000) NOT NULL,
  freeqty VARCHAR(45) NOT NULL,
  oldrate VARCHAR(45) NOT NULL,
  grate VARCHAR(45) NOT NULL,
  batchno VARCHAR(45) NOT NULL,
  expdate VARCHAR(45) NOT NULL,
  hsncode VARCHAR(45) NOT NULL,
  pack VARCHAR(45) NOT NULL,
  mrp VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS poraisestatus (
  srno SERIAL PRIMARY KEY,
  itemcode VARCHAR(45) NOT NULL,
  pono VARCHAR(45) NOT NULL,
  ned VARCHAR(45) NOT NULL,
  ord VARCHAR(45) NOT NULL,
  remark VARCHAR(150) NOT NULL,
  date VARCHAR(45) NOT NULL,
  fy VARCHAR(45) NOT NULL,
  need2 VARCHAR(45) NOT NULL,
  po_qty VARCHAR(45) NOT NULL,
  splschame VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS postatus (
  srno SERIAL PRIMARY KEY,
  pono VARCHAR(45) NOT NULL,
  itemcode VARCHAR(45) NOT NULL,
  dispqty VARCHAR(45) NOT NULL,
  currstatus VARCHAR(45) NOT NULL,
  rmstatus VARCHAR(45) NOT NULL,
  pmstatus VARCHAR(45) NOT NULL,
  granulationmc VARCHAR(45) NOT NULL,
  gdate VARCHAR(45) NOT NULL,
  gshift VARCHAR(45) NOT NULL,
  genddate VARCHAR(45) NOT NULL,
  comprationmc VARCHAR(45) NOT NULL,
  cmpstartdate VARCHAR(45) NOT NULL,
  cmpshift VARCHAR(45) NOT NULL,
  compenddate VARCHAR(45) NOT NULL,
  coatingmc VARCHAR(45) NOT NULL,
  costartdate VARCHAR(45) NOT NULL,
  coshift VARCHAR(45) NOT NULL,
  coenddate VARCHAR(45) NOT NULL,
  quaraninwarddt VARCHAR(45) NOT NULL,
  quaranqty VARCHAR(45) NOT NULL,
  packingmc VARCHAR(45) NOT NULL,
  pckingdate VARCHAR(45) NOT NULL,
  pckingshift VARCHAR(45) NOT NULL,
  pkgenddate VARCHAR(45) NOT NULL,
  strpcolldate VARCHAR(45) NOT NULL,
  fnlpckingdate VARCHAR(45) NOT NULL,
  contname VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS productactivitylog (
  srno SERIAL PRIMARY KEY,
  productcode VARCHAR(45) NOT NULL,
  productname VARCHAR(45) NOT NULL,
  batchno VARCHAR(45) NOT NULL,
  pono VARCHAR(45) NOT NULL,
  poqty VARCHAR(45) NOT NULL,
  stagename VARCHAR(45) NOT NULL,
  date VARCHAR(45) NOT NULL,
  starttime VARCHAR(45) NOT NULL,
  endtime VARCHAR(45) NOT NULL,
  output VARCHAR(45) NOT NULL,
  username VARCHAR(45) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  fy VARCHAR(45) NOT NULL,
  note VARCHAR(100) NOT NULL,
  timeconsume VARCHAR(45) NOT NULL,
  opname VARCHAR(45) NOT NULL,
  ipqaname VARCHAR(45) NOT NULL,
  dept VARCHAR(45) NOT NULL,
  status VARCHAR(45) NOT NULL,
  dosagename VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS quationnewsalesparty (
  srno SERIAL PRIMARY KEY,
  customername VARCHAR(200) NOT NULL,
  ContactNo VARCHAR(50),
  ContactPer VARCHAR(150),
  Email_id VARCHAR(100) NOT NULL,
  BD_Name VARCHAR(100) NOT NULL,
  countryname VARCHAR(100) NOT NULL,
  depttype VARCHAR(100) NOT NULL,
  fiancialyear VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS salespartyquotation (
  srno SERIAL PRIMARY KEY,
  qono INTEGER NOT NULL,
  qoreffno VARCHAR(100) NOT NULL,
  qodate DATE NOT NULL,
  pcast VARCHAR(100) NOT NULL,
  customername VARCHAR(100) NOT NULL,
  mfgname VARCHAR(200) NOT NULL,
  productname VARCHAR(100) NOT NULL,
  producttype VARCHAR(50),
  composition VARCHAR(5000) NOT NULL,
  orderqty VARCHAR(100) NOT NULL,
  packing VARCHAR(100) NOT NULL,
  txrate VARCHAR(20) NOT NULL,
  ratedecided VARCHAR(20) NOT NULL,
  offerrateupdate VARCHAR(100) NOT NULL, -- 'used for user name whose update by offer rate'
  mrpperstrip VARCHAR(20) NOT NULL,
  mpdate VARCHAR(50),
  delivery_date VARCHAR(50),
  comment VARCHAR(2000) NOT NULL,
  finalcomment VARCHAR(5000),
  hocomment VARCHAR(5000) NOT NULL, -- 'use for Dept.Head'
  New_Flag VARCHAR(100) NOT NULL,
  saveflag VARCHAR(100) NOT NULL,
  qotype VARCHAR(100) NOT NULL,
  createuser VARCHAR(500),
  updateuser VARCHAR(500),
  finacialyear VARCHAR(100),
  totalamt VARCHAR(50),
  onetimecharge VARCHAR(50),
  gstrate VARCHAR(50) NOT NULL,
  gstamt VARCHAR(45) NOT NULL,
  onetimechrgtotal VARCHAR(45) NOT NULL,
  onetimechrgper VARCHAR(45) NOT NULL,
  advper VARCHAR(45) NOT NULL,
  advamt VARCHAR(45) NOT NULL,
  onetimechrgtotamt VARCHAR(45) NOT NULL,
  totalquoamt VARCHAR(45) NOT NULL,
  quotype VARCHAR(45) NOT NULL,
  artwrkcd VARCHAR(45) NOT NULL,
  pvcthikness VARCHAR(45) NOT NULL,
  fnlquodate VARCHAR(45) NOT NULL
);

-- Indexes (equivalent to MySQL KEYs)
CREATE INDEX salespartyquotation_qoreffno_index ON salespartyquotation(qoreffno);
CREATE INDEX salespartyquotation_productname_index ON salespartyquotation(productname);
CREATE INDEX salespartyquotation_qoreffno_productname_index ON salespartyquotation(qoreffno, productname);


CREATE TABLE IF NOT EXISTS salesquotationfinal (
  srno SERIAL PRIMARY KEY,
  fqono INTEGER NOT NULL,
  fqoreffno VARCHAR(100) NOT NULL,
  fqodate DATE NOT NULL,
  fpcast VARCHAR(100) NOT NULL,
  fcustomername VARCHAR(100) NOT NULL,
  fmfgname VARCHAR(200) NOT NULL,
  fproductname VARCHAR(100) NOT NULL,
  fproducttype VARCHAR(150),
  fcomposition VARCHAR(5000) NOT NULL,
  forderqty VARCHAR(10) NOT NULL,
  fpacking VARCHAR(100) NOT NULL,
  fxrate VARCHAR(20) NOT NULL,
  fratedecided VARCHAR(20) NOT NULL,
  fofferrateupdate VARCHAR(100) NOT NULL, -- used for user name whose update by offer rate
  fmrpperstrip VARCHAR(20) NOT NULL,
  fmpdate VARCHAR(50),
  fdelivery_date VARCHAR(50),
  fcomment VARCHAR(2000) NOT NULL,
  ffinalcomment VARCHAR(5000) NOT NULL,
  fNew_Flag VARCHAR(100) NOT NULL,
  fsaveflag VARCHAR(100) NOT NULL,
  fqotype VARCHAR(100) NOT NULL,
  Narration VARCHAR(500),
  createuser VARCHAR(500),
  updateuser VARCHAR(500),
  ftotalamt VARCHAR(50) NOT NULL,
  fonetimecharge VARCHAR(50) NOT NULL,
  fgstrate VARCHAR(45) NOT NULL,
  fgstamt VARCHAR(45) NOT NULL,
  fonetimechrgtotal VARCHAR(45) NOT NULL,
  fonetimechrgper VARCHAR(45) NOT NULL,
  fadvper VARCHAR(45) NOT NULL,
  fadvamt VARCHAR(45) NOT NULL,
  fonetimechrgtotamt VARCHAR(45) NOT NULL,
  ftotalquoamt VARCHAR(45) NOT NULL,
  finacialyear VARCHAR(50) NOT NULL,
  fquotype VARCHAR(45) NOT NULL
);


CREATE TABLE IF NOT EXISTS tbl_advmaster (
  srno SERIAL PRIMARY KEY,
  advname VARCHAR(45) NOT NULL,
  contactno VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_bondedstock (
  srno SERIAL PRIMARY KEY,
  sono VARCHAR(45) NOT NULL,
  remark VARCHAR(45) NOT NULL,
  date VARCHAR(45) NOT NULL,
  colorcd VARCHAR(45) NOT NULL
);


CREATE TABLE IF NOT EXISTS tbl_cbox (
  srno SERIAL PRIMARY KEY,
  shippersize VARCHAR(45) NOT NULL,
  prdcount VARCHAR(45) NOT NULL,
  cboxqrty VARCHAR(45) NOT NULL
);


CREATE TABLE IF NOT EXISTS tbl_cianproductlist (
  srno SERIAL PRIMARY KEY,
  fgitemcd VARCHAR(45) NOT NULL,
  productname VARCHAR(45) NOT NULL,
  composition VARCHAR(500) NOT NULL,
  trpticcatgory VARCHAR(45) NOT NULL,
  subcatgory VARCHAR(45) NOT NULL,
  dosagename VARCHAR(45) NOT NULL,
  packshort VARCHAR(45) NOT NULL,
  packstyle VARCHAR(45) NOT NULL,
  size VARCHAR(45) NOT NULL,
  alualucpart VARCHAR(45) NOT NULL,
  blistercpart VARCHAR(45) NOT NULL,
  alustripcpart VARCHAR(45) NOT NULL,
  foilsize VARCHAR(45) NOT NULL,
  packsize VARCHAR(45) NOT NULL,
  ctnsize VARCHAR(45) NOT NULL,
  shpersize VARCHAR(45) NOT NULL,
  granu VARCHAR(45) NOT NULL,
  compresion VARCHAR(45) NOT NULL,
  coating VARCHAR(45) NOT NULL,
  pcking VARCHAR(45) NOT NULL,
  ptype VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_cosmaticvendordtl (
  srno SERIAL PRIMARY KEY,
  companyname VARCHAR(45) NOT NULL,
  ctprname VARCHAR(45) NOT NULL,
  contactno VARCHAR(45) NOT NULL,
  emailid VARCHAR(45) NOT NULL,
  productprofile VARCHAR(45) NOT NULL,
  materialpur VARCHAR(45) NOT NULL,
  note VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_cpartmachinename (
  srno SERIAL PRIMARY KEY,
  cpart VARCHAR(45) NOT NULL,
  mname1 VARCHAR(45) NOT NULL,
  mname2 VARCHAR(45) NOT NULL,
  mname3 VARCHAR(45) NOT NULL,
  mname4 VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_cpartwisectnsize (
  srno SERIAL PRIMARY KEY,
  cpart VARCHAR(45) NOT NULL,
  pack VARCHAR(45) NOT NULL,
  ctnsize VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_cpartwisestdqty (
  srno SERIAL PRIMARY KEY,
  cpart VARCHAR(45) NOT NULL,
  stdqty VARCHAR(45) NOT NULL,
  foilpvctype VARCHAR(45) NOT NULL,
  npmsize VARCHAR(45) NOT NULL,
  npmstdqty VARCHAR(45) NOT NULL,
  pfoilsize VARCHAR(45) NOT NULL,
  ctnsize VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_creditors_legalstatus (
  srno SERIAL PRIMARY KEY,
  vendcd VARCHAR(45) NOT NULL,
  vendorname VARCHAR(45) NOT NULL,
  casetype VARCHAR(45) NOT NULL,
  noticedt VARCHAR(45) NOT NULL,
  noticeamt VARCHAR(45) NOT NULL,
  rplydt VARCHAR(45) NOT NULL,
  caseno VARCHAR(45) NOT NULL,
  courtname VARCHAR(45) NOT NULL,
  advname VARCHAR(45) NOT NULL,
  upcomingdt VARCHAR(45) NOT NULL,
  casestatus VARCHAR(45) NOT NULL,
  hearingdt1 VARCHAR(45) NOT NULL,
  hearingnote VARCHAR(200) NOT NULL,
  remark VARCHAR(200) NOT NULL,
  advcontno VARCHAR(45) NOT NULL,
  hearingdt5 VARCHAR(45) NOT NULL,
  loccd VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_cust_pmstk (
  srno SERIAL PRIMARY KEY,
  custcd VARCHAR(45) NOT NULL,
  custname VARCHAR(45) NOT NULL,
  itemname VARCHAR(45) NOT NULL,
  note VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_customerwise_mgr (
  srno SERIAL PRIMARY KEY,
  custcd VARCHAR(45) NOT NULL,
  sales1 VARCHAR(45) NOT NULL,
  sales2 VARCHAR(45) NOT NULL,
  subordinate1 VARCHAR(45) NOT NULL,
  subordinate2 VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_custpaymentdtl (
  srno SERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  description VARCHAR(450) NOT NULL,
  cramt VARCHAR(45) NOT NULL,
  partyname VARCHAR(45) NOT NULL,
  dept VARCHAR(45) NOT NULL,
  status VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_exportpkglist (
  srno SERIAL PRIMARY KEY,
  invid VARCHAR(45) NOT NULL,
  invdt VARCHAR(45) NOT NULL,
  exprefno VARCHAR(45) NOT NULL,
  itemcd VARCHAR(45) NOT NULL,
  itemname VARCHAR(45) NOT NULL,
  hsncd VARCHAR(45) NOT NULL,
  dimcasemm VARCHAR(45) NOT NULL,
  caseno VARCHAR(45) NOT NULL,
  noofshipper VARCHAR(45) NOT NULL,
  noctnshper VARCHAR(45) NOT NULL,
  totwgtkg VARCHAR(45) NOT NULL,
  totnwtkg VARCHAR(45) NOT NULL,
  batchno VARCHAR(45) NOT NULL,
  mfddate VARCHAR(45) NOT NULL,
  expdate VARCHAR(45) NOT NULL,
  totqty_ctn VARCHAR(45) NOT NULL,
  custname VARCHAR(45) NOT NULL,
  precarriage VARCHAR(45) NOT NULL,
  portdischarge VARCHAR(45) NOT NULL,
  placereceipt VARCHAR(45) NOT NULL,
  fnldestn VARCHAR(45) NOT NULL,
  countryorigin VARCHAR(45) NOT NULL,
  countryfnldestn VARCHAR(45) NOT NULL,
  termdelivery VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_fgpodetail (
  srno SERIAL PRIMARY KEY,
  pono VARCHAR(45) NOT NULL,
  itemcd VARCHAR(45) NOT NULL,
  itemname VARCHAR(45) NOT NULL,
  despense VARCHAR(45) NOT NULL,
  quarantine VARCHAR(45) NOT NULL,
  stripcoll VARCHAR(45) NOT NULL,
  qc VARCHAR(45) NOT NULL,
  fgtn VARCHAR(45) NOT NULL,
  dispatch VARCHAR(45) NOT NULL,
  shrt VARCHAR(45) NOT NULL,
  despndt VARCHAR(45) NOT NULL,  -- use column for designer to date
  qarndt VARCHAR(45) NOT NULL,
  strpcolldt VARCHAR(45) NOT NULL,
  qcdt VARCHAR(45) NOT NULL,     -- for PM Delivery Date
  fgtndt VARCHAR(45) NOT NULL,
  dispdt VARCHAR(45) NOT NULL,
  reason VARCHAR(155) NOT NULL,
  tentivedt VARCHAR(45) NOT NULL,
  machinname VARCHAR(45) NOT NULL,
  stripdt VARCHAR(45) NOT NULL,  -- Use for Designer frm date
  note VARCHAR(500) NOT NULL,
  qcnote VARCHAR(45) NOT NULL,
  mname1 VARCHAR(45) NOT NULL,
  mname2 VARCHAR(45) NOT NULL,
  mname3 VARCHAR(45) NOT NULL,
  status VARCHAR(100) NOT NULL,
  rmstatus VARCHAR(45) NOT NULL,
  rmnote VARCHAR(150) NOT NULL,
  pmstatus VARCHAR(45) NOT NULL,
  pmnote VARCHAR(150) NOT NULL,
  shortname VARCHAR(150) NOT NULL,
  packingdate VARCHAR(45) NOT NULL,
  granulation VARCHAR(45) NOT NULL,
  mfgdate VARCHAR(45) NOT NULL,
  shifttime1 VARCHAR(45) NOT NULL,
  shifttime2 VARCHAR(45) NOT NULL,
  pshift_time1 VARCHAR(45) NOT NULL,
  pshift_time2 VARCHAR(45) NOT NULL,
  bd_note VARCHAR(150) NOT NULL,
  plantnote VARCHAR(150) NOT NULL,
  npmstatus VARCHAR(45) NOT NULL,
  npmnote VARCHAR(150) NOT NULL,
  username VARCHAR(45) NOT NULL,
  pkgtime VARCHAR(45) NOT NULL,
  machine VARCHAR(150) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  lbrtype VARCHAR(45) NOT NULL,
  vname VARCHAR(45) NOT NULL,
  lbrtime VARCHAR(45) NOT NULL,
  lbrqty VARCHAR(45) NOT NULL,
  fgpo_qadate TIMESTAMP NOT NULL,
  qa_bddate TIMESTAMP NOT NULL,
  bd_costingdate TIMESTAMP NOT NULL,
  costing_fgpodate TIMESTAMP NOT NULL,
  socount VARCHAR(45) NOT NULL,
  shippersize VARCHAR(150) NOT NULL,
  shipperqty VARCHAR(45) NOT NULL,
  shipperstatus VARCHAR(45) NOT NULL,
  final_so_status VARCHAR(100),
  manufacturers_name VARCHAR(100),
  rate_received VARCHAR(100),
  manufacturers_comment TEXT
);

CREATE TABLE IF NOT EXISTS tbl_fgpotrack (
  srno SERIAL PRIMARY KEY,
  pono VARCHAR(45) NOT NULL,
  itemcd VARCHAR(45) NOT NULL,
  dgnagndate VARCHAR(45) NOT NULL,
  dgnrtndate VARCHAR(45) NOT NULL,
  dgname VARCHAR(45) NOT NULL,
  dgnstatus VARCHAR(45) NOT NULL,
  pmagndate VARCHAR(45) NOT NULL,
  pmdretdate VARCHAR(45) NOT NULL,
  pmdstatus VARCHAR(45) NOT NULL,
  rmagndate VARCHAR(45) NOT NULL,
  rmretdate VARCHAR(45) NOT NULL,
  rmstatus VARCHAR(45) NOT NULL,
  porecdate VARCHAR(45) NOT NULL,
  npasgndate VARCHAR(45) NOT NULL,
  npretdate VARCHAR(45) NOT NULL,
  npstatus VARCHAR(45) NOT NULL,
  reason VARCHAR(450) NOT NULL,
  dgnreason VARCHAR(45) NOT NULL,
  pmpur VARCHAR(45) NOT NULL,
  pmstoreremark VARCHAR(45) NOT NULL,
  rmpur VARCHAR(45) NOT NULL,
  rmstoreremark VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_fgstock_remark (
  srno SERIAL PRIMARY KEY,
  itemcd VARCHAR(45) NOT NULL,
  bdname VARCHAR(45) NOT NULL,
  dept VARCHAR(45) NOT NULL,
  bdcomment VARCHAR(250) NOT NULL,
  username VARCHAR(45) NOT NULL
);


CREATE TABLE IF NOT EXISTS tbl_legalremark (
  srno SERIAL PRIMARY KEY,
  vendorcd VARCHAR(45) NOT NULL,
  vendorname VARCHAR(150) NOT NULL,
  caseno VARCHAR(45) NOT NULL,
  noticedt VARCHAR(45) NOT NULL,
  replydt VARCHAR(45) NOT NULL,
  upcomingdt VARCHAR(45) NOT NULL,
  hearingdt VARCHAR(45) NOT NULL,
  remark VARCHAR(150) NOT NULL,
  hearingnote VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_login_transactions (
  id SERIAL PRIMARY KEY,
  application VARCHAR(50) DEFAULT NULL,
  ip_address VARCHAR(50) DEFAULT NULL,
  port VARCHAR(10) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  reason TEXT,
  details TEXT
);

CREATE TABLE IF NOT EXISTS tbl_machine_master (
  machine_id SERIAL PRIMARY KEY,
  machine_name VARCHAR(200),
  machine_type VARCHAR(200),
  machine_capacity VARCHAR(200),
  machine_status VARCHAR(200),
  is_deleted INTEGER,
  machine_image VARCHAR(1000)
);

CREATE TABLE IF NOT EXISTS tbl_mistakeinfo (
  srno SERIAL PRIMARY KEY,
  date VARCHAR(45) NOT NULL,
  mistakedtl VARCHAR(5000) NOT NULL,
  valuedtl VARCHAR(200) NOT NULL,
  rmbkstatus VARCHAR(45) NOT NULL,
  pmbkstatus VARCHAR(45) NOT NULL,
  actableuser VARCHAR(45) NOT NULL,
  username VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_npm (
  srno SERIAL PRIMARY KEY,
  cpart VARCHAR(45) NOT NULL,
  foilpvctype VARCHAR(45) NOT NULL,
  size VARCHAR(45) NOT NULL,
  unit VARCHAR(45) NOT NULL,
  foilsize VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_npmphystk (
  srno SERIAL PRIMARY KEY,
  pmcode VARCHAR(45) NOT NULL,
  phystk VARCHAR(45) NOT NULL,
  note VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_orddetail (
  srno SERIAL PRIMARY KEY,
  date VARCHAR(45) NOT NULL,
  custcd VARCHAR(45) NOT NULL,
  custname VARCHAR(45) NOT NULL,
  ordstatus VARCHAR(45) NOT NULL,
  description VARCHAR(500) NOT NULL,
  comment VARCHAR(500) NOT NULL,
  bdname VARCHAR(45) NOT NULL,
  qty VARCHAR(45) NOT NULL,
  rate VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_paymenystatus (
  srno SERIAL PRIMARY KEY,
  date VARCHAR(150) NOT NULL,
  partyname VARCHAR(45) NOT NULL,
  ptype VARCHAR(45) NOT NULL,
  narration VARCHAR(250) NOT NULL,
  amt VARCHAR(45) NOT NULL,
  payment_status VARCHAR(45) NOT NULL,
  entrydate VARCHAR(45) NOT NULL,
  releaseamt VARCHAR(45) NOT NULL,
  releasedate VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_pcdtraget (
  srno SERIAL PRIMARY KEY,
  custcd VARCHAR(45) NOT NULL,
  custname VARCHAR(45) NOT NULL,
  traget VARCHAR(45) NOT NULL,
  monthlytraget VARCHAR(45) NOT NULL,
  fy VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_pettycash (
  srno SERIAL PRIMARY KEY,
  date VARCHAR(45) NOT NULL,
  vchid VARCHAR(45) NOT NULL,
  ledger_name VARCHAR(150) NOT NULL,
  note VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_pm_physical_stock_qty (
  id SERIAL PRIMARY KEY,
  sono VARCHAR(45),
  "P-CARTON-qty" INTEGER,
  "P-ICARTON-qty" INTEGER,
  "P-FOIL-qty" INTEGER,
  "P-TUBE-qty" INTEGER,
  "P-LABEL-qty" INTEGER,
  "LEAFLET-qty" INTEGER,
  "PTD-BASE-FOIL-qty" INTEGER,
  "P-ICARTON-explanation" TEXT,
  "P-CARTON-explanation" TEXT,
  "P-FOIL-explanation" TEXT,
  "PTD-BASE-FOIL-explanation" TEXT,
  "P-TUBE-explanation" TEXT,
  "P-LABEL-explanation" TEXT,
  "LEAFLET-explanation" TEXT
);

-- Add an index on 'sono' for performance if needed
CREATE INDEX tbl_pm_physical_stock_qty_sono_index ON tbl_pm_physical_stock_qty (sono);

CREATE TABLE IF NOT EXISTS tbl_pm_planning_data (
  id SERIAL PRIMARY KEY,
  soid VARCHAR(45) NOT NULL,
  pm_subtype VARCHAR(45) NOT NULL,
  physical_stock DECIMAL(10,5),
  vendor_1 VARCHAR(45),
  rate_1 DECIMAL(10,5),
  vendor_2 VARCHAR(45),
  rate_2 DECIMAL(10,5),
  vendor_3 VARCHAR(45),
  rate_3 DECIMAL(10,5),
  vendor_4 VARCHAR(45),
  rate_4 DECIMAL(10,5),
  vendor_5 VARCHAR(45),
  rate_5 DECIMAL(10,5),
  vendor_6 VARCHAR(45),
  rate_6 DECIMAL(10,5),
  vendor_7 VARCHAR(45),
  rate_7 DECIMAL(10,5),
  selected_vendor SMALLINT,
  expected_receive_date DATE,
  pm_requirement_date DATE,
  analytics_explanation TEXT,
  debit_note_status VARCHAR(40),
  order_followup_status VARCHAR(40),
  order_followup_comment TEXT,
  planning_comment TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP,
  updated_by INTEGER,
  -- Composite index (manual creation)
  CONSTRAINT tbl_pm_planning_data_soid_pm_subtype_index UNIQUE (soid, pm_subtype)
);

CREATE TABLE IF NOT EXISTS tbl_pmphystktrack (
  srno SERIAL PRIMARY KEY,
  sono VARCHAR(45) NOT NULL,
  itemcd VARCHAR(45) NOT NULL,
  phystk VARCHAR(45) NOT NULL,
  username VARCHAR(45) NOT NULL,
  date VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_pmpostatus (
  srno SERIAL PRIMARY KEY,
  pmpono VARCHAR(45) NOT NULL,
  vendorname VARCHAR(45) NOT NULL,
  sorno VARCHAR(45) NOT NULL,
  pmdate VARCHAR(45) NOT NULL,
  remarkdate VARCHAR(45) NOT NULL,
  itemcd VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_pndsowisepm (
  srno SERIAL PRIMARY KEY,
  sono VARCHAR(45) NOT NULL,
  itemcd VARCHAR(45) NOT NULL,
  itemname VARCHAR(45) NOT NULL,
  effect1 VARCHAR(45) NOT NULL,
  effect2 VARCHAR(45) NOT NULL,
  effect3 VARCHAR(45) NOT NULL,
  paper VARCHAR(45) NOT NULL,
  gsm VARCHAR(45) NOT NULL,
  phystk VARCHAR(45) NOT NULL,
  reqqty VARCHAR(45) NOT NULL,
  v1name VARCHAR(45) NOT NULL,
  v1rate VARCHAR(45) NOT NULL,
  v2name VARCHAR(45) NOT NULL,
  v2rate VARCHAR(45) NOT NULL,
  v3name VARCHAR(45) NOT NULL,
  v3rate VARCHAR(45) NOT NULL,
  ctrlsample VARCHAR(45) NOT NULL,
  pmtype VARCHAR(45) NOT NULL,
  createuser VARCHAR(45) NOT NULL,
  updateuser VARCHAR(45) NOT NULL
);

-- Create an index on 'sono'
CREATE INDEX tbl_pndsowisepm_sono_index ON tbl_pndsowisepm (sono);

CREATE TABLE IF NOT EXISTS tbl_po_additional_data (
  id SERIAL PRIMARY KEY,
  poid VARCHAR(45),
  item_code VARCHAR(45),
  po_current_status VARCHAR(60),
  po_dispatch_date TIMESTAMP,
  po_client_received_date TIMESTAMP,
  total_receivable_amount FLOAT,
  advance_received FLOAT,
  advance_percentage FLOAT,
  credit_days INTEGER,
  our_artwork_note TEXT,
  note TEXT,
  billing_th VARCHAR(45),
  billing_comment TEXT,
  m_rate_on_bill FLOAT,
  m_manufacturer_extra_charges FLOAT,
  m_rm_status VARCHAR(45),
  m_pm_status VARCHAR(45),
  m_manufacturing_status VARCHAR(45),
  m_artwork_note TEXT,
  m_note TEXT,
  m_estimated_delivery_date DATE,
  m_number_cases VARCHAR(45),
  m_updated_time TIMESTAMP,
  m_updated_username VARCHAR(45),
  delivery_type VARCHAR(45),
  other_charges FLOAT,
  cylinder_charges FLOAT,
  transporter_gst_number VARCHAR(100),
  transporter_name VARCHAR(100),
  transporter_lr_number VARCHAR(100),
  upload_transport_lr TEXT,
  upload_invoice TEXT,
  upload_eway_bill TEXT
);

-- Index for (poid, item_code)
CREATE INDEX tbl_po_additional_data_poid_item_code_index 
  ON tbl_po_additional_data (poid, item_code);
