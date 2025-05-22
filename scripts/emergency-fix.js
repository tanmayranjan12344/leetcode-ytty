#!/usr/bin/env node
/**
 * Emergency Fix for Turbopack Oracle DB Conflict
 * 
 * This script will forcefully fix the transpilePackages vs serverExternalPackages conflict
 */

const fs = require('fs');
const path = require('path');

console.log('🚨 EMERGENCY FIX: Resolving Turbopack conflict...');

// Path to next.config.js
const configPath = path.join(process.cwd(), 'next.config.js');

// Check if next.config.js exists
if (!fs.existsSync(configPath)) {
  console.error('❌ next.config.js not found!');
  process.exit(1);
}

// Read the current config
const currentConfig = fs.readFileSync(configPath, 'utf8');
console.log('📄 Current next.config.js content:');
console.log('='.repeat(50));
console.log(currentConfig);
console.log('='.repeat(50));

// Check if transpilePackages exists
if (currentConfig.includes('transpilePackages')) {
  console.log('⚠️ Found transpilePackages in config - this is causing the conflict!');
} else {
  console.log('✅ transpilePackages not found in current config');
}

// Create a completely new, clean config that definitely won't have conflicts
const cleanConfig = `// next.config.js - Emergency fix for Turbopack Oracle DB conflict
// @ts-nocheck

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Webpack configuration for non-Turbopack builds only
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Tell webpack to not bundle these packages
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        '@azure/app-configuration',
        '@azure/identity',
        'oci-secrets',
        'oci-common',
        'oci-objectstorage',
        'aws-sdk',
        'google-auth-library',
        '@google-cloud/secret-manager',
        'oracledb'
      ];
      
      // Backup approach using resolve.alias
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};
      
      config.resolve.alias['@azure/app-configuration'] = false;
      config.resolve.alias['@azure/identity'] = false;
      config.resolve.alias['oci-secrets'] = false;
      config.resolve.alias['oci-common'] = false;
      config.resolve.alias['oci-objectstorage'] = false;
      config.resolve.alias['aws-sdk'] = false;
      config.resolve.alias['google-auth-library'] = false;
      config.resolve.alias['@google-cloud/secret-manager'] = false;
    }
    
    return config;
  },
  
  // CRITICAL: Only use serverExternalPackages for oracledb with Turbopack
  // DO NOT add transpilePackages here - it will cause conflicts
  serverExternalPackages: ['oracledb'],
  
  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
`;

// Backup the current config
const backupPath = path.join(process.cwd(), 'next.config.js.backup.' + Date.now());
fs.writeFileSync(backupPath, currentConfig, 'utf8');
console.log(`💾 Backed up current config to: ${backupPath}`);

// Write the clean config
fs.writeFileSync(configPath, cleanConfig, 'utf8');
console.log('✅ Wrote clean next.config.js');

// Verify the new config doesn't contain transpilePackages
const newConfig = fs.readFileSync(configPath, 'utf8');
if (newConfig.includes('transpilePackages')) {
  console.error('❌ ERROR: New config still contains transpilePackages!');
  process.exit(1);
} else {
  console.log('✅ Verified: New config does NOT contain transpilePackages');
}

console.log('\n📄 New next.config.js content:');
console.log('='.repeat(50));
console.log(newConfig);
console.log('='.repeat(50));

console.log('\n🎉 EMERGENCY FIX COMPLETE!');
console.log('\n📝 What was fixed:');
console.log('- Completely rewrote next.config.js to remove ALL transpilePackages references');
console.log('- Kept only serverExternalPackages for oracledb');
console.log('- Preserved webpack configuration for non-Turbopack builds');

console.log('\n🚀 IMMEDIATE NEXT STEPS:');
console.log('1. Kill your current development server (Ctrl+C)');
console.log('2. Start it again: npm run dev');
console.log('3. The Turbopack conflict should now be completely resolved');