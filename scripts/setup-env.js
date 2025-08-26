#!/usr/bin/env node

// Simple script to help with environment setup
const fs = require('fs');
const path = require('path');

console.log('Spotify Bot Ops Environment Setup Helper');
console.log('========================================');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('Creating .env file from .env.example...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✓ .env file created');
} else {
  console.log('✓ .env file already exists');
}

console.log('\nNext steps:');
console.log('1. Edit the .env file and add your Supabase credentials');
console.log('2. For Vercel deployment, add these environment variables in your Vercel project settings:');
console.log('   - VITE_SUPABASE_URL');
console.log('   - VITE_SUPABASE_PUBLISHABLE_KEY');
console.log('   - VITE_VERCEL_DOMAIN (your Vercel deployment URL)');
console.log('   - VITE_VERCEL=true');
console.log('\n3. Make sure to configure redirect URIs in both:');
console.log('   - Spotify Developer Dashboard');
console.log('   - Supabase Authentication Providers');