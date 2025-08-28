# User Dashboard Documentation

## Overview
The User Dashboard is a comprehensive interface for regular users (non-admins) to manage their Spotify-related activities, KYC verification, rewards, and account settings. It features a responsive sidebar layout with multiple tabs for different functionalities, styled with Spotify's dark theme and green accents.

## Features

### 1. Dashboard Overview
- Displays key metrics including total points, listening time, KYC status, and document count
- Quick actions to complete KYC verification or view rewards
- Recent activity feed showing document upload history
- Spotify-themed dark UI with green accents

### 2. KYC Verification
- Document upload functionality for identity verification
- **Restricted to only two document types**:
  - Aadhaar Card
  - PAN Card
- Once a document is approved, no further uploads of the same type are allowed
- Real-time status tracking for uploaded documents
- Rejection feedback with specific reasons
- Refresh functionality to check document status updates

### 3. Rewards System
- Points tracking dashboard showing total earned points
- Explanation of how the rewards system works
- Visual guide on earning and redeeming points
- Future redemption options (coming soon)

### 4. Listening History
- Placeholder for future listening session tracking
- Will display user's Spotify play history through the bot

### 5. Profile Management
- User profile information display
- Spotify connection status
- Avatar display (using DiceBear avatars)

### 6. Account Settings
- Password change functionality
- Notification preferences
- Theme settings (dark mode)

## Authentication Flow

### Spotify Users
1. User authenticates with Spotify via OAuth
2. Automatically redirected to `/set-password` page
3. User creates a password for future email/password authentication
4. After setting password, user is redirected to `/user/dashboard`

### Regular Users
1. User signs in with email and password
2. If user has role "user", they are redirected to `/user/dashboard`
3. If user has role "admin", they are redirected to `/dashboard`

## Technical Implementation

### Components
- **Sidebar Navigation**: Responsive sidebar with collapsible mobile view, styled with Spotify's dark theme
- **Tab System**: Organized content sections using tabbed interface
- **Protected Routes**: Role-based access control ensuring only authenticated users can access the dashboard
- **Real-time Data**: Fetching user data and document status from Supabase database

### Key Files
- `src/pages/UserDashboard.tsx`: Main dashboard component
- `src/pages/SetPassword.tsx`: Password setup page for Spotify users
- `src/pages/Auth.tsx`: Authentication page with Spotify OAuth integration
- `src/components/auth/ProtectedRoute.tsx`: Route protection component
- `src/hooks/useAuth.tsx`: Authentication context and hooks

### Database Integration
- **KYC Documents**: Stored in `kyc_documents` table with status tracking
- **User Rewards**: Points and listening time tracked in `user_rewards` table
- **File Storage**: Documents stored in Supabase storage bucket `kyc-documents`
- **User Profiles**: Managed through `profiles` and `user_roles` tables
- **Document Types**: The database schema has been updated to support 'aadhaar' and 'pan' document types in addition to the existing types

### Security Features
- Row Level Security (RLS) policies ensuring users can only access their own data
- Protected routes preventing unauthorized access
- Secure file upload with user-specific folder structure
- Password requirements validation for enhanced security
- Document type restriction preventing multiple uploads of approved documents

## Responsive Design
- Mobile-friendly sidebar that collapses on smaller screens
- Adaptive grid layouts for dashboard cards
- Touch-friendly navigation elements
- Responsive form layouts for document uploads

## UI/UX Enhancements
- **Spotify-themed dark UI**: Black background with gray cards and green accents
- **Consistent color scheme**: Green buttons for primary actions, appropriate status colors
- **Improved typography**: Clear hierarchy with proper text colors for readability
- **Visual feedback**: Loading states, success/error messages, and validation indicators

## Document Upload Restrictions
- Only Aadhaar Card and PAN Card documents are allowed
- Users cannot upload additional documents of the same type once approved
- Clear messaging when upload is blocked due to existing approved documents
- File type validation for images and PDFs

## Database Schema Updates
A new migration has been added to extend the `document_type` ENUM to include:
- `aadhaar` - Aadhaar Card
- `pan` - PAN Card

This maintains backward compatibility with existing document types while adding the required types for the user dashboard.

## Future Enhancements
- Listening history integration with Spotify API
- Advanced reward redemption options
- Notification system for document status updates
- Enhanced profile customization options
- Full dark mode theme implementation across all components