-- CIAN Pharma ERP Database Schema
-- PostgreSQL Database Structure

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
-- ============================================
-- 1. USER MANAGEMENT & AUTHENTICATION
-- ============================================

-- Roles Master // Sales
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- Permissions Master // Can place sales
CREATE TABLE permissions ( 
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    module_name VARCHAR(50) NOT NULL,
    action_type VARCHAR(20) NOT NULL, -- READ, READWRITE, DELETE, FULLCONTROL
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role Permissions Mapping
CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    permission_id INTEGER NOT NULL REFERENCES permissions(id),
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by INTEGER,
    UNIQUE(role_id, permission_id)
);

-- Users Master
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    employee_id VARCHAR(20) UNIQUE,
    phone VARCHAR(15),
    dob TIMESTAMP,
    gender VARCHAR(1),
    department VARCHAR(50),
    designation VARCHAR(50),
    reporting_manager INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    password_changed_at TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    is_locked BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- User Roles Mapping
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    role_id INTEGER NOT NULL REFERENCES roles(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, role_id)
);

-- User Sessions (for session management)
CREATE TABLE user_sessions (
    session_id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- 2. ORGANIZATION STRUCTURE
-- ============================================


CREATE TABLE location_type (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

CREATE TABLE organizations (
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
    employment_status_code Varchar(50)
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

-- organization account details
CREATE TABLE organization_accounts (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(organization_id),
    account_type VARCHAR(20) NOT NULL, -- BANK, PAYPAL, etc.
    account_number VARCHAR(50) NOT NULL,
    bank_name VARCHAR(100),
    ifsc_code VARCHAR(15),
    swift_code VARCHAR(11),
    account_holder_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);


-- ============================================
-- 3. ITEM MASTER
-- ============================================

-- Unit of Measure
CREATE TABLE unit_of_measures (
    id SERIAL PRIMARY KEY,
    uom_code VARCHAR(10) UNIQUE NOT NULL,
    uom_name VARCHAR(50) NOT NULL, -- PCS, STRIP, BOX, VIAL, ML, MG, etc.
    conversion_factor DECIMAL(10,4) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

CREATE TABLE item_type (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_type_id INTEGER REFERENCES item_type(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);


CREATE TABLE hsn_master (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    hsn_type VARCHAR(1), -- goods or services
    uqc VARCHAR(50),
    igst_rate DECIMAL(5,2) DEFAULT 0.00,
    cgst_rate DECIMAL(5,2) DEFAULT 0.00,
    sgst_rate DECIMAL(5,2) DEFAULT 0.00,
    cess_rate DECIMAL(5,2) DEFAULT 0.00,
    is_reverse_charges BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
)

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    uom_for_mis VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

CREATE TABLE divisions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
	department_id INTEGER,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    unit VARCHAR(10),
    conversion_factor DECIMAL(10,4) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
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


CREATE TABLE IF NOT EXISTS  item_master (
    id SERIAL PRIMARY KEY,
    item_code VARCHAR(50),
    rev_no VARCHAR(20),
    item_type_id INTEGER NOT NULL REFERENCES item_type(id),
    sub_type INTEGER,
    gs_ind CHAR(1),
    goods_type VARCHAR(10),
    item_name VARCHAR(100),
    short_name VARCHAR(100),
    pharmacopoeia_name VARCHAR(100),
    unit_of_measure VARCHAR(20),
    issuing_unit VARCHAR(20),
    uom_iss_conv_factor NUMERIC(10, 4),
    uom_uqc_conv_factor NUMERIC(10, 4),
    drawing_ref VARCHAR(100),
    std_assay_strength NUMERIC(10, 4),
    shelf_life_months INTEGER,
    shelf_life_days INTEGER,
    std_rate NUMERIC(12, 4),
    lead_time_days INTEGER,
    std_loss_on_dry NUMERIC(5, 2),
    safety_stock INTEGER,
    bought_out BOOLEAN,
    job_work BOOLEAN,
    imported BOOLEAN,
    current_buyer VARCHAR(100),
    economic_order_qty INTEGER,
    desired_pack_size INTEGER,
    tax_credit_applicable BOOLEAN,
    freight_on VARCHAR(10),
    manufactured BOOLEAN,
    allowed_allergen_percent NUMERIC(5, 2),
    std_mfg_fees_per_unit NUMERIC(10, 4),
    main_prod_centre VARCHAR(100),
    sold BOOLEAN,
    key_product BOOLEAN,
    exported BOOLEAN,
    product_type VARCHAR(50),
    sales_division VARCHAR(50),
    product_group VARCHAR(50),
    conversion_factor NUMERIC(10, 4),
    vendor_part_no VARCHAR(100),
    batch_not_applicable BOOLEAN,
    qc_required BOOLEAN,
    allergen BOOLEAN,
    mfg_date_applicable BOOLEAN,
    expiry_date_applicable BOOLEAN,
    track_serial_nos BOOLEAN,
    packing_freight_insurance_services BOOLEAN,
    active_ingredient BOOLEAN,
    mfg_loc_name_required BOOLEAN,
    mfg_mm_yyyy_applicable BOOLEAN,
    expiry_mm_yyyy_applicable BOOLEAN,
    principal_for_statutory_reporting BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS  item_specifications (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES item_master(id),
    specification TEXT,
    substitute_for_item_code VARCHAR(50),
    custom_tariff_no VARCHAR(50),
    excise_tariff_no VARCHAR(50),
    vat_comm_code VARCHAR(50),
    conversion_factor NUMERIC(10, 5),
    old_code VARCHAR(50),
    standard_weight NUMERIC(10, 4), -- in Kgs
    standard_conversion_cost_factor NUMERIC(10, 5),
    standard_packing_cost_factor NUMERIC(10, 5),
    markup_percentage NUMERIC(5, 2),
    markup_amount NUMERIC(10, 4)
);

CREATE TABLE IF NOT EXISTS  item_bought_out_details (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES item_master(id),
    purchase_based_on VARCHAR(20) CHECK (purchase_based_on IN ('Re-order Level', 'M.R.P. Plan', 'Indents')),
    excess_planning_percent NUMERIC(6, 2),
    reorder_level NUMERIC(12, 4),
    min_stock_level NUMERIC(12, 4),
    max_stock_level NUMERIC(12, 4),
    min_balance_shelf_life_days INTEGER,
    custom_duty_percent NUMERIC(6, 2),
    igst_percent NUMERIC(6, 2),
    sws_percent NUMERIC(6, 2),
    max_purchase_rate NUMERIC(12, 5),
    stop_procurement BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS  item_sales_details (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES item_master(id),
    pack_size_applicable BOOLEAN,
    default_pack_size VARCHAR(100),
    saleable_unit_contains INTEGER,
    qty_per_box INTEGER,
    boxes_per_case INTEGER,
    case_packing_type VARCHAR(100),
    packing_rate NUMERIC(12, 4),
    qty_per_case NUMERIC(12, 4),
    net_weight_case NUMERIC(12, 4),
    tare_weight_case NUMERIC(12, 4),
    gross_weight_case NUMERIC(12, 4),
    gross_weight_unit NUMERIC(12, 4),
    case_dimensions_inches VARCHAR(100),
    case_volume_cft NUMERIC(12, 4),
    case_dimensions_cm VARCHAR(100),
    case_volume_cbm NUMERIC(12, 4),
    min_sale_rate NUMERIC(12, 4),
    min_so_qty NUMERIC(12, 4),
    tertiary_gtin VARCHAR(50),
    secondary_gtin VARCHAR(50),
    primary_gtin VARCHAR(50),
    min_batch_qty_autoloading NUMERIC(12, 4),
    consider_as_new_product_till DATE,
    interface_code VARCHAR(50),
    specs VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS  item_stock_analysis (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES item_master(id),
    abc_consumption_value CHAR(1) CHECK (abc_consumption_value IN ('A', 'B', 'C', 'N')),
    xyz_stock_value CHAR(1) CHECK (xyz_stock_value IN ('X', 'Y', 'Z', 'N')),
    fsn_movement CHAR(1) CHECK (fsn_movement IN ('F', 'S', 'N', 'N')),
    ved_analysis CHAR(1) CHECK (ved_analysis IN ('V', 'E', 'D', 'N'))
);

CREATE TABLE IF NOT EXISTS  item_export_details (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES item_master(id),
    export_description TEXT,
    export_product_group_code VARCHAR(10),
    export_product_group_name VARCHAR(100),
    depb_rate_list_srl_no VARCHAR(20),
    depb_rate NUMERIC(10, 4),
    depb_value_cap NUMERIC(12, 4),
    depb_remarks TEXT,
    drawback_srl_no VARCHAR(20),
    drawback_rate NUMERIC(10, 4),
    drawback_rate_type VARCHAR(30), -- '% of F.O.B. Value' or 'Fixed Amount Per Unit'
    drawback_value_cap NUMERIC(12, 4),
    drawback_remarks TEXT
);

CREATE TABLE IF NOT EXISTS item_other_details (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES item_master(id),
    pack_short VARCHAR(50),
    product_cast VARCHAR(50), 
    pvc_color VARCHAR(50),
    color VARCHAR(50),
    flavour VARCHAR(50),
    fragrance VARCHAR(50),
    form VARCHAR(50),
    packaging_style VARCHAR(100),
    change_part VARCHAR(100),
    size VARCHAR(50),
    with_leaflet BOOLEAN,
    with_applicator BOOLEAN,
    with_wad BOOLEAN,
    with_silica BOOLEAN,
    with_cotton BOOLEAN,
    with_measuring_cap BOOLEAN,
    with_spoon BOOLEAN,
    packing_np VARCHAR(100),
    packing_np_qty INTEGER,
    packing_style_ptd VARCHAR(100),
    packing_style_ptd_qty INTEGER,
    note_per_strip TEXT,
    pack_short_ptd_spec VARCHAR(100),
    pack_short_ptd_size VARCHAR(100),
    pack_short_ptd_qty INTEGER,
    packing_style_np_size VARCHAR(100),
    packing_style_np_qty INTEGER,
    note_for_ctn TEXT,
    outer_size VARCHAR(50),
    outer_qty INTEGER,
    shrink VARCHAR(50),
    shrink_packing VARCHAR(100),
    shipper_size VARCHAR(50),
    qty_per_shipper INTEGER,
    shipper_note TEXT
);

CREATE TABLE IF NOT EXISTS item_media (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES item_master(id),
    media_type VARCHAR(20) CHECK (media_type IN ('image', 'icon', 'document', 'video', 'other')),
    file_name VARCHAR(255),
    file_extension VARCHAR(10),
    file_size_bytes INTEGER,
    mime_type VARCHAR(100),
    media_url TEXT, -- path or URL to media storage (e.g., local path, S3, etc.)
    description TEXT,
    uploaded_by VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- 4. CUSTOMER MASTER
-- ============================================
CREATE TABLE IF NOT EXISTS customer_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_export_type BOOLEAN DEFAULT FALSE,
    is_domestic_type BOOLEAN DEFAULT TRUE,
    requires_drug_license BOOLEAN DEFAULT FALSE,
    credit_terms_applicable BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);
-- 1. Main Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    location_code VARCHAR(10),
    customer_number VARCHAR(20) UNIQUE NOT NULL,
    customer_code VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    payee_name VARCHAR(255),
    customer_type_code VARCHAR(10),
    segment_code VARCHAR(10),
    income_tax_pan_number VARCHAR(20),
    customer_sale_type VARCHAR(10),
    export_type VARCHAR(20),
    gstin VARCHAR(20),
    drug_license_number VARCHAR(50),
    drug_license_expiry_date DATE,
    other_license_number VARCHAR(50),
    old_code VARCHAR(20),
    customer_lot_number VARCHAR(20),
    stop_invoice BOOLEAN DEFAULT FALSE,
    is_export_customer BOOLEAN DEFAULT FALSE,
    is_registered_dealer BOOLEAN DEFAULT FALSE,
    is_record_closed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    continent VARCHAR(50),
    rebates TEXT,
    external_information TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    id_deleted boolean default false
);

-- 2. Customer Addresses & Contacts Table
CREATE TABLE IF NOT EXISTS customer_addresses (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    address_line_1 TEXT,
    address_line_2 TEXT,
    address_line_3 TEXT,
    city VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    state_code VARCHAR(10),
    gst_state_code VARCHAR(10),
    contact_person VARCHAR(100),
    telephone_number VARCHAR(20),
    mobile_number VARCHAR(20),
    fax_number VARCHAR(20),
    email_id VARCHAR(100),
    website VARCHAR(100),
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Customer Banking Details Table
CREATE TABLE IF NOT EXISTS customer_banking_details (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    bank_ifsc_code VARCHAR(20),
    bank_account_number VARCHAR(30),
    bank_name VARCHAR(200),
    customer_banker VARCHAR(100),
    customer_vpa VARCHAR(100),
    bank_account_type_code VARCHAR(10),
    bank_branch VARCHAR(100),
    bank_location VARCHAR(100),
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Customer Shipping & Financial Terms Table
CREATE TABLE IF NOT EXISTS customer_business_terms (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    -- Shipping & Logistics
    destination_code VARCHAR(10),
    transport_mode_code VARCHAR(10),
    transporter_code VARCHAR(10),
    lead_days INTEGER,
    customer_distance NUMERIC(10,2),
    freight_indicator VARCHAR(10),
    supply_stock_location VARCHAR(20),
    allow_consignment_on_booking BOOLEAN DEFAULT FALSE,
    -- Financial Terms
    customer_account_code VARCHAR(20),
    credit_limit NUMERIC(15,2),
    minimum_invoice_amount NUMERIC(15,2),
    customer_scheme_code VARCHAR(20),
    customer_broker_code VARCHAR(20),
    customer_broker_rate NUMERIC(5,2),
    cash_discount_percentage NUMERIC(5,2),
    misc_charge_percentage NUMERIC(5,2),
    misc_discount_percentage NUMERIC(5,2),
    payment_term_code VARCHAR(20),
    credit_period_days INTEGER,
    new_party_credit_period_days INTEGER,
    is_overdue_check BOOLEAN DEFAULT TRUE,
    number_of_bills INTEGER,
    outstanding_bill_period_days INTEGER,
    outstanding_bill_account_indicator VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Customer Tax & Compliance Configuration Table
CREATE TABLE IF NOT EXISTS customer_tax_compliance (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    -- Tax Configuration
    vat_form_code VARCHAR(20),
    central_form_code VARCHAR(20),
    is_eligible_for_tcs BOOLEAN DEFAULT FALSE,
    tcs_type VARCHAR(20),
    is_applicable_higher_rate BOOLEAN DEFAULT FALSE,
    is_deemed_non_resident BOOLEAN DEFAULT FALSE,
    is_deemed_permanent_establishment BOOLEAN DEFAULT FALSE,
    is_bill_discount BOOLEAN DEFAULT FALSE,
    is_reverse_end_of_year BOOLEAN DEFAULT FALSE,
    -- Interface & Document Configuration
    customer_interface_code NUMERIC,
    interface_file_format VARCHAR(20),
    projection_ratio NUMERIC(5,2),
    number_of_displays INTEGER,
    label_layout VARCHAR(50),
    number_of_copies INTEGER,
    special_terms TEXT,
    documents_through VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_customers_customer_number ON customers(customer_number);
CREATE INDEX idx_customers_customer_code ON customers(customer_code);
CREATE INDEX idx_customers_customer_name ON customers(customer_name);
CREATE INDEX idx_customers_is_active ON customers(is_active);

CREATE INDEX idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX idx_customer_banking_customer_id ON customer_banking_details(customer_id);
CREATE INDEX idx_customer_business_customer_id ON customer_business_terms(customer_id);
CREATE INDEX idx_customer_tax_customer_id ON customer_tax_compliance(customer_id);


-- ============================================
-- 5. WAREHOUSE & INVENTORY MANAGEMENT
-- ============================================
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    warehouse_type VARCHAR(20) NOT NULL, -- MAIN, TRANSIT, QUARANTINE, DAMAGE
    address_line1 VARCHAR(100),
    address_line2 VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    postal_code VARCHAR(10),
    total_capacity DECIMAL(10,2), -- in sq ft
    available_capacity DECIMAL(10,2),
    cold_storage_capacity DECIMAL(10,2),
    temperature_controlled BOOLEAN DEFAULT FALSE,
    temperature_range VARCHAR(20), -- 2-8°C, 15-25°C, etc.
    warehouse_manager_id INTEGER REFERENCES users(user_id),
    phone VARCHAR(15),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES item_master(item_id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(warehouse_id),
    batch_number VARCHAR(50),
    available_quantity DECIMAL(12,3) DEFAULT 0,
    reserved_quantity DECIMAL(12,3) DEFAULT 0, -- Reserved for orders
    blocked_quantity DECIMAL(12,3) DEFAULT 0, -- Quality hold
    damaged_quantity DECIMAL(12,3) DEFAULT 0,
    manufacturing_date DATE,
    expiry_date DATE,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(15,2),
    stock_status VARCHAR(20) DEFAULT 'AVAILABLE', -- AVAILABLE, RESERVED, BLOCKED, EXPIRED
    reorder_level DECIMAL(10,2),
    reorder_quantity DECIMAL(10,2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, warehouse_id, batch_number)
);


CREATE TABLE inventory_stock_movements (
    id SERIAL PRIMARY KEY,
    inventory_id INTEGER NOT NULL REFERENCES inventory(id),
    movement_type VARCHAR(10) NOT NULL, -- IN, OUT
    quantity DECIMAL(12,3) NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(15,2),    
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reference_number VARCHAR(50), -- Order number, GRN, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- 6. VENDOR MASTER & CLASSIFICATIONS
-- ============================================

-- Vendor Types
CREATE TABLE vendor_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendor Master
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    vendor_type_id INTEGER REFERENCES vendor_types(id),
    legal_name VARCHAR(200),
    business_type VARCHAR(50), -- PROPRIETORSHIP, PARTNERSHIP, PRIVATE_LIMITED, PUBLIC_LIMITED
    incorporation_date DATE,
    business_registration_number VARCHAR(50),
    contact_person VARCHAR(100),
    designation VARCHAR(50),
    phone VARCHAR(15),
    mobile VARCHAR(15),
    email VARCHAR(100),
    website VARCHAR(100),
    tax_registration_number VARCHAR(50),
    gst_number VARCHAR(15),
    pan_number VARCHAR(10),
    tan_number VARCHAR(10),
    
    -- Drug & Regulatory Information
    drug_license_number VARCHAR(50),
    drug_license_expiry DATE,
    manufacturing_license VARCHAR(50),
    manufacturing_license_expiry DATE,
    who_gmp_certificate VARCHAR(50),
    who_gmp_expiry DATE,
    iso_certificate VARCHAR(50),
    iso_expiry DATE,
    
    -- Banking Information
    bank_name VARCHAR(100),
    account_number VARCHAR(30),
    ifsc_code VARCHAR(15),
    bank_branch VARCHAR(100),
    account_type VARCHAR(20),
    
    -- Credit Information
    credit_limit DECIMAL(15,2) DEFAULT 0.00,
    credit_days INTEGER DEFAULT 0,
    payment_terms VARCHAR(100),
    advance_payment_required BOOLEAN DEFAULT FALSE,
    advance_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Operational Information
    lead_time_days INTEGER DEFAULT 0,
    minimum_order_value DECIMAL(12,2) DEFAULT 0.00,
    currency_code VARCHAR(3) DEFAULT 'INR',
    
    -- Purchase Information
    purchase_manager_id INTEGER REFERENCES users(user_id),
    vendor_rating DECIMAL(3,2) DEFAULT 0.00, -- Out of 5
    
    -- Status & Classification
    vendor_status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, BLACKLISTED, SUSPENDED
    preferred_vendor BOOLEAN DEFAULT FALSE,
    critical_vendor BOOLEAN DEFAULT FALSE,
    
    -- Approval Workflow
    approval_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    approved_by INTEGER REFERENCES users(user_id),
    approved_at TIMESTAMP,
    
    -- Audit Information
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- Vendor Additional Addresses
CREATE TABLE vendor_addresses (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER NOT NULL REFERENCES vendors(id),
    address_type VARCHAR(20) NOT NULL, -- BILLING, SHIPPING, MANUFACTURING, OFFICE
    address_name VARCHAR(100),
    address_line1 VARCHAR(100),
    address_line2 VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    postal_code VARCHAR(10),
    
    -- Contact Information
    contact_person VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(100),
    
    -- Logistics Information
    delivery_time_hours INTEGER,
    freight_terms VARCHAR(50), -- FOB, CIF, CNF, etc.
    
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendor Contacts (Multiple contact persons)
CREATE TABLE vendor_contacts (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER NOT NULL REFERENCES vendors(id),
    contact_type VARCHAR(20) NOT NULL, -- PRIMARY, SALES, TECHNICAL, FINANCE, LOGISTICS
    
    -- Contact Information
    contact_name VARCHAR(100) NOT NULL,
    designation VARCHAR(50),
    department VARCHAR(50),
    phone VARCHAR(15),
    mobile VARCHAR(15),
    email VARCHAR(100),
    
    -- Communication Preferences
    preferred_communication VARCHAR(20), -- EMAIL, PHONE, SMS, WHATSAPP
    
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. Purchase order Management
-- ============================================
CREATE TABLE IF NOT EXISTS purchase_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    vendor_id INTEGER NOT NULL REFERENCES vendors(id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_delivery_date TIMESTAMP,
    total_amount DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, COMPLETED
    created_by INTEGER REFERENCES users(user_id),
    updated_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES purchase_orders(id),
    item_id INTEGER NOT NULL REFERENCES item_master(id),
    quantity DECIMAL(12,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    batch_number VARCHAR(50),
    expiry_date DATE,
    is_received BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_order_approvals (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES purchase_orders(id),
    approver_id INTEGER NOT NULL REFERENCES users(user_id),
    approval_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    comments TEXT,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS purchase_order_chat (
  id SERIAL PRIMARY KEY,
  order_id INTEGER,
  comment TEXT,
  created_by INTEGER,
  created_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS purchase_order_comments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER,
  created_by INTEGER,
  created_at TIMESTAMP NULL,
  comments VARCHAR(500),
  status VARCHAR(200),
  type VARCHAR(200),
  is_deleted INTEGER DEFAULT 0
);

-- ============================================
-- 8. Sales Order Management
-- ============================================

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
  updated_by INTEGER,
  updated_at TIMESTAMP NULL,
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
  updated_by INTEGER,
  updated_at TIMESTAMP NULL,
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
  updated_by INTEGER,
  updated_at TIMESTAMP NULL,
  CONSTRAINT fk_sales_order_documents
    FOREIGN KEY (sales_order_id) 
    REFERENCES sales_orders(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sales_order_performa_invoice (
  id SERIAL PRIMARY KEY,
 
  is_deleted INTEGER DEFAULT 0,
  exporter_name VARCHAR(200),
  organization_name VARCHAR(200),
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
  previous_performa_invoice_id INTEGER DEFAULT 0,
  created_by INTEGER,
  created_at TIMESTAMP NULL,
  updated_by INTEGER,
  updated_at TIMESTAMP NULL
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
  p_billing_rate FLOAT,
  created_by INTEGER,
  created_at TIMESTAMP NULL,
  updated_by INTEGER,
  updated_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS sales_order_quotation (
  id SERIAL PRIMARY KEY,
  is_deleted INTEGER DEFAULT 0,
  organization_id INTEGER,
  quotation_number VARCHAR(200),
  quotation_date DATE,
  customer_id INTEGER,
  advance_percentage FLOAT,
  charges TEXT,
  total_amount FLOAT,
  advance_amount FLOAT,
  prev_copy_quotation_id INTEGER DEFAULT 0,
  created_by INTEGER,
  created_at TIMESTAMP NULL,
  updated_by INTEGER,
  updated_at TIMESTAMP NULL
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
  product_extra_charges_tax_percent FLOAT,
  created_by INTEGER,
  created_at TIMESTAMP NULL,
  updated_by INTEGER,
  updated_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS sales_order_save_transactions (
  id SERIAL PRIMARY KEY,
  sales_order_id INTEGER,
  diff TEXT,
  created_by INTEGER,
  created_at TIMESTAMP NULL,
  updated_by INTEGER,
  updated_at TIMESTAMP NULL
);


-- ============================================
-- 9. Shared Master Data
-- ============================================
CREATE TABLE IF NOT EXISTS currencies
(
    id SERIAL PRIMARY KEY,
    currency_code character varying(10) ,
    exchange_usd numeric(18,6),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    updated_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    CONSTRAINT currencies_pkey PRIMARY KEY (id),
    CONSTRAINT currencies_currency_code_key UNIQUE (currency_code)
)




-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- User Management Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Product Master Indexes
CREATE INDEX idx_products_product_code ON products(product_code);
CREATE INDEX idx_products_product_name ON products(product_name);
CREATE INDEX idx_products_organization_id ON products(organization_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_product_barcodes_barcode ON product_barcodes(barcode);

-- Customer Master Indexes
CREATE INDEX idx_customers_customer_code ON customers(customer_code);
CREATE INDEX idx_customers_customer_name ON customers(customer_name);
CREATE INDEX idx_customers_gst_number ON customers(gst_number);
CREATE INDEX idx_customers_is_active ON customers(is_active);
CREATE INDEX idx_customer_addresses_customer_id ON customer_addresses(customer_id);

-- ============================================
-- SAMPLE DATA INSERT STATEMENTS
-- ============================================

-- Insert Default Roles
INSERT INTO roles (name, description) VALUES 
('SUPER_ADMIN', 'System Super Administrator'),
('ADMIN', 'System Administrator'),
('SALES_MANAGER', 'Sales Manager'),
('SALES_EXECUTIVE', 'Sales Executive'),
('PURCHASE_MANAGER', 'Purchase Manager'),
('INVENTORY_MANAGER', 'Inventory Manager'),
('ACCOUNTS_MANAGER', 'Accounts Manager'),
('PHARMACIST', 'Qualified Pharmacist'),
('QUALITY_CONTROLLER', 'Quality Control Officer');

-- Insert Default UOMs
INSERT INTO unit_of_measures (  uom_code, uom_name, uom_type) VALUES 
('PCS', 'Pieces', 'PRIMARY'),
('STRIP', 'Strip', 'SECONDARY'),
('BOX', 'Box', 'SECONDARY'),
('VIAL', 'Vial', 'PRIMARY'),
('ML', 'Milliliter', 'PRIMARY'),
('MG', 'Milligram', 'PRIMARY'),
('GM', 'Gram', 'PRIMARY'),
('KG', 'Kilogram', 'PRIMARY');

-- Insert Default Dosage Forms
INSERT INTO dosage_forms (  form_code, form_name) VALUES 
('TAB', 'Tablet'),
('CAP', 'Capsule'),
('SYR', 'Syrup'),
('INJ', 'Injection'),
('OIN', 'Ointment'),
('CRM', 'Cream'),
('DRP', 'Drops'),
('PWD', 'Powder');

-- Insert Default Customer Categories
INSERT INTO customer_categories (   category_code, category_name, description) VALUES 
('HOSP', 'Hospital', 'Hospital and Healthcare Institutions'),
('PHARM', 'Pharmacy', 'Retail Pharmacy'),
('DIST', 'Distributor', 'Wholesale Distributor'),
('RETAIL', 'Retailer', 'Retail Outlet'),
('GOVT', 'Government', 'Government Organizations');