-- Migration: Add Dosage Table
-- Date: 2024-07-09

CREATE TABLE IF NOT EXISTS dosage (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  register_date VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  updated_by INTEGER,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_dosage_name ON dosage(name);
CREATE INDEX IF NOT EXISTS idx_dosage_is_active ON dosage(is_active);
CREATE INDEX IF NOT EXISTS idx_dosage_is_deleted ON dosage(is_deleted);

-- Insert some sample data
INSERT INTO dosage (name, register_date, is_active) VALUES
('Tablet', '2024-01-01', true),
('Capsule', '2024-01-01', true),
('Syrup', '2024-01-01', true),
('Injection', '2024-01-01', true),
('Cream', '2024-01-01', true),
('Ointment', '2024-01-01', true),
('Gel', '2024-01-01', true),
('Suspension', '2024-01-01', true),
('Drops', '2024-01-01', true),
('Powder', '2024-01-01', true)
ON CONFLICT DO NOTHING; 