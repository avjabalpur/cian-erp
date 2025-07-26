-- Create Permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    module_name VARCHAR(50) NOT NULL,
    action_type VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Role_Permissions join table
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(role_id, permission_id)
);

-- Add index for better performance on permission lookups
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);

-- Add some default permissions
INSERT INTO permissions (name, description, module_name, action_type) VALUES
    ('users:read', 'View user information', 'Users', 'Read'),
    ('users:create', 'Create new users', 'Users', 'Create'),
    ('users:update', 'Update user information', 'Users', 'Update'),
    ('users:delete', 'Delete users', 'Users', 'Delete'),
    ('roles:read', 'View role information', 'Roles', 'Read'),
    ('roles:create', 'Create new roles', 'Roles', 'Create'),
    ('roles:update', 'Update role information', 'Roles', 'Update'),
    ('roles:delete', 'Delete roles', 'Roles', 'Delete'),
    ('permissions:read', 'View permission information', 'Permissions', 'Read'),
    ('permissions:assign', 'Assign permissions to roles', 'Permissions', 'Update');

-- Grant all permissions to admin role (assuming role with ID 1 is admin)
INSERT INTO role_permissions (role_id, permission_id, granted_by)
SELECT 1, id, 1 FROM permissions
ON CONFLICT (role_id, permission_id) DO NOTHING;
