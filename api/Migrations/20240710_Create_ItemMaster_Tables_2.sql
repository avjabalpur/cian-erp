-- Migration script for creating item master tables
-- Created: 2024-07-10

-- Create item_master table
CREATE TABLE IF NOT EXISTS item_master (
    id SERIAL PRIMARY KEY,
    item_code VARCHAR(50) UNIQUE NOT NULL,
    rev_no VARCHAR(20),
    item_type_id INTEGER NOT NULL REFERENCES item_type(id),
    sub_type INTEGER,
    gs_ind CHAR(1),
    goods_type VARCHAR(10),
    item_name VARCHAR(100),
    short_name VARCHAR(100),
    pharmacopoeia_name VARCHAR(100),
    unit_of_measure VARCHAR(20) REFERENCES unit_of_measures(uom_code),
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
    bought_out BOOLEAN DEFAULT FALSE,
    job_work BOOLEAN DEFAULT FALSE,
    imported BOOLEAN DEFAULT FALSE,
    current_buyer VARCHAR(100),
    economic_order_qty INTEGER,
    desired_pack_size INTEGER,
    tax_credit_applicable BOOLEAN DEFAULT FALSE,
    freight_on VARCHAR(10), -- 'Weight' or 'Volume'
    manufactured BOOLEAN DEFAULT FALSE,
    allowed_allergen_percent NUMERIC(5, 2),
    std_mfg_fees_per_unit NUMERIC(10, 4),
    main_prod_centre VARCHAR(100),
    sold BOOLEAN DEFAULT FALSE,
    key_product BOOLEAN DEFAULT FALSE,
    exported BOOLEAN DEFAULT FALSE,
    product_type VARCHAR(50),
    sales_division VARCHAR(50),
    product_group VARCHAR(50),
    conversion_factor NUMERIC(10, 4),
    vendor_part_no VARCHAR(100),
    batch_not_applicable BOOLEAN DEFAULT FALSE,
    qc_required BOOLEAN DEFAULT FALSE,
    allergen BOOLEAN DEFAULT FALSE,
    mfg_date_applicable BOOLEAN DEFAULT FALSE,
    expiry_date_applicable BOOLEAN DEFAULT FALSE,
    track_serial_nos BOOLEAN DEFAULT FALSE,
    packing_freight_insurance_services BOOLEAN DEFAULT FALSE,
    active_ingredient BOOLEAN DEFAULT FALSE,
    mfg_loc_name_required BOOLEAN DEFAULT FALSE,
    mfg_mm_yyyy_applicable BOOLE DEFAULT FALSE,
    expiry_mm_yyyy_applicable BOOLEAN DEFAULT FALSE,
    principal_for_statutory_reporting BOOLEAN DEFAULT FALSE,
    created_on DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- Create item_specifications table
CREATE TABLE IF NOT EXISTS item_specifications (
    id SERIAL PRIMARY KEY,
    item_code VARCHAR(50) REFERENCES item_master(item_code) ON DELETE CASCADE,
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
    markup_amount NUMERIC(10, 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- Add comments to item_master table and columns
COMMENT ON TABLE item_master IS 'Stores master information for all items in the system';
COMMENT ON COLUMN item_master.item_code IS 'Unique identifier for the item';
COMMENT ON COLUMN item_master.rev_no IS 'Revision number of the item';
COMMENT ON COLUMN item_master.item_type_id IS 'Reference to item type';
COMMENT ON COLUMN item_master.unit_of_measure IS 'Primary unit of measure';
COMMENT ON COLUMN item_master.std_rate IS 'Standard rate/cost of the item';
COMMENT ON COLUMN item_master.bought_out IS 'Indicates if the item is purchased from outside';
COMMENT ON COLUMN item_master.manufactured IS 'Indicates if the item is manufactured in-house';
COMMENT ON COLUMN item_master.qc_required IS 'Indicates if QC is required for this item';

-- Add comments to item_specifications table and columns
COMMENT ON TABLE item_specifications IS 'Stores detailed specifications for items';
COMMENT ON COLUMN item_specifications.item_code IS 'Reference to item_master';
COMMENT ON COLUMN item_specifications.specification IS 'Detailed specifications in text format';
COMMENT ON COLUMN item_specifications.standard_weight IS 'Standard weight in Kgs';

-- Add comments for item_export_details
COMMENT ON TABLE item_export_details IS 'Stores export-related information for items';
COMMENT ON COLUMN item_export_details.item_code IS 'Reference to item_master';
COMMENT ON COLUMN item_export_details.depb_rate IS 'DEPB (Duty Entitlement Passbook Scheme) rate';
COMMENT ON COLUMN item_export_details.drawback_rate IS 'Duty drawback rate';

-- Add comments for item_other_details
COMMENT ON TABLE item_other_details IS 'Stores miscellaneous item details';
COMMENT ON COLUMN item_other_details.item_code IS 'Reference to item_master';
COMMENT ON COLUMN item_other_details.product_cast IS 'Product category (e.g., DRUG, FOOD)';

-- Add comments for item_media
COMMENT ON TABLE item_media IS 'Stores media files related to items';
COMMENT ON COLUMN item_media.item_code IS 'Reference to item_master';
COMMENT ON COLUMN item_media.media_type IS 'Type of media (image, icon, document, video, other)';
COMMENT ON COLUMN item_media.media_url IS 'Path or URL to the media file';

-- Create indexes for better performance
CREATE INDEX idx_item_master_item_code ON item_master(item_code);
CREATE INDEX idx_item_master_item_type_id ON item_master(item_type_id);

-- Add foreign key constraints for the new tables
ALTER TABLE item_export_details 
ADD CONSTRAINT fk_item_export_details_item_master 
FOREIGN KEY (item_code) 
REFERENCES item_master(item_code) 
ON DELETE CASCADE;

ALTER TABLE item_other_details 
ADD CONSTRAINT fk_item_other_details_item_master 
FOREIGN KEY (item_code) 
REFERENCES item_master(item_code) 
ON DELETE CASCADE;

ALTER TABLE item_media 
ADD CONSTRAINT fk_item_media_item_master 
FOREIGN KEY (item_code) 
REFERENCES item_master(item_code) 
ON DELETE CASCADE;

CREATE INDEX idx_item_specifications_item_code ON item_specifications(item_code);

-- Item Export Details Table
CREATE TABLE item_export_details (
    id SERIAL PRIMARY KEY,
    item_code VARCHAR(50) NOT NULL,
    export_description TEXT,
    export_product_group_code VARCHAR(10),
    export_product_group_name VARCHAR(100),
    depb_rate_list_srl_no VARCHAR(20),
    depb_rate NUMERIC(10, 4),
    depb_value_cap NUMERIC(12, 4),
    depb_remarks TEXT,
    drawback_srl_no VARCHAR(20),
    drawback_rate NUMERIC(10, 4),
    drawback_rate_type VARCHAR(30),
    drawback_value_cap NUMERIC(12, 4),
    drawback_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- Item Other Details Table
CREATE TABLE item_other_details (
    id SERIAL PRIMARY KEY,
    item_code VARCHAR(50) NOT NULL,
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
    shipper_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- Item Media Table
CREATE TABLE item_media (
    id SERIAL PRIMARY KEY,
    item_code VARCHAR(50) NOT NULL,
    media_type VARCHAR(20) CHECK (media_type IN ('image', 'icon', 'document', 'video', 'other')),
    file_name VARCHAR(255),
    file_extension VARCHAR(10),
    file_size_bytes INTEGER,
    mime_type VARCHAR(100),
    media_url TEXT,
    description TEXT,
    uploaded_by VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- Add foreign key constraint for item_type_id
ALTER TABLE item_master 
ADD CONSTRAINT fk_item_master_item_type 
FOREIGN KEY (item_type_id) 
REFERENCES item_type(id) 
ON DELETE RESTRICT;

-- Add foreign key constraint for unit_of_measure
ALTER TABLE item_master 
ADD CONSTRAINT fk_item_master_unit_of_measure 
FOREIGN KEY (unit_of_measure) 
REFERENCES unit_of_measures(uom_code) 
ON DELETE SET NULL;

-- Add foreign key constraint for substitute_for_item_code
ALTER TABLE item_specifications 
ADD CONSTRAINT fk_item_specifications_substitute 
FOREIGN KEY (substitute_for_item_code) 
REFERENCES item_master(item_code) 
ON DELETE SET NULL;

-- Add audit trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_item_master_updated_at
BEFORE UPDATE ON item_master
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_item_specifications_updated_at
BEFORE UPDATE ON item_specifications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
