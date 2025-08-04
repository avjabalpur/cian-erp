
-- Migration-safe insert statements for item_type table

INSERT INTO item_type (code, name, description, parent_type_id, is_active, created_by, updated_by) 
SELECT 'RM', 'Raw Material', 'Raw Material', NULL, TRUE, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM item_type WHERE code = 'RM');

INSERT INTO item_type (code, name, description, parent_type_id, is_active, created_by, updated_by) 
SELECT 'PM', 'Packing Material', 'Packing Material', NULL, TRUE, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM item_type WHERE code = 'PM');

INSERT INTO item_type (code, name, description, parent_type_id, is_active, created_by, updated_by) 
SELECT 'CO', 'Consumables', 'Consumables', NULL, TRUE, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM item_type WHERE code = 'CO');

INSERT INTO item_type (code, name, description, parent_type_id, is_active, created_by, updated_by) 
SELECT 'CG', 'Capital Goods', 'Capital Goods', NULL, TRUE, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM item_type WHERE code = 'CG');

INSERT INTO item_type (code, name, description, parent_type_id, is_active, created_by, updated_by) 
SELECT 'SP', 'Spares', 'Spares', NULL, TRUE, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM item_type WHERE code = 'SP');

INSERT INTO item_type (code, name, description, parent_type_id, is_active, created_by, updated_by) 
SELECT 'IM', 'Intermediate Material', 'Intermediate Material', NULL, TRUE, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM item_type WHERE code = 'IM');

INSERT INTO item_type (code, name, description, parent_type_id, is_active, created_by, updated_by) 
SELECT 'FG', 'Finished Goods', 'Finished Goods', NULL, TRUE, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM item_type WHERE code = 'FG');

INSERT INTO item_type (code, name, description, parent_type_id, is_active, created_by, updated_by) 
SELECT 'TR', 'Trading Items', 'Trading Items', NULL, TRUE, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM item_type WHERE code = 'TR');

INSERT INTO item_type (code, name, description, parent_type_id, is_active, created_by, updated_by) 
SELECT 'SV', 'Service Items', 'Service Items', NULL, TRUE, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM item_type WHERE code = 'SV');

INSERT INTO item_type (code, name, description, parent_type_id, is_active, created_by, updated_by) 
SELECT 'SF', 'SEMI FINISH', 'SEMI FINISH', NULL, TRUE, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM item_type WHERE code = 'SF');

INSERT INTO item_type (code, name, description, parent_type_id, is_active, created_by, updated_by) 
SELECT 'AD', 'ADVERTISEMENT', 'ADVERTISEMENT', NULL, TRUE, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM item_type WHERE code = 'AD');

INSERT INTO item_type (code, name, description, parent_type_id, is_active, created_by, updated_by) 
SELECT 'SC', 'SCRAP ITEMS', 'SCRAP ITEMS', NULL, TRUE, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM item_type WHERE code = 'SC');