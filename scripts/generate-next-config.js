#!/usr/bin/env node
/**
 * Direct Fix for Next.js + Oracle DB
 * 
 * This script directly fixes the Next.js configuration and package.json
 * to work with Oracle DB without TypeScript errors.
 * 
 * It's a simplified version that just does the job without asking questions.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Simple log with emoji
const log = (message, emoji = '🔧') => console.log(`${emoji} ${message}`);

log('Starting direct fix for Next.js + Oracle DB compatibility...', '🚀');

// 1. Fix next.config.js
const configPath = path.join(process.cwd(), 'next.config.js');
const configContent = `// next.config.js - Fixed for Oracle DB
// @ts-nocheck

// Create a function that handles the webpack configuration
// This approach avoids TypeScript errors
function handleWebpack(config, ctx) {
  // Only apply on server
  if (ctx && ctx.isServer) {
    // Handle externals
    const externals = Array.isArray(config.externals) ? 
      config.externals : 
      (config.externals ? [config.externals] : []);
    
    externals.push(
      '@azure/app-configuration',
      '@azure/identity',
      'oci-secrets',
      'oci-common',
      'oci-objectstorage',
      'aws-sdk',
      'google-auth-library',
      '@google-cloud/secret-manager'
    );
    
    config.externals = externals;
    
    // Also set aliases
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    
    const problemPackages = [
      '@azure/app-configuration',
      '@azure/identity',
      'oci-secrets',
      'oci-common',
      'oci-objectstorage',
      'aws-sdk',
      'google-auth-library',
      '@google-cloud/secret-manager'
    ];
    
    problemPackages.forEach(pkg => {
      config.resolve.alias[pkg] = false;
    });
  }
  
  return config;
}

// Next.js configuration
const nextConfig = {
  webpack: handleWebpack,
  transpilePackages: ['oracledb'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['oracledb'],
  },
};

module.exports = nextConfig;
`;

// Write the config file
fs.writeFileSync(configPath, configContent, 'utf8');
log('Fixed next.config.js', '✅');

// 2. Fix package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Ensure oracledb is in dependencies
    if (!packageJson.dependencies?.oracledb) {
      packageJson.dependencies = packageJson.dependencies || {};
      packageJson.dependencies.oracledb = '^6.8.0';
      log('Added oracledb to dependencies', '📦');
    }
    
    // Add overrides
    packageJson.overrides = packageJson.overrides || {};
    packageJson.overrides.oracledb = {
      '@azure/app-configuration': '^1.0.0',
      '@azure/identity': '^1.0.0',
      'oci-secrets': '^1.0.0',
      'oci-common': '^1.0.0',
      'aws-sdk': '^1.0.0',
      'google-auth-library': '^1.0.0',
      '@google-cloud/secret-manager': '^1.0.0'
    };
    
    // Write the updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    log('Updated package.json with overrides', '✅');
  } catch (error) {
    log(`Error updating package.json: ${error.message}`, '❌');
  }
}

// 3. Run npm install
log('Running npm install to update dependencies...', '📦');
try {
  execSync('npm install', { stdio: 'inherit' });
  log('Dependencies updated successfully', '✅');
} catch (error) {
  log('Error updating dependencies. Try running npm install manually.', '❌');
}

log('Fix completed! Your Next.js project should now work with Oracle DB.', '🎉');
log('If you still have issues, try a clean install:', '💡');
log('rm -rf node_modules package-lock.json', '🧹');
log('npm install', '📦');