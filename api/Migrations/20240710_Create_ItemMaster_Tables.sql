-- Migration script for creating item master tables
-- Created: 2024-07-10

-- Create unit_of_measures table
CREATE TABLE IF NOT EXISTS unit_of_measures (
    id SERIAL PRIMARY KEY,
    uom_code VARCHAR(10) UNIQUE NOT NULL,
    uom_name VARCHAR(50) NOT NULL, -- PCS, STRIP, BOX, VIAL, ML, MG, etc.
    conversion_factor DECIMAL(10,4) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- Add comments to unit_of_measures table and columns
COMMENT ON TABLE unit_of_measures IS 'Stores unit of measure information for items';
COMMENT ON COLUMN unit_of_measures.uom_code IS 'Unique code for the unit of measure (e.g., PCS, BOX, KG)';
COMMENT ON COLUMN unit_of_measures.uom_name IS 'Name of the unit of measure';
COMMENT ON COLUMN unit_of_measures.conversion_factor IS 'Conversion factor to base unit';

-- Create item_type table
CREATE TABLE IF NOT EXISTS item_type (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_type_id INTEGER REFERENCES item_type(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- Add comments to item_type table and columns
COMMENT ON TABLE item_type IS 'Stores item type hierarchy and categories';
COMMENT ON COLUMN item_type.code IS 'Unique code for the item type';
COMMENT ON COLUMN item_type.name IS 'Name of the item type';
COMMENT ON COLUMN item_type.parent_type_id IS 'Self-referential foreign key for hierarchical types';
COMMENT ON COLUMN item_type.is_active IS 'Indicates if the item type is active';

-- Create hsn_master table
CREATE TABLE IF NOT EXISTS hsn_master (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    hsn_type VARCHAR(1), -- goods or services
    uqc VARCHAR(50), -- Unit Quantity Code
    igst_rate DECIMAL(5,2) DEFAULT 0.00,
    cgst_rate DECIMAL(5,2) DEFAULT 0.00,
    sgst_rate DECIMAL(5,2) DEFAULT 0.00,
    cess_rate DECIMAL(5,2) DEFAULT 0.00,
    is_reverse_charges BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- Add comments to hsn_master table and columns
COMMENT ON TABLE hsn_master IS 'Stores HSN (Harmonized System of Nomenclature) codes and tax rates';
COMMENT ON COLUMN hsn_master.code IS 'HSN code as per GST rules';
COMMENT ON COLUMN hsn_master.name IS 'Description of the HSN code';
COMMENT ON COLUMN hsn_master.hsn_type IS 'Type of HSN (G for Goods, S for Services)';
COMMENT ON COLUMN hsn_master.uqc IS 'Unit Quantity Code as per GST rules';
COMMENT ON COLUMN hsn_master.igst_rate IS 'Integrated GST rate';
COMMENT ON COLUMN hsn_master.cgst_rate IS 'Central GST rate';
COMMENT ON COLUMN hsn_master.sgst_rate IS 'State GST rate';
COMMENT ON COLUMN hsn_master.cess_rate IS 'Cess rate';
COMMENT ON COLUMN hsn_master.is_reverse_charges IS 'Indicates if reverse charge is applicable';

-- Create indexes for better query performance
CREATE INDEX idx_item_type_parent_id ON item_type(parent_type_id) WHERE parent_type_id IS NOT NULL;
CREATE INDEX idx_unit_of_measures_code ON unit_of_measures(uom_code);
CREATE INDEX idx_hsn_master_code ON hsn_master(code);
CREATE INDEX idx_hsn_master_type ON hsn_master(hsn_type) WHERE hsn_type IS NOT NULL;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW; 
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at timestamp
CREATE TRIGGER update_unit_of_measures_modtime
BEFORE UPDATE ON unit_of_measures
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_item_type_modtime
BEFORE UPDATE ON item_type
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_hsn_master_modtime
BEFORE UPDATE ON hsn_master
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Insert default unit of measures
INSERT INTO unit_of_measures (uom_code, uom_name, conversion_factor, created_at, updated_at)
VALUES 
    ('PCS', 'Pieces', 1.0, NOW(), NOW()),
    ('BOX', 'Box', 1.0, NOW(), NOW()),
    ('PKT', 'Packet', 1.0, NOW(), NOW()),
    ('SET', 'Set', 1.0, NOW(), NOW()),
    ('KG', 'Kilogram', 1.0, NOW(), NOW()),
    ('G', 'Gram', 0.001, NOW(), NOW()),
    ('L', 'Liter', 1.0, NOW(), NOW()),
    ('ML', 'Milliliter', 0.001, NOW(), NOW()),
    ('M', 'Meter', 1.0, NOW(), NOW()),
    ('CM', 'Centimeter', 0.01, NOW(), NOW())
ON CONFLICT (uom_code) DO NOTHING;

-- Insert default item types (hierarchy)
-- Level 1 categories
WITH root_types AS (
    INSERT INTO item_type (code, name, description, is_active, created_at, updated_at)
    VALUES 
        ('RM', 'Raw Material', 'Raw materials used in production', true, NOW(), NOW()),
        ('FG', 'Finished Goods', 'Finished products ready for sale', true, NOW(), NOW()),
        ('SFG', 'Semi-Finished Goods', 'Partially completed products', true, NOW(), NOW()),
        ('SRV', 'Services', 'Services provided to customers', true, NOW(), NOW())
    RETURNING id, code
)
-- Level 2 categories (children of Raw Material)
INSERT INTO item_type (code, name, description, parent_type_id, is_active, created_at, updated_at)
SELECT 
    'RM-' || subquery.code,
    subquery.name,
    subquery.description,
    rt.id,
    true,
    NOW(),
    NOW()
FROM (
    VALUES 
        ('METAL', 'Metals', 'Metal raw materials'),
        ('PLASTIC', 'Plastics', 'Plastic raw materials'),
        ('CHEM', 'Chemicals', 'Chemical raw materials'),
        ('ELEC', 'Electronic Components', 'Electronic components and parts')
) AS subquery
CROSS JOIN root_types rt
WHERE rt.code = 'RM';

-- Insert some common HSN codes for goods
INSERT INTO hsn_master (code, name, description, hsn_type, igst_rate, cgst_rate, sgst_rate, cess_rate, is_reverse_charges, is_active, created_at, updated_at)
VALUES 
    ('7308', 'Structures and parts of structures, of iron or steel', 'Structures and parts of structures, of iron or steel', 'G', 18.0, 9.0, 9.0, 0.0, false, true, NOW(), NOW()),
    ('7326', 'Other articles of iron or steel', 'Other articles of iron or steel', 'G', 18.0, 9.0, 9.0, 0.0, false, true, NOW(), NOW()),
    ('8481', 'Taps, cocks, valves and similar appliances for pipes, boiler shells, tanks, vats or the like, including pressure-reducing valves and thermostatically controlled valves', 'Plumbing fixtures and fittings', 'G', 18.0, 9.0, 9.0, 0.0, false, true, NOW(), NOW()),
    ('8501', 'Electric motors and generators (excluding generating sets)', 'Electric motors and generators', 'G', 18.0, 9.0, 9.0, 0.0, false, true, NOW(), NOW()),
    ('8536', 'Electrical apparatus for switching or protecting electrical circuits, or for making connections to or in electrical circuits', 'Electrical switches and circuit breakers', 'G', 18.0, 9.0, 9.0, 0.0, false, true, NOW(), NOW()),
    ('9405', 'Lamps and lighting fittings including searchlights and spotlights and parts thereof, not elsewhere specified or included; illuminated signs, illuminated name-plates and the like, having a permanently fixed light source, and parts thereof not elsewhere specified or included', 'Lighting fixtures and fittings', 'G', 18.0, 9.0, 9.0, 0.0, false, true, NOW(), NOW()),
    ('9609', 'Pencils (other than pencils of heading 9608), crayons, pencil leads, pastels, drawing charcoals, writing or drawing chalks and tailors'' chalks', 'Pencils and writing instruments', 'G', 12.0, 6.0, 6.0, 0.0, false, true, NOW(), NOW()),
    ('9615', 'Combs, hair-slides and the like; hairpins, curling pins, curling grips, hair-curlers and the like, other than those of heading 8516, and parts thereof', 'Hair care accessories', 'G', 18.0, 9.0, 9.0, 0.0, false, true, NOW(), NOW()),
    ('9997', 'Services', 'General services', 'S', 18.0, 9.0, 9.0, 0.0, false, true, NOW(), NOW()),
    ('9963', 'Accommodation, food and beverage services', 'Hotel and restaurant services', 'S', 12.0, 6.0, 6.0, 0.0, false, true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Add audit trail for all tables
COMMENT ON COLUMN unit_of_measures.created_by IS 'User ID who created the record';
COMMENT ON COLUMN unit_of_measures.updated_by IS 'User ID who last updated the record';
COMMENT ON COLUMN item_type.created_by IS 'User ID who created the record';
COMMENT ON COLUMN item_type.updated_by IS 'User ID who last updated the record';
COMMENT ON COLUMN hsn_master.created_by IS 'User ID who created the record';
COMMENT ON COLUMN hsn_master.updated_by IS 'User ID who last updated the record';

-- Grant necessary permissions
-- Replace 'your_app_user' with your actual application database user
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
