-- ============================================
-- ORGANIZATION STRUCTURE MIGRATION
-- Generated: 2025-07-09
-- ============================================

-- Create location_type table
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

-- Create organizations table
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
    employment_status_code VARCHAR(50),
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

-- Create organization_accounts table
CREATE TABLE IF NOT EXISTS organization_accounts (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_location_type_code ON location_type(code);
CREATE INDEX IF NOT EXISTS idx_organizations_code ON organizations(code);
CREATE INDEX IF NOT EXISTS idx_organizations_location_type ON organizations(location_type_id);
CREATE INDEX IF NOT EXISTS idx_organization_accounts_org ON organization_accounts(organization_id);

-- Add trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_location_type_updated_at
BEFORE UPDATE ON location_type
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_accounts_updated_at
BEFORE UPDATE ON organization_accounts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default location types
INSERT INTO location_type (code, name, is_active, created_at, updated_at)
VALUES 
    ('HQ', 'Headquarters', true, NOW(), NOW()),
    ('BRANCH', 'Branch Office', true, NOW(), NOW()),
    ('WAREHOUSE', 'Warehouse', true, NOW(), NOW()),
    ('RETAIL', 'Retail Store', true, NOW(), NOW()),
    ('FACTORY', 'Factory', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Insert default organization
INSERT INTO organizations (
    code, location_type_id, name, contact_person, 
    address1, city, state, country, zip, 
    phone, email, website, gstin_number, 
    pan_number, is_active, created_at, updated_at
)
SELECT 
    'MAIN', 
    id, 
    'Xcianify Technologies', 
    'Admin', 
    '123 Business Street', 
    'Bangalore', 
    'Karnataka', 
    'India', 
    '560001', 
    '9876543210', 
    'info@xcianify.com', 
    'https://xcianify.com', 
    '22AAAAA0000A1Z5', 
    'AAAAA1234A', 
    true, 
    NOW(), 
    NOW()
FROM location_type 
WHERE code = 'HQ'
ON CONFLICT (code) DO NOTHING;

-- Insert default bank account for the organization
INSERT INTO organization_accounts (
    organization_id, account_type, account_number, 
    bank_name, ifsc_code, account_holder_name, 
    is_active, created_at, updated_at
)
SELECT 
    o.id, 
    'BANK', 
    '1234567890', 
    'State Bank of India', 
    'SBIN0001234', 
    'Xcianify Technologies', 
    true, 
    NOW(), 
    NOW()
FROM organizations o
WHERE o.code = 'MAIN'
ON CONFLICT (organization_id, account_number) DO NOTHING;