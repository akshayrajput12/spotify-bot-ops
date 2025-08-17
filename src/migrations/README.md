# Database Migrations

This directory contains database migration files for the Spotify Playtime Enhancer Admin Panel.

## Migration Structure

Each migration file follows the naming convention: `YYYYMMDD_HHmmss_description.sql`

## How to Run Migrations

1. **Development Environment:**
   ```bash
   npm run migrate:dev
   ```

2. **Production Environment:**
   ```bash
   npm run migrate:prod
   ```

3. **Rollback Last Migration:**
   ```bash
   npm run migrate:rollback
   ```

## Migration Files

- `001_initial_schema.sql` - Creates initial database schema
- `002_create_users_table.sql` - User management tables
- `003_create_transactions_table.sql` - Transaction and wallet tables
- `004_create_bot_settings_table.sql` - Bot configuration tables
- `005_create_rewards_table.sql` - Reward system tables
- `006_create_analytics_table.sql` - Analytics and logging tables
- `007_create_cms_table.sql` - Content management tables
- `008_create_admin_tables.sql` - Admin user management

## Database Schema Overview

### Core Tables:
- `users` - User accounts and profiles
- `user_kyc` - KYC verification data
- `wallets` - User wallet balances
- `transactions` - Financial transactions
- `bot_settings` - Bot configuration
- `reward_settings` - Reward system configuration
- `analytics_events` - User activity tracking
- `cms_content` - Content management
- `admin_users` - Admin panel users
- `audit_logs` - System audit trail

## Important Notes

- Always backup your database before running migrations
- Test migrations in development environment first
- Migration files should never be modified once they are deployed
- Use descriptive names for migration files
- Include both UP and DOWN migration scripts