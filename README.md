# Spotify Bot Ops Dashboard

A comprehensive admin dashboard for managing Spotify bot operations, user accounts, playlists, and analytics.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Spotify Developer account

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd spotify-bot-ops
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure Supabase:
   - Create a new project in Supabase
   - Copy your project URL and anon key to the `.env` file

5. Configure Spotify OAuth:
   - Create a new app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Add redirect URIs for both development and production:
     - Development: `http://localhost:8080/dashboard` and `http://localhost:8080/playlists`
     - Production: `https://your-vercel-domain.vercel.app/dashboard` and `https://your-vercel-domain.vercel.app/playlists`

6. Set up Supabase Authentication:
   - In your Supabase project, go to Authentication > Providers
   - Enable Spotify and configure with your Spotify app credentials
   - Add the same redirect URIs as configured in Spotify Developer Dashboard

## Running the Application

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## Deployment to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon key
4. Set up redirect URLs in Supabase Authentication providers to match your Vercel domain
5. Deploy!

The `vercel.json` file is already included in the project to handle SPA routing and prevent 404 errors on page reloads.

## Troubleshooting

### Spotify OAuth 404 Error
If you encounter a 404 error during Spotify authentication:
1. Ensure your redirect URIs are correctly configured in both:
   - Spotify Developer Dashboard
   - Supabase Authentication Providers
2. Make sure the Vercel domain matches the redirect URIs exactly
3. Check that environment variables are properly set in Vercel dashboard

### 404 Error on Page Reload
If you encounter 404 errors when reloading pages or navigating directly to routes:
1. The `vercel.json` file should handle this automatically
2. Ensure the file is included in your deployment
3. Check that Vercel is correctly configured to serve the SPA

### Common Issues
- Ensure all redirect URIs are HTTPS in production
- Verify that Spotify app credentials match those in Supabase
- Check that the correct scopes are configured for Spotify OAuth