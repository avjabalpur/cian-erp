-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
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

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, role_id)
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX idx_roles_name ON roles(name);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
('SUPER_ADMIN', 'System Super Administrator'),
('ADMIN', 'System Administrator'),
('SALES_MANAGER', 'Sales Manager'),
('SALES_EXECUTIVE', 'Sales Executive'),
('PURCHASE_MANAGER', 'Purchase Manager'),
('INVENTORY_MANAGER', 'Inventory Manager'),
('ACCOUNTS_MANAGER', 'Accounts Manager'),
('PHARMACIST', 'Qualified Pharmacist'),
('QUALITY_CONTROLLER', 'Quality Control Officer')
ON CONFLICT (name) DO NOTHING;

-- Insert default admin users (password will be hashed by the application)
-- Default password: Admin@123 (should be hashed using bcrypt)
DO $$
DECLARE
    super_admin_id INTEGER;
    admin_id INTEGER;
BEGIN
    -- Insert Super Admin user
    INSERT INTO users (
        username, 
        email, 
        password_hash, 
        first_name, 
        last_name, 
        employee_id, 
        is_active, 
        is_email_verified,
        created_at,
        updated_at
    ) VALUES (
        'superadmin', 
        'superadmin@xcianify.com', 
        '$2a$12$3K3Kl7dXKZxY8vXJXqXqUu2XqWXWqWXqWXqWXqWXqWXqWXqWXqWXq', -- Hashed 'Admin@123'
        'Super', 
        'Admin', 
        'EMP001', 
        TRUE, 
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO super_admin_id;

    -- Insert Admin user
    INSERT INTO users (
        username, 
        email, 
        password_hash, 
        first_name, 
        last_name, 
        employee_id, 
        is_active, 
        is_email_verified,
        created_at,
        updated_at
    ) VALUES (
        'admin', 
        'admin@xcianify.com', 
        '$2a$12$3K3Kl7dXKZxY8vXJXqXqUu2XqWXWqWXqWXqWXqWXqWXqWXqWXqWXq', -- Hashed 'Admin@123'
        'System', 
        'Administrator', 
        'EMP002', 
        TRUE, 
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO admin_id;

    -- Assign SUPER_ADMIN role to super admin user
    INSERT INTO user_roles (user_id, role_id, assigned_by, is_active)
    SELECT 
        super_admin_id, 
        id, 
        super_admin_id,
        TRUE
    FROM roles 
    WHERE name = 'SUPER_ADMIN'
    ON CONFLICT (user_id, role_id) DO NOTHING;

    -- Assign ADMIN role to admin user
    INSERT INTO user_roles (user_id, role_id, assigned_by, is_active)
    SELECT 
        admin_id, 
        id, 
        super_admin_id,
        TRUE
    FROM roles 
    WHERE name = 'ADMIN'
    ON CONFLICT (user_id, role_id) DO NOTHING;
END $$;

-- Add a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_roles_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();