-- Sample data insertion script for Customer Types and Customers
-- This script inserts sample data directly into the database

-- Insert Customer Types
INSERT INTO customer_types (code, name, description, is_export_type, is_domestic_type, requires_drug_license, credit_terms_applicable, is_active, created_at, created_by, is_deleted) VALUES
('WHOLESALE', 'Wholesale', 'Wholesale customers who purchase in bulk quantities', false, true, true, true, true, NOW(), 1, false),
('RETAIL', 'Retail', 'Retail customers who purchase for end use', false, true, false, false, true, NOW(), 1, false),
('EXPORT', 'Export', 'Export customers for international sales', true, false, true, true, true, NOW(), 1, false),
('GOVERNMENT', 'Government', 'Government institutions and agencies', false, true, true, true, true, NOW(), 1, false),
('INSTITUTIONAL', 'Institutional', 'Institutional customers like hospitals, clinics', false, true, true, true, true, NOW(), 1, false),
('PHARMA', 'Pharmaceutical', 'Pharmaceutical companies and distributors', false, true, true, true, true, NOW(), 1, false),
('COSMETIC', 'Cosmetic', 'Cosmetic and personal care customers', false, true, false, true, true, NOW(), 1, false),
('FOOD', 'Food & Beverage', 'Food and beverage industry customers', false, true, false, true, true, NOW(), 1, false),
('CHEMICAL', 'Chemical', 'Chemical industry customers', false, true, true, true, true, NOW(), 1, false),
('RESEARCH', 'Research & Development', 'Research institutions and laboratories', false, true, true, true, true, NOW(), 1, false);

-- Insert Customers
INSERT INTO customers (location_code, customer_number, customer_code, customer_name, short_name, payee_name, customer_type_code, segment_code, income_tax_pan_number, customer_sale_type, export_type, gstin, drug_license_number, drug_license_expiry_date, other_license_number, old_code, customer_lot_number, stop_invoice, is_export_customer, is_registered_dealer, is_record_closed, is_active, continent, rebates, external_information, created_at, created_by, is_deleted) VALUES
('LOC001', 'CUST001', 'CUST001', 'ABC Pharmaceuticals Ltd', 'ABC Pharma', 'ABC Pharmaceuticals Ltd', 'WHOLESALE', 'PHARMA', 'ABCDE1234F', 'CREDIT', 'DIRECT', '27ABCDE1234F1Z5', 'DL123456', '2025-12-31', 'OL789012', 'OLD001', 'LOT001', false, true, true, false, true, 'ASIA', '5%', 'Premium customer', NOW(), 1, false),
('LOC002', 'CUST002', 'CUST002', 'XYZ Medical Supplies', 'XYZ Medical', 'XYZ Medical Supplies Pvt Ltd', 'RETAIL', 'HEALTHCARE', 'XYZAB5678G', 'CASH', 'INDIRECT', '12XYZAB5678G2Z6', 'DL789012', '2026-06-30', 'OL345678', 'OLD002', 'LOT002', false, false, true, false, true, 'ASIA', '3%', 'Regular customer', NOW(), 1, false),
('LOC003', 'CUST003', 'CUST003', 'Global Export Corp', 'Global Export', 'Global Export Corporation', 'EXPORT', 'COSMETICS', 'GLOBC9012H', 'CREDIT', 'DIRECT', '33GLOBC9012H3Z7', 'DL345678', '2027-03-15', 'OL901234', 'OLD003', 'LOT003', false, true, true, false, true, 'EUROPE', '7%', 'International customer', NOW(), 1, false);

-- Get the inserted customer IDs for related data
SET @customer1_id = (SELECT id FROM customers WHERE customer_code = 'CUST001');
SET @customer2_id = (SELECT id FROM customers WHERE customer_code = 'CUST002');
SET @customer3_id = (SELECT id FROM customers WHERE customer_code = 'CUST003');

-- Insert Customer Addresses
INSERT INTO customer_addresses (customer_id, address_type, address_line1, address_line2, city, state, postal_code, country, is_active, created_at, created_by, is_deleted) VALUES
(@customer1_id, 'PRIMARY', '123 Pharma Street', 'Industrial Area', 'Mumbai', 'Maharashtra', '400001', 'India', true, NOW(), 1, false),
(@customer2_id, 'PRIMARY', '456 Medical Road', 'Commercial District', 'Delhi', 'Delhi', '110001', 'India', true, NOW(), 1, false),
(@customer3_id, 'PRIMARY', '789 Export Avenue', 'Business Park', 'Chennai', 'Tamil Nadu', '600001', 'India', true, NOW(), 1, false);

-- Insert Customer Banking Details
INSERT INTO customer_banking_details (customer_id, bank_name, account_number, ifsc_code, branch_name, account_type, is_active, created_at, created_by, is_deleted) VALUES
(@customer1_id, 'State Bank of India', '1234567890', 'SBIN0001234', 'Mumbai Main Branch', 'CURRENT', true, NOW(), 1, false),
(@customer2_id, 'HDFC Bank', '0987654321', 'HDFC0000987', 'Delhi Central Branch', 'SAVINGS', true, NOW(), 1, false),
(@customer3_id, 'ICICI Bank', '1122334455', 'ICIC0001122', 'Chennai Main Branch', 'CURRENT', true, NOW(), 1, false);

-- Insert Customer Business Terms
INSERT INTO customer_business_terms (customer_id, payment_terms, credit_limit, credit_days, discount_percentage, is_active, created_at, created_by, is_deleted) VALUES
(@customer1_id, 'Net 30', 1000000, 30, 5, true, NOW(), 1, false),
(@customer2_id, 'COD', 500000, 0, 2, true, NOW(), 1, false),
(@customer3_id, 'Net 45', 2000000, 45, 7, true, NOW(), 1, false);

-- Insert Customer Tax Compliance
INSERT INTO customer_tax_compliance (customer_id, gstin, pan_number, tax_registration_number, tax_category, is_active, created_at, created_by, is_deleted) VALUES
(@customer1_id, '27ABCDE1234F1Z5', 'ABCDE1234F', 'TR123456', 'REGISTERED', true, NOW(), 1, false),
(@customer2_id, '12XYZAB5678G2Z6', 'XYZAB5678G', 'TR789012', 'REGISTERED', true, NOW(), 1, false),
(@customer3_id, '33GLOBC9012H3Z7', 'GLOBC9012H', 'TR345678', 'REGISTERED', true, NOW(), 1, false);

-- Display inserted data summary
SELECT 'Customer Types inserted:' as summary, COUNT(*) as count FROM customer_types WHERE is_deleted = false
UNION ALL
SELECT 'Customers inserted:', COUNT(*) FROM customers WHERE is_deleted = false
UNION ALL
SELECT 'Customer Addresses inserted:', COUNT(*) FROM customer_addresses WHERE is_deleted = false
UNION ALL
SELECT 'Customer Banking Details inserted:', COUNT(*) FROM customer_banking_details WHERE is_deleted = false
UNION ALL
SELECT 'Customer Business Terms inserted:', COUNT(*) FROM customer_business_terms WHERE is_deleted = false
UNION ALL
SELECT 'Customer Tax Compliance inserted:', COUNT(*) FROM customer_tax_compliance WHERE is_deleted = false;
