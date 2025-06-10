-- Property Management System Database Schema
-- Production Ready Version

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS bulletin_posts CASCADE;
DROP TABLE IF EXISTS bulletin_categories CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS maintenance_requests CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS reminder_queue CASCADE;
DROP TABLE IF EXISTS backup_logs CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'tenant' CHECK (role IN ('admin', 'landlord', 'tenant')),
    active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    property_type VARCHAR(50) NOT NULL DEFAULT 'apartment',
    total_units INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Units table
CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    unit_number VARCHAR(50) NOT NULL,
    bedrooms INTEGER DEFAULT 1,
    bathrooms DECIMAL(2,1) DEFAULT 1.0,
    square_feet INTEGER,
    rent_amount DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2) DEFAULT 0,
    tenant_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    lease_start DATE,
    lease_end DATE,
    status VARCHAR(20) DEFAULT 'vacant' CHECK (status IN ('occupied', 'vacant', 'maintenance')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment transactions table
CREATE TABLE payment_transactions (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    unit_id INTEGER REFERENCES units(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(50) NOT NULL DEFAULT 'rent',
    payment_method VARCHAR(50) NOT NULL DEFAULT 'online',
    stripe_payment_intent_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    due_date DATE,
    paid_date TIMESTAMP,
    late_fee DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance requests table
CREATE TABLE maintenance_requests (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    unit_id INTEGER REFERENCES units(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    scheduled_date TIMESTAMP,
    completed_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bulletin categories table
CREATE TABLE bulletin_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50) DEFAULT 'folder',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bulletin posts table
CREATE TABLE bulletin_posts (
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES bulletin_categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_announcement BOOLEAN DEFAULT false,
    target_audience VARCHAR(20) DEFAULT 'all' CHECK (target_audience IN ('all', 'tenants', 'landlords')),
    building_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reminder queue table
CREATE TABLE reminder_queue (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    payment_id INTEGER REFERENCES payment_transactions(id) ON DELETE CASCADE,
    reminder_type VARCHAR(50) NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    sent_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    message_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Backup logs table
CREATE TABLE backup_logs (
    id SERIAL PRIMARY KEY,
    backup_type VARCHAR(50) NOT NULL,
    file_path VARCHAR(500),
    file_size BIGINT,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('started', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default bulletin categories
INSERT INTO bulletin_categories (name, description, color, icon, sort_order) VALUES
('Announcements', 'Important building announcements', '#EF4444', 'megaphone', 1),
('Maintenance', 'Maintenance notices and updates', '#F59E0B', 'wrench', 2),
('Events', 'Community events and activities', '#10B981', 'calendar', 3),
('Marketplace', 'Buy, sell, and trade items', '#8B5CF6', 'shopping-bag', 4),
('Lost & Found', 'Lost and found items', '#06B6D4', 'search', 5),
('Recommendations', 'Service recommendations and reviews', '#84CC16', 'star', 6),
('General', 'General community discussions', '#6366F1', 'message-circle', 7);

-- Insert default admin user (password: root)
-- Password hash for 'root' using bcrypt with 12 rounds
INSERT INTO users (email, password, first_name, last_name, role, active, email_verified) VALUES
('root@admin.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O', 'System', 'Administrator', 'admin', true, true);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_payment_transactions_tenant_id ON payment_transactions(tenant_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_maintenance_requests_tenant_id ON maintenance_requests(tenant_id);
CREATE INDEX idx_maintenance_requests_status ON maintenance_requests(status);
CREATE INDEX idx_bulletin_posts_category_id ON bulletin_posts(category_id);
CREATE INDEX idx_bulletin_posts_author_id ON bulletin_posts(author_id);
CREATE INDEX idx_bulletin_posts_status ON bulletin_posts(status);
CREATE INDEX idx_units_property_id ON units(property_id);
CREATE INDEX idx_units_tenant_id ON units(tenant_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_requests_updated_at BEFORE UPDATE ON maintenance_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bulletin_categories_updated_at BEFORE UPDATE ON bulletin_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bulletin_posts_updated_at BEFORE UPDATE ON bulletin_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
