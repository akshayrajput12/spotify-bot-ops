-- ============================================================================
-- Spotify Playtime Enhancer - Transactions and Wallet Tables
-- Migration: 003_create_transactions_table.sql
-- Created: 2024-08-17
-- Description: Financial transactions, wallets, and payment gateway integration
-- ============================================================================

USE spotify_admin_panel;

-- Create wallet accounts table
CREATE TABLE wallet_accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    wallet_type ENUM('main', 'bonus', 'points') DEFAULT 'main',
    balance DECIMAL(15,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'INR',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_wallet_type (user_id, wallet_type),
    INDEX idx_user_id (user_id),
    INDEX idx_wallet_type (wallet_type),
    INDEX idx_active (is_active),
    
    CONSTRAINT chk_balance_non_negative CHECK (balance >= 0)
);

-- Create transactions table
CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    wallet_account_id BIGINT NOT NULL,
    transaction_type ENUM('credit', 'debit') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    category ENUM('deposit', 'withdrawal', 'reward', 'refund', 'fee', 'bonus', 'points_conversion') NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
    description TEXT,
    reference_id VARCHAR(255),
    gateway_transaction_id VARCHAR(255),
    gateway_name ENUM('razorpay', 'payu', 'phonepe', 'upi', 'netbanking', 'card') NULL,
    gateway_response JSON,
    fee_amount DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    processed_by VARCHAR(36) NULL,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_account_id) REFERENCES wallet_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_wallet_account (wallet_account_id),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_reference_id (reference_id),
    INDEX idx_gateway_transaction (gateway_transaction_id),
    INDEX idx_created_at (created_at),
    INDEX idx_amount (amount),
    
    CONSTRAINT chk_amount_positive CHECK (amount > 0),
    CONSTRAINT chk_net_amount_positive CHECK (net_amount > 0)
);

-- Create payment methods table
CREATE TABLE payment_methods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    method_type ENUM('card', 'upi', 'netbanking', 'wallet') NOT NULL,
    provider VARCHAR(50),
    masked_details VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    gateway_method_id VARCHAR(255),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_method_type (method_type),
    INDEX idx_is_default (is_default),
    INDEX idx_active (is_active)
);

-- Create payment gateway configurations table
CREATE TABLE payment_gateway_configs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gateway_name VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    configuration JSON NOT NULL,
    api_endpoints JSON,
    supported_methods JSON,
    fee_structure JSON,
    min_amount DECIMAL(10,2) DEFAULT 1.00,
    max_amount DECIMAL(15,2) DEFAULT 100000.00,
    daily_limit DECIMAL(15,2) DEFAULT 50000.00,
    monthly_limit DECIMAL(15,2) DEFAULT 200000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_gateway_name (gateway_name),
    INDEX idx_active (is_active)
);

-- Create points system table
CREATE TABLE points_accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    total_points BIGINT DEFAULT 0,
    available_points BIGINT DEFAULT 0,
    redeemed_points BIGINT DEFAULT 0,
    expired_points BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_points (user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_available_points (available_points),
    
    CONSTRAINT chk_points_non_negative CHECK (
        total_points >= 0 AND 
        available_points >= 0 AND 
        redeemed_points >= 0 AND 
        expired_points >= 0
    )
);

-- Create points transactions table
CREATE TABLE points_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    points_account_id BIGINT NOT NULL,
    transaction_type ENUM('earned', 'redeemed', 'expired', 'bonus', 'penalty') NOT NULL,
    points_amount BIGINT NOT NULL,
    source ENUM('playtime', 'referral', 'bonus', 'manual', 'conversion', 'daily_login', 'achievement') NOT NULL,
    source_reference VARCHAR(255),
    description TEXT,
    expires_at TIMESTAMP NULL,
    balance_before BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    processed_by VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (points_account_id) REFERENCES points_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_points_account (points_account_id),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_source (source),
    INDEX idx_expires_at (expires_at),
    INDEX idx_created_at (created_at),
    
    CONSTRAINT chk_points_amount_positive CHECK (points_amount > 0)
);

-- Create withdrawal requests table
CREATE TABLE withdrawal_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    wallet_account_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    withdrawal_method ENUM('bank_transfer', 'upi', 'wallet') NOT NULL,
    bank_details JSON,
    status ENUM('pending', 'approved', 'processing', 'completed', 'rejected', 'cancelled') DEFAULT 'pending',
    admin_notes TEXT,
    rejection_reason TEXT,
    processed_by VARCHAR(36) NULL,
    processed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    transaction_id VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_account_id) REFERENCES wallet_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_amount (amount),
    
    CONSTRAINT chk_withdrawal_amount_positive CHECK (amount > 0)
);

-- Create conversion rates table (points to INR)
CREATE TABLE conversion_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_currency VARCHAR(10) NOT NULL,
    to_currency VARCHAR(10) NOT NULL,
    rate DECIMAL(10,6) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    effective_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_currencies (from_currency, to_currency),
    INDEX idx_effective_dates (effective_from, effective_until),
    INDEX idx_active (is_active)
);

-- Insert sample data

-- Create wallet accounts for sample users
INSERT INTO wallet_accounts (user_id, wallet_type, balance) 
SELECT id, 'main', 
    CASE 
        WHEN email = 'john.doe@email.com' THEN 2450.00
        WHEN email = 'jane.smith@email.com' THEN 890.50
        WHEN email = 'mike.wilson@email.com' THEN 0.00
        WHEN email = 'sarah.connor@email.com' THEN 1250.75
        WHEN email = 'david.lee@email.com' THEN 675.25
    END as balance
FROM users WHERE email IN ('john.doe@email.com', 'jane.smith@email.com', 'mike.wilson@email.com', 'sarah.connor@email.com', 'david.lee@email.com');

-- Create points accounts for sample users
INSERT INTO points_accounts (user_id, total_points, available_points) 
SELECT id, 
    CASE 
        WHEN email = 'john.doe@email.com' THEN 15000
        WHEN email = 'jane.smith@email.com' THEN 8900
        WHEN email = 'mike.wilson@email.com' THEN 4500
        WHEN email = 'sarah.connor@email.com' THEN 20300
        WHEN email = 'david.lee@email.com' THEN 6750
    END as total_points,
    CASE 
        WHEN email = 'john.doe@email.com' THEN 12500
        WHEN email = 'jane.smith@email.com' THEN 7200
        WHEN email = 'mike.wilson@email.com' THEN 4500
        WHEN email = 'sarah.connor@email.com' THEN 16800
        WHEN email = 'david.lee@email.com' THEN 6750
    END as available_points
FROM users WHERE email IN ('john.doe@email.com', 'jane.smith@email.com', 'mike.wilson@email.com', 'sarah.connor@email.com', 'david.lee@email.com');

-- Insert default conversion rates
INSERT INTO conversion_rates (from_currency, to_currency, rate, is_active) VALUES
('POINTS', 'INR', 0.10, TRUE),  -- 10 points = 1 INR
('INR', 'POINTS', 10.00, TRUE);  -- 1 INR = 10 points

-- Insert default payment gateway configurations
INSERT INTO payment_gateway_configs (gateway_name, is_active, configuration, supported_methods, min_amount, max_amount) VALUES
('razorpay', TRUE, '{"api_key": "encrypted_key", "webhook_secret": "encrypted_secret"}', '["card", "upi", "netbanking", "wallet"]', 1.00, 50000.00),
('payu', TRUE, '{"merchant_key": "encrypted_key", "salt": "encrypted_salt"}', '["card", "upi", "netbanking"]', 1.00, 25000.00),
('phonepe', TRUE, '{"merchant_id": "encrypted_id", "api_key": "encrypted_key"}', '["upi", "wallet"]', 1.00, 10000.00);

-- Add table comments
ALTER TABLE wallet_accounts COMMENT = 'User wallet accounts for different currency types';
ALTER TABLE transactions COMMENT = 'All financial transactions including deposits, withdrawals, and rewards';
ALTER TABLE payment_methods COMMENT = 'User saved payment methods and preferences';
ALTER TABLE payment_gateway_configs COMMENT = 'Payment gateway configurations and settings';
ALTER TABLE points_accounts COMMENT = 'User points balance and history summary';
ALTER TABLE points_transactions COMMENT = 'Detailed points earning and redemption history';
ALTER TABLE withdrawal_requests COMMENT = 'User withdrawal requests and approval workflow';
ALTER TABLE conversion_rates COMMENT = 'Currency and points conversion rates';

COMMIT;