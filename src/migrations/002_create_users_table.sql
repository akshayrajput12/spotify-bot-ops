-- ============================================================================
-- Spotify Playtime Enhancer - Users Management Tables
-- Migration: 002_create_users_table.sql
-- Created: 2024-08-17
-- Description: User management, profiles, and authentication tables
-- ============================================================================

USE spotify_admin_panel;

-- Create users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    location VARCHAR(255),
    spotify_user_id VARCHAR(255) UNIQUE,
    spotify_access_token TEXT,
    spotify_refresh_token TEXT,
    spotify_token_expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_premium_spotify BOOLEAN DEFAULT FALSE,
    account_type ENUM('free', 'premium') DEFAULT 'free',
    referral_code VARCHAR(20) UNIQUE,
    referred_by VARCHAR(36),
    email_verified_at TIMESTAMP NULL,
    phone_verified_at TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (referred_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_spotify_user (spotify_user_id),
    INDEX idx_referral_code (referral_code),
    INDEX idx_active (is_active),
    INDEX idx_verified (is_verified),
    INDEX idx_created_at (created_at),
    INDEX idx_last_login (last_login)
);

-- Create KYC verification table
CREATE TABLE user_kyc (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    kyc_status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',
    document_type ENUM('aadhaar', 'pan', 'passport', 'driving_license') NOT NULL,
    document_number VARCHAR(100),
    document_front_url VARCHAR(500),
    document_back_url VARCHAR(500),
    selfie_url VARCHAR(500),
    rejection_reason TEXT,
    verified_by VARCHAR(36),
    verified_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    digio_request_id VARCHAR(255),
    digio_response JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (kyc_status),
    INDEX idx_document_type (document_type),
    INDEX idx_digio_request (digio_request_id)
);

-- Create user profiles table for additional information
CREATE TABLE user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    avatar_url VARCHAR(500),
    bio TEXT,
    favorite_genres JSON,
    favorite_artists JSON,
    listening_preferences JSON,
    privacy_settings JSON,
    notification_preferences JSON,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    language_preference VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_profile (user_id),
    INDEX idx_timezone (timezone),
    INDEX idx_language (language_preference)
);

-- Create user sessions table for session management
CREATE TABLE user_sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    device_info JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_active (is_active),
    INDEX idx_expires_at (expires_at)
);

-- Create user login history table
CREATE TABLE user_login_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    login_method ENUM('email', 'google', 'facebook', 'spotify') DEFAULT 'email',
    ip_address VARCHAR(45),
    user_agent TEXT,
    location_info JSON,
    login_status ENUM('success', 'failed', 'blocked') DEFAULT 'success',
    failure_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (login_status),
    INDEX idx_created_at (created_at),
    INDEX idx_ip_address (ip_address)
);

-- Create password reset tokens table
CREATE TABLE password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- Create email verification tokens table
CREATE TABLE email_verification_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_email (email)
);

-- Create user blocked IPs table
CREATE TABLE user_blocked_ips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36),
    ip_address VARCHAR(45) NOT NULL,
    reason VARCHAR(255),
    blocked_by VARCHAR(36),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_ip_address (ip_address),
    INDEX idx_user_id (user_id),
    INDEX idx_active (is_active)
);

-- Add sample data for testing
INSERT INTO users (email, password_hash, name, phone, location, is_verified, account_type, referral_code) VALUES
('john.doe@email.com', '$2b$10$example_hash_1', 'John Doe', '+91-9876543210', 'Mumbai, Maharashtra', TRUE, 'premium', 'JD2024001'),
('jane.smith@email.com', '$2b$10$example_hash_2', 'Jane Smith', '+91-9876543211', 'Delhi, India', TRUE, 'free', 'JS2024002'),
('mike.wilson@email.com', '$2b$10$example_hash_3', 'Mike Wilson', '+91-9876543212', 'Bangalore, Karnataka', FALSE, 'free', 'MW2024003'),
('sarah.connor@email.com', '$2b$10$example_hash_4', 'Sarah Connor', '+91-9876543213', 'Chennai, Tamil Nadu', TRUE, 'premium', 'SC2024004'),
('david.lee@email.com', '$2b$10$example_hash_5', 'David Lee', '+91-9876543214', 'Pune, Maharashtra', FALSE, 'free', 'DL2024005');

-- Add KYC records for sample users
INSERT INTO user_kyc (user_id, kyc_status, document_type, document_number, verified_at) VALUES
((SELECT id FROM users WHERE email = 'john.doe@email.com'), 'approved', 'aadhaar', 'XXXX-XXXX-1234', NOW()),
((SELECT id FROM users WHERE email = 'jane.smith@email.com'), 'pending', 'pan', 'ABCDE1234F', NULL),
((SELECT id FROM users WHERE email = 'mike.wilson@email.com'), 'rejected', 'aadhaar', 'XXXX-XXXX-5678', NOW()),
((SELECT id FROM users WHERE email = 'sarah.connor@email.com'), 'approved', 'pan', 'FGHIJ5678K', NOW()),
((SELECT id FROM users WHERE email = 'david.lee@email.com'), 'pending', 'aadhaar', 'XXXX-XXXX-9012', NULL);

-- Create triggers for automatic updates
DELIMITER //

CREATE TRIGGER users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
BEGIN 
    SET NEW.updated_at = CURRENT_TIMESTAMP; 
END;//

CREATE TRIGGER user_kyc_updated_at 
    BEFORE UPDATE ON user_kyc 
    FOR EACH ROW 
BEGIN 
    SET NEW.updated_at = CURRENT_TIMESTAMP; 
END;//

DELIMITER ;

-- Add table comments
ALTER TABLE users COMMENT = 'Main user accounts and authentication information';
ALTER TABLE user_kyc COMMENT = 'KYC verification documents and status';
ALTER TABLE user_profiles COMMENT = 'Extended user profile information and preferences';
ALTER TABLE user_sessions COMMENT = 'Active user sessions for authentication';
ALTER TABLE user_login_history COMMENT = 'Historical login attempts and security monitoring';
ALTER TABLE password_reset_tokens COMMENT = 'Password reset token management';
ALTER TABLE email_verification_tokens COMMENT = 'Email verification token management';
ALTER TABLE user_blocked_ips COMMENT = 'IP blocking for security and abuse prevention';

COMMIT;