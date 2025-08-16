-- =====================================================
-- SPOTIFY BOT ADMIN SYSTEM - COMPLETE DATABASE SCHEMA
-- Professional Company Standard SQL Implementation
-- =====================================================

-- Database Creation
CREATE DATABASE IF NOT EXISTS spotify_bot_admin
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE spotify_bot_admin;

-- =====================================================
-- 1. CORE USER MANAGEMENT TABLES
-- =====================================================

-- Users table - Core user information
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_uuid CHAR(36) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    profile_picture_url VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    language_preference ENUM('en', 'hi', 'ta', 'te', 'bn') DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_user_uuid (user_uuid),
    INDEX idx_is_active (is_active),
    INDEX idx_is_premium (is_premium),
    INDEX idx_created_at (created_at)
);

-- User KYC (Know Your Customer) table
CREATE TABLE user_kyc (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    kyc_status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',
    document_type ENUM('aadhar', 'pan', 'passport', 'driving_license', 'voter_id') NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    document_front_url VARCHAR(500),
    document_back_url VARCHAR(500),
    selfie_url VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by BIGINT UNSIGNED NULL,
    rejection_reason TEXT NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_user_id (user_id),
    INDEX idx_kyc_status (kyc_status),
    INDEX idx_submitted_at (submitted_at)
);

-- User addresses table
CREATE TABLE user_addresses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    address_type ENUM('home', 'work', 'billing', 'shipping') DEFAULT 'home',
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_address_type (address_type)
);

-- =====================================================
-- 2. SPOTIFY INTEGRATION TABLES
-- =====================================================

-- Spotify accounts table
CREATE TABLE spotify_accounts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    spotify_user_id VARCHAR(100) NOT NULL UNIQUE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    token_expires_at TIMESTAMP NOT NULL,
    display_name VARCHAR(255),
    profile_picture_url VARCHAR(500),
    country VARCHAR(10),
    product_type ENUM('free', 'premium', 'family', 'student') DEFAULT 'free',
    is_connected BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_spotify_user_id (spotify_user_id),
    INDEX idx_is_connected (is_connected)
);

-- User listening sessions table
CREATE TABLE listening_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    spotify_account_id BIGINT UNSIGNED NOT NULL,
    session_uuid CHAR(36) NOT NULL UNIQUE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NULL,
    duration_minutes INT UNSIGNED DEFAULT 0,
    is_bot_session BOOLEAN DEFAULT FALSE,
    bot_config_id BIGINT UNSIGNED NULL,
    session_status ENUM('active', 'completed', 'paused', 'cancelled') DEFAULT 'active',
    total_tracks_played INT UNSIGNED DEFAULT 0,
    total_playtime_minutes INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (spotify_account_id) REFERENCES spotify_accounts(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_session_uuid (session_uuid),
    INDEX idx_start_time (start_time),
    INDEX idx_is_bot_session (is_bot_session),
    INDEX idx_session_status (session_status)
);

-- Track listening history table
CREATE TABLE track_listening_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT UNSIGNED NOT NULL,
    spotify_track_id VARCHAR(100) NOT NULL,
    track_name VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    album_name VARCHAR(255),
    duration_ms INT UNSIGNED NOT NULL,
    played_at TIMESTAMP NOT NULL,
    play_duration_ms INT UNSIGNED DEFAULT 0,
    is_skipped BOOLEAN DEFAULT FALSE,
    skip_reason ENUM('user_skip', 'bot_skip', 'track_end', 'session_end') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES listening_sessions(id) ON DELETE CASCADE,
    
    INDEX idx_session_id (session_id),
    INDEX idx_spotify_track_id (spotify_track_id),
    INDEX idx_played_at (played_at)
);

-- =====================================================
-- 3. BOT CONFIGURATION TABLES
-- =====================================================

-- Bot configurations table
CREATE TABLE bot_configurations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    config_name VARCHAR(255) NOT NULL,
    config_description TEXT,
    min_session_duration_minutes INT UNSIGNED DEFAULT 15,
    max_session_duration_minutes INT UNSIGNED DEFAULT 45,
    min_delay_between_actions_seconds INT UNSIGNED DEFAULT 5,
    max_delay_between_actions_seconds INT UNSIGNED DEFAULT 30,
    playback_mode ENUM('intelligent', 'random', 'sequential', 'user_preference') DEFAULT 'intelligent',
    enable_premium_only BOOLEAN DEFAULT TRUE,
    max_daily_sessions INT UNSIGNED DEFAULT 10,
    session_cooldown_minutes INT UNSIGNED DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_is_active (is_active),
    INDEX idx_created_by (created_by)
);

-- Bot session logs table
CREATE TABLE bot_session_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT UNSIGNED NOT NULL,
    bot_config_id BIGINT UNSIGNED NOT NULL,
    action_type ENUM('play', 'pause', 'skip', 'resume', 'stop') NOT NULL,
    action_timestamp TIMESTAMP NOT NULL,
    action_details JSON,
    execution_time_ms INT UNSIGNED DEFAULT 0,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES listening_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (bot_config_id) REFERENCES bot_configurations(id) ON DELETE CASCADE,
    
    INDEX idx_session_id (session_id),
    INDEX idx_action_type (action_type),
    INDEX idx_action_timestamp (action_timestamp)
);

-- =====================================================
-- 4. REWARDS & POINTS SYSTEM TABLES
-- =====================================================

-- Reward configurations table
CREATE TABLE reward_configurations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    config_name VARCHAR(255) NOT NULL,
    config_description TEXT,
    points_per_minute DECIMAL(10,2) DEFAULT 1.0,
    base_multiplier DECIMAL(5,2) DEFAULT 1.0,
    premium_multiplier DECIMAL(5,2) DEFAULT 1.5,
    invite_bonus_points INT UNSIGNED DEFAULT 500,
    referral_bonus_points INT UNSIGNED DEFAULT 100,
    daily_login_bonus_points INT UNSIGNED DEFAULT 10,
    weekly_streak_bonus_points INT UNSIGNED DEFAULT 50,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_is_active (is_active)
);

-- Playtime thresholds table
CREATE TABLE playtime_thresholds (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    threshold_minutes INT UNSIGNED NOT NULL,
    points_reward INT UNSIGNED NOT NULL,
    threshold_name VARCHAR(100),
    is_premium_only BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_threshold_minutes (threshold_minutes),
    INDEX idx_is_active (is_active)
);

-- User points table
CREATE TABLE user_points (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    points_balance INT NOT NULL DEFAULT 0,
    total_points_earned INT UNSIGNED DEFAULT 0,
    total_points_spent INT UNSIGNED DEFAULT 0,
    last_points_earned_at TIMESTAMP NULL,
    last_points_spent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_points_balance (points_balance)
);

-- Points transactions table
CREATE TABLE points_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    transaction_uuid CHAR(36) NOT NULL UNIQUE,
    transaction_type ENUM('earned', 'spent', 'bonus', 'deducted', 'expired', 'refunded') NOT NULL,
    points_amount INT NOT NULL,
    points_balance_after INT NOT NULL,
    source_type ENUM('playtime', 'threshold', 'invite', 'referral', 'daily_login', 'weekly_streak', 'manual', 'reward_redemption') NOT NULL,
    source_id BIGINT UNSIGNED NULL,
    description TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_transaction_uuid (transaction_uuid),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_source_type (source_type),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 5. FINANCIAL & WALLET TABLES
-- =====================================================

-- User wallets table
CREATE TABLE user_wallets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    wallet_uuid CHAR(36) NOT NULL UNIQUE,
    inr_balance DECIMAL(12,2) DEFAULT 0.00,
    points_balance INT UNSIGNED DEFAULT 0,
    total_deposited DECIMAL(12,2) DEFAULT 0.00,
    total_withdrawn DECIMAL(12,2) DEFAULT 0.00,
    total_earned DECIMAL(12,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_wallet_uuid (wallet_uuid)
);

-- Financial transactions table
CREATE TABLE financial_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    wallet_id BIGINT UNSIGNED NOT NULL,
    transaction_uuid CHAR(36) NOT NULL UNIQUE,
    transaction_type ENUM('deposit', 'withdrawal', 'reward_payout', 'refund', 'fee', 'bonus') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    balance_after DECIMAL(12,2) NOT NULL,
    payment_method ENUM('upi', 'bank_transfer', 'credit_card', 'debit_card', 'net_banking', 'wallet') NULL,
    payment_gateway VARCHAR(100) NULL,
    gateway_transaction_id VARCHAR(255) NULL,
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
    failure_reason TEXT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_id) REFERENCES user_wallets(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_wallet_id (wallet_id),
    INDEX idx_transaction_uuid (transaction_uuid),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 6. CONTENT MANAGEMENT TABLES
-- =====================================================

-- Content pages table
CREATE TABLE content_pages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    page_slug VARCHAR(100) NOT NULL UNIQUE,
    page_title VARCHAR(255) NOT NULL,
    page_type ENUM('rewards', 'faqs', 'terms', 'privacy', 'about', 'help') NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    hero_title VARCHAR(255),
    hero_subtitle TEXT,
    hero_image_url VARCHAR(500),
    content JSON,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_page_slug (page_slug),
    INDEX idx_page_type (page_type),
    INDEX idx_is_published (is_published)
);

-- FAQ table
CREATE TABLE faqs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags JSON,
    is_published BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    view_count INT UNSIGNED DEFAULT 0,
    helpful_count INT UNSIGNED DEFAULT 0,
    not_helpful_count INT UNSIGNED DEFAULT 0,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_category (category),
    INDEX idx_is_published (is_published),
    INDEX idx_sort_order (sort_order)
);

-- =====================================================
-- 7. ADMIN & SYSTEM TABLES
-- =====================================================

-- Admin users table
CREATE TABLE admin_users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    admin_role ENUM('super_admin', 'admin', 'moderator', 'support') NOT NULL,
    permissions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_admin_role (admin_role),
    INDEX idx_is_active (is_active)
);

-- System settings table
CREATE TABLE system_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json', 'file') DEFAULT 'string',
    category VARCHAR(100) DEFAULT 'general',
    description TEXT,
    is_editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key),
    INDEX idx_category (category)
);

-- System logs table
CREATE TABLE system_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    log_level ENUM('debug', 'info', 'warning', 'error', 'critical') NOT NULL,
    log_category VARCHAR(100) NOT NULL,
    log_message TEXT NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    session_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_log_level (log_level),
    INDEX idx_log_category (log_category),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 8. ANALYTICS & REPORTING TABLES
-- =====================================================

-- User analytics table
CREATE TABLE user_analytics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    date DATE NOT NULL,
    total_playtime_minutes INT UNSIGNED DEFAULT 0,
    total_sessions INT UNSIGNED DEFAULT 0,
    total_tracks_played INT UNSIGNED DEFAULT 0,
    points_earned INT UNSIGNED DEFAULT 0,
    inr_earned DECIMAL(10,2) DEFAULT 0.00,
    session_duration_avg DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_date (user_id, date),
    INDEX idx_user_id (user_id),
    INDEX idx_date (date)
);

-- Platform analytics table
CREATE TABLE platform_analytics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    total_active_users INT UNSIGNED DEFAULT 0,
    total_sessions INT UNSIGNED DEFAULT 0,
    total_playtime_hours DECIMAL(10,2) DEFAULT 0.00,
    total_points_distributed INT UNSIGNED DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0.00,
    new_user_registrations INT UNSIGNED DEFAULT 0,
    premium_conversions INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_date (date)
);

-- =====================================================
-- 9. REFERRAL & INVITATION SYSTEM
-- =====================================================

-- Referral codes table
CREATE TABLE referral_codes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    referral_code VARCHAR(20) NOT NULL UNIQUE,
    max_uses INT UNSIGNED DEFAULT 10,
    current_uses INT UNSIGNED DEFAULT 0,
    bonus_points INT UNSIGNED DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_referral_code (referral_code),
    INDEX idx_user_id (user_id),
    INDEX idx_is_active (is_active)
);

-- Referral usage table
CREATE TABLE referral_usage (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    referral_code_id BIGINT UNSIGNED NOT NULL,
    referrer_id BIGINT UNSIGNED NOT NULL,
    referred_user_id BIGINT UNSIGNED NOT NULL,
    bonus_points_awarded INT UNSIGNED DEFAULT 0,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (referral_code_id) REFERENCES referral_codes(id) ON DELETE CASCADE,
    FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_referral_code_id (referral_code_id),
    INDEX idx_referrer_id (referrer_id),
    INDEX idx_referred_user_id (referred_user_id)
);

-- =====================================================
-- 10. NOTIFICATIONS & COMMUNICATIONS
-- =====================================================

-- User notifications table
CREATE TABLE user_notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    notification_type ENUM('email', 'sms', 'push', 'in_app') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    action_url VARCHAR(500),
    metadata JSON,
    scheduled_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_notification_type (notification_type),
    INDEX idx_is_read (is_read),
    INDEX idx_scheduled_at (scheduled_at)
);

-- =====================================================
-- 11. SECURITY & AUDIT TABLES
-- =====================================================

-- User login history table
CREATE TABLE user_login_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    login_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    device_type ENUM('desktop', 'mobile', 'tablet', 'unknown') DEFAULT 'unknown',
    browser VARCHAR(100),
    os VARCHAR(100),
    country VARCHAR(100),
    city VARCHAR(100),
    is_successful BOOLEAN DEFAULT TRUE,
    failure_reason TEXT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_login_timestamp (login_timestamp),
    INDEX idx_ip_address (ip_address),
    INDEX idx_is_successful (is_successful)
);

-- API access logs table
CREATE TABLE api_access_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    request_ip VARCHAR(45) NOT NULL,
    user_agent TEXT,
    request_headers JSON,
    request_body JSON,
    response_status INT NOT NULL,
    response_time_ms INT UNSIGNED DEFAULT 0,
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_user_id (user_id),
    INDEX idx_endpoint (endpoint),
    INDEX idx_method (method),
    INDEX idx_response_status (response_status),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 12. INITIAL DATA INSERTION
-- =====================================================

-- Insert default playtime thresholds
INSERT INTO playtime_thresholds (threshold_minutes, points_reward, threshold_name, is_premium_only) VALUES
(100, 50, 'Bronze Listener', FALSE),
(500, 300, 'Silver Listener', FALSE),
(1000, 750, 'Gold Listener', FALSE),
(5000, 5000, 'Platinum Listener', TRUE),
(10000, 15000, 'Diamond Listener', TRUE);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description) VALUES
('app_name', 'Spotify Bot Admin', 'string', 'general', 'Application name'),
('app_version', '1.0.0', 'string', 'general', 'Application version'),
('maintenance_mode', 'false', 'boolean', 'system', 'Maintenance mode flag'),
('max_daily_sessions', '10', 'number', 'bot', 'Maximum daily bot sessions per user'),
('points_per_minute', '1.0', 'number', 'rewards', 'Base points earned per minute of listening'),
('kyc_required', 'true', 'boolean', 'security', 'KYC verification required for withdrawals'),
('min_withdrawal_amount', '100.00', 'number', 'financial', 'Minimum withdrawal amount in INR'),
('support_email', 'support@spotifybot.com', 'string', 'support', 'Support email address');

-- =====================================================
-- 13. VIEWS FOR COMMON QUERIES
-- =====================================================

-- User dashboard view
CREATE VIEW user_dashboard_view AS
SELECT 
    u.id,
    u.user_uuid,
    u.email,
    u.first_name,
    u.last_name,
    u.is_premium,
    u.is_verified,
    up.points_balance,
    uw.inr_balance,
    uk.kyc_status,
    COUNT(ls.id) as total_sessions,
    SUM(ls.duration_minutes) as total_playtime_minutes,
    u.last_login_at,
    u.created_at
FROM users u
LEFT JOIN user_points up ON u.id = up.user_id
LEFT JOIN user_wallets uw ON u.id = uw.user_id
LEFT JOIN user_kyc uk ON u.id = uk.user_id
LEFT JOIN listening_sessions ls ON u.id = ls.user_id
GROUP BY u.id;

-- Admin dashboard view
CREATE VIEW admin_dashboard_view AS
SELECT 
    COUNT(DISTINCT u.id) as total_users,
    COUNT(CASE WHEN u.is_premium = TRUE THEN 1 END) as premium_users,
    COUNT(CASE WHEN uk.kyc_status = 'pending' THEN 1 END) as pending_kyc,
    COUNT(CASE WHEN uk.kyc_status = 'approved' THEN 1 END) as approved_kyc,
    COUNT(CASE WHEN uk.kyc_status = 'rejected' THEN 1 END) as rejected_kyc,
    SUM(ls.duration_minutes) as total_playtime_minutes,
    SUM(up.points_balance) as total_points_distributed,
    SUM(uw.inr_balance) as total_wallet_balance,
    COUNT(CASE WHEN ls.is_bot_session = TRUE THEN 1 END) as total_bot_sessions
FROM users u
LEFT JOIN user_kyc uk ON u.id = uk.user_id
LEFT JOIN listening_sessions ls ON u.id = ls.user_id
LEFT JOIN user_points up ON u.id = up.user_id
LEFT JOIN user_wallets uw ON u.id = uw.user_id;

-- =====================================================
-- 14. PERFORMANCE INDEXES
-- =====================================================

-- Additional performance indexes
CREATE INDEX idx_listening_sessions_user_date ON listening_sessions(user_id, start_time);
CREATE INDEX idx_points_transactions_user_date ON points_transactions(user_id, created_at);
CREATE INDEX idx_financial_transactions_user_date ON financial_transactions(user_id, created_at);
CREATE INDEX idx_track_history_session_track ON track_listening_history(session_id, spotify_track_id);
CREATE INDEX idx_bot_logs_session_action ON bot_session_logs(session_id, action_type);
CREATE INDEX idx_user_notifications_user_read ON user_notifications(user_id, is_read);
CREATE INDEX idx_system_logs_level_category ON system_logs(log_level, log_category);

-- =====================================================
-- 15. COMMENTS AND DOCUMENTATION
-- =====================================================

/*
SPOTIFY BOT ADMIN SYSTEM DATABASE SCHEMA
========================================

This database schema provides a comprehensive foundation for a professional
Spotify bot admin system with the following key features:

1. USER MANAGEMENT
   - Complete user profiles with KYC verification
   - Address management
   - Admin user roles and permissions

2. SPOTIFY INTEGRATION
   - Spotify account connections
   - Listening session tracking
   - Track history management

3. BOT SYSTEM
   - Configurable bot behaviors
   - Session management
   - Bot activity logging

4. REWARDS SYSTEM
   - Points-based rewards
   - Playtime thresholds
   - Referral bonuses

5. FINANCIAL SYSTEM
   - Wallet management
   - Transaction tracking
   - Payment processing

6. CONTENT MANAGEMENT
   - Dynamic content pages
   - FAQ management
   - SEO optimization

7. ANALYTICS & REPORTING
   - User analytics
   - Platform metrics
   - Performance tracking

8. SECURITY & AUDIT
   - Login history
   - API access logs
   - System monitoring

DESIGN PRINCIPLES:
- Normalized database design
- Proper foreign key relationships
- Comprehensive indexing strategy
- Audit trail maintenance
- Scalable architecture
- Security best practices

TECHNICAL FEATURES:
- UTF8MB4 character set for full Unicode support
- InnoDB storage engine for ACID compliance
- Proper data types and constraints
- Efficient indexing strategy
- Views for common query patterns

This schema is designed to handle enterprise-level workloads with proper
performance optimization and data integrity guarantees.
*/
