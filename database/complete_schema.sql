-- Complete Property Management Database Schema
-- Production-ready with all features

-- Drop existing tables if they exist
DROP TABLE IF EXISTS sms_logs;
DROP TABLE IF EXISTS payment_transactions;
DROP TABLE IF EXISTS maintenance_requests;
DROP TABLE IF EXISTS bulletin_posts;
DROP TABLE IF EXISTS tenants;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'property_manager', 'tenant') NOT NULL DEFAULT 'tenant',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(32),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(64),
    password_reset_token VARCHAR(64),
    password_reset_expires DATETIME,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Properties table
CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    property_manager_id INT,
    total_units INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_manager_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_manager (property_manager_id)
);

-- Tenants table
CREATE TABLE tenants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    unit VARCHAR(50),
    rent_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    rent_due_day INT NOT NULL DEFAULT 1,
    lease_start DATE,
    lease_end DATE,
    security_deposit DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_property (user_id, property_id),
    INDEX idx_property (property_id),
    INDEX idx_status (status)
);

-- Payment transactions table
CREATE TABLE payment_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('credit_card', 'bank_transfer', 'ach', 'paypal', 'venmo', 'crypto') NOT NULL,
    payment_type ENUM('rent', 'late_fee', 'security_deposit', 'other') DEFAULT 'rent',
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    transaction_fee DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(10,2),
    payment_date DATETIME,
    due_date DATE,
    description TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant (tenant_id),
    INDEX idx_status (status),
    INDEX idx_payment_date (payment_date),
    INDEX idx_due_date (due_date)
);

-- Maintenance requests table
CREATE TABLE maintenance_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'emergency') DEFAULT 'medium',
    status ENUM('submitted', 'assigned', 'in_progress', 'completed', 'cancelled') DEFAULT 'submitted',
    assigned_to INT,
    access_instructions TEXT,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    scheduled_date DATETIME,
    completed_date DATETIME,
    tenant_rating INT CHECK (tenant_rating >= 1 AND tenant_rating &lt;= 5),
    tenant_feedback TEXT,
    attachments JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tenant (tenant_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_assigned (assigned_to)
);

-- Bulletin posts table
CREATE TABLE bulletin_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category ENUM('announcement', 'maintenance', 'event', 'community', 'marketplace', 'lost_found') NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    target_audience ENUM('all', 'tenants', 'managers') DEFAULT 'all',
    expires_at DATETIME,
    attachments JSON,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_property (property_id),
    INDEX idx_author (author_id),
    INDEX idx_category (category),
    INDEX idx_pinned (is_pinned),
    INDEX idx_created (created_at)
);

-- SMS logs table
CREATE TABLE sms_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_id INT,
    phone_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    message_type ENUM('payment_reminder', 'payment_confirmation', 'maintenance_update', 'bulk_message', 'other') NOT NULL,
    status ENUM('pending', 'sent', 'delivered', 'failed') DEFAULT 'pending',
    provider VARCHAR(50) DEFAULT 'twilio',
    provider_message_id VARCHAR(255),
    error_message TEXT,
    cost DECIMAL(8,4),
    sent_at DATETIME,
    delivered_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_recipient (recipient_id),
    INDEX idx_phone (phone_number),
    INDEX idx_type (message_type),
    INDEX idx_status (status),
    INDEX idx_sent (sent_at)
);

-- Insert default admin user
INSERT INTO users (name, email, password, role, email_verified) VALUES 
('System Administrator', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE);

-- Insert sample property
INSERT INTO properties (name, address, city, state, zip_code, total_units) VALUES 
('Sunset Towers', '123 Main Street', 'Cityville', 'CA', '90210', 50);

-- Insert sample tenant user
INSERT INTO users (name, email, password, phone, role, email_verified) VALUES 
('John Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567890', 'tenant', TRUE);

-- Insert sample tenant
INSERT INTO tenants (user_id, property_id, unit, rent_amount, rent_due_day, lease_start, lease_end, status) VALUES 
(2, 1, 'Apt 304', 1250.00, 15, '2024-01-01', '2024-12-31', 'active');
