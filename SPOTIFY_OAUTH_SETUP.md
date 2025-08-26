# Spotify OAuth Setup Guide

This guide will help you configure Spotify OAuth for the Spotify Bot Ops Dashboard.

## Prerequisites

1. A Spotify Developer account (https://developer.spotify.com/dashboard)
2. A Supabase project
3. A deployed instance (Vercel, Netlify, etc.) or local development environment

## Step 1: Create a Spotify App

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create an App"
3. Fill in the app name and description
4. Accept the terms and click "Create"

## Step 2: Configure Redirect URIs

In your Spotify app settings, add the following redirect URIs:

### For Local Development
- `http://localhost:8080/dashboard`
- `http://localhost:8080/playlists`

### For Production Deployment (Vercel)
- `https://your-vercel-domain.vercel.app/dashboard`
- `https://your-vercel-domain.vercel.app/playlists`

**Important:** Replace `your-vercel-domain.vercel.app` with your actual Vercel domain.

## Step 3: Get Client Credentials

From your Spotify app dashboard:
1. Click "Settings"
2. Note down the "Client ID" and "Client Secret"
3. You'll need these for Supabase configuration

## Step 4: Configure Supabase Authentication

1. In your Supabase project dashboard, go to "Authentication" > "Providers"
2. Find "Spotify" and click "Edit"
3. Enable the provider
4. Enter your Spotify Client ID
5. Enter your Spotify Client Secret
6. Add the same redirect URIs you configured in Spotify:
   - `http://localhost:8080/dashboard`
   - `http://localhost:8080/playlists`
   - `https://your-vercel-domain.vercel.app/dashboard`
   - `https://your-vercel-domain.vercel.app/playlists`

## Step 5: Update Environment Variables

In your deployment platform (Vercel), set the following environment variables:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

## Step 6: Update Code for Production

In the following files, replace `your-vercel-domain.vercel.app` with your actual Vercel domain:

1. `src/pages/Auth.tsx` - Line with redirectTo for production
2. `src/pages/Playlists.tsx` - Line with redirectTo for production

## Troubleshooting

### 404: NOT_FOUND Error

This error typically occurs when:
1. Redirect URIs don't match exactly between Spotify and Supabase
2. The domain in your code doesn't match your actual deployment domain
3. HTTPS is not used in production

### Common Fixes

1. **Double-check redirect URIs**: Ensure they match exactly in both Spotify Dashboard and Supabase
2. **Verify domain names**: Make sure the domain in your code matches your Vercel deployment
3. **Check HTTPS**: Production URLs must use HTTPS
4. **Environment variables**: Ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are correctly set

### Testing OAuth Flow

1. After making changes, redeploy your application
2. Clear browser cache and cookies
3. Try the Spotify login flow again
4. Check browser console for any errors
5. Check Supabase authentication logs for detailed error information

## Required Scopes

The application requires the following Spotify scopes:
- `user-read-email`
- `user-read-private`
- `playlist-read-private`
- `playlist-read-collaborative`
- `user-library-read`
- `user-read-recently-played`

These scopes are already configured in the application code.

## SPA Routing on Vercel

To prevent 404 errors when reloading pages or navigating directly to routes, the project includes a `vercel.json` file with rewrite rules that direct all routes to `index.html`. This allows React Router to handle the routing client-side.

Make sure this file is included in your deployment to avoid 404 errors on page reloads.