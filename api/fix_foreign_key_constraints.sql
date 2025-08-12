-- Fix foreign key constraints for item_stock_analysis table
-- This script fixes the issue where foreign key constraints reference 'users(id)' 
-- but the users table uses 'srno' as the primary key

-- Option 1: Drop the foreign key constraints (Recommended for now)
-- This allows the application to work without requiring valid user IDs
ALTER TABLE item_stock_analysis DROP CONSTRAINT IF EXISTS fk_item_stock_analysis_created_by;
ALTER TABLE item_stock_analysis DROP CONSTRAINT IF EXISTS fk_item_stock_analysis_updated_by;

-- Option 2: Update the constraints to reference the correct column (Alternative)
-- Uncomment the following lines if you want to keep foreign key constraints
-- ALTER TABLE item_stock_analysis DROP CONSTRAINT IF EXISTS fk_item_stock_analysis_created_by;
-- ALTER TABLE item_stock_analysis DROP CONSTRAINT IF EXISTS fk_item_stock_analysis_updated_by;
-- 
-- ALTER TABLE item_stock_analysis 
-- ADD CONSTRAINT fk_item_stock_analysis_created_by 
-- FOREIGN KEY (created_by) REFERENCES users(srno);
-- 
-- ALTER TABLE item_stock_analysis 
-- ADD CONSTRAINT fk_item_stock_analysis_updated_by 
-- FOREIGN KEY (updated_by) REFERENCES users(srno);

-- Verify the constraints are removed
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'item_stock_analysis' 
    AND tc.constraint_type = 'FOREIGN KEY';
