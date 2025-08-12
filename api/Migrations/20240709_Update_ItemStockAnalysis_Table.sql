-- Migration: Update item_stock_analysis table structure
-- Date: 2024-07-09

-- Add missing columns to item_stock_analysis table
ALTER TABLE item_stock_analysis 
ADD COLUMN IF NOT EXISTS minimum_stock_level DECIMAL(12,4),
ADD COLUMN IF NOT EXISTS maximum_stock_level DECIMAL(12,4),
ADD COLUMN IF NOT EXISTS reorder_level DECIMAL(12,4),
ADD COLUMN IF NOT EXISTS economic_order_quantity DECIMAL(12,4),
ADD COLUMN IF NOT EXISTS lead_time_days INTEGER,
ADD COLUMN IF NOT EXISTS average_usage_per_day DECIMAL(12,4),
ADD COLUMN IF NOT EXISTS last_stock_check_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS last_stock_quantity DECIMAL(12,4),
ADD COLUMN IF NOT EXISTS next_stock_check_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS created_by INTEGER,
ADD COLUMN IF NOT EXISTS updated_by INTEGER;

-- Add foreign key constraints for created_by and updated_by
ALTER TABLE item_stock_analysis 
ADD CONSTRAINT fk_item_stock_analysis_created_by 
FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE item_stock_analysis 
ADD CONSTRAINT fk_item_stock_analysis_updated_by 
FOREIGN KEY (updated_by) REFERENCES users(id); 