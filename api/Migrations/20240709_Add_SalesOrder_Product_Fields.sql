-- Migration: Add product info fields to sales_orders table
-- Date: 2024-07-09
-- Description: Add missing fields for product info form

-- Add new fields for product info form
ALTER TABLE sales_orders 
ADD COLUMN IF NOT EXISTS shelf_life VARCHAR(200),
ADD COLUMN IF NOT EXISTS colour VARCHAR(200);

-- Add comments for documentation
COMMENT ON COLUMN sales_orders.shelf_life IS 'Shelf life for product info form';
COMMENT ON COLUMN sales_orders.colour IS 'Colour for product info form';
