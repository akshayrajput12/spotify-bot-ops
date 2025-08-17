-- ============================================================================
-- Spotify Playtime Enhancer - Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Created: 2024-08-17
-- Description: Initial database schema setup with core tables
-- ============================================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS spotify_admin_panel;
USE spotify_admin_panel;

-- Enable foreign key constraints
SET FOREIGN_KEY_CHECKS = 1;

-- Create admin users table first (referenced by other tables)
CREATE TABLE admin_users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- Insert default super admin user
INSERT INTO admin_users (email, password_hash, name, role) VALUES 
('admin@spotify.com', '$2b$10$example_hash_here', 'Super Admin', 'super_admin');

-- Create audit logs table for tracking all admin actions
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_admin_user (admin_user_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_created_at (created_at)
);

-- Create system settings table
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key (setting_key),
    INDEX idx_public (is_public)
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('platform_name', 'Spotify Playtime Enhancer', 'string', 'Platform display name', TRUE),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', FALSE),
('max_daily_playtime', '480', 'number', 'Maximum daily playtime in minutes', FALSE),
('points_per_minute', '10', 'number', 'Points earned per minute of playtime', TRUE),
('kyc_auto_approval', 'false', 'boolean', 'Enable automatic KYC approval', FALSE);

-- Create notification templates table
CREATE TABLE notification_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_key VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    template_type ENUM('email', 'push', 'sms') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key (template_key),
    INDEX idx_type (template_type),
    INDEX idx_active (is_active)
);

-- Insert default notification templates
INSERT INTO notification_templates (template_key, title, message, template_type) VALUES
('kyc_approved', 'KYC Approved', 'Your KYC verification has been approved. You can now access all platform features.', 'email'),
('kyc_rejected', 'KYC Rejected', 'Your KYC verification has been rejected. Please contact support for more information.', 'email'),
('wallet_credited', 'Wallet Credited', 'Your wallet has been credited with ₹{amount}. Current balance: ₹{balance}', 'push'),
('points_earned', 'Points Earned', 'You earned {points} points! Keep listening to earn more rewards.', 'push');

-- Create API keys table for external integrations
CREATE TABLE api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    key_name VARCHAR(100) NOT NULL,
    encrypted_key TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_service (service_name),
    INDEX idx_active (is_active),
    INDEX idx_expires (expires_at)
);

-- Create rate limiting table
CREATE TABLE rate_limits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    identifier VARCHAR(100) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    requests_count INT DEFAULT 1,
    window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_identifier_endpoint (identifier, endpoint),
    INDEX idx_window_start (window_start)
);

-- Add comments to tables
ALTER TABLE admin_users COMMENT = 'Admin panel user accounts and authentication';
ALTER TABLE audit_logs COMMENT = 'Audit trail for all admin actions and system changes';
ALTER TABLE system_settings COMMENT = 'Global system configuration settings';
ALTER TABLE notification_templates COMMENT = 'Email and push notification templates';
ALTER TABLE api_keys COMMENT = 'Encrypted storage for external API keys';
ALTER TABLE rate_limits COMMENT = 'API rate limiting tracking';

-- Create indexes for performance
CREATE INDEX idx_audit_logs_performance ON audit_logs (admin_user_id, created_at DESC);
CREATE INDEX idx_rate_limits_cleanup ON rate_limits (window_start);

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON spotify_admin_panel.* TO 'app_user'@'%';

COMMIT;