// next.config.ts for Next.js 15 with Oracle DB and Turbopack support

import type { NextConfig } from 'next';

// Define types for webpack config context
type WebpackConfigContext = {
  isServer: boolean;
  dev: boolean;
  [key: string]: any;
};

// Define a function for webpack configuration to avoid TypeScript errors
function configureWebpack(config: any, { isServer }: WebpackConfigContext): any {
  if (isServer) {
    // Tell webpack to not bundle these packages
    const externals = Array.isArray(config.externals) 
      ? config.externals 
      : (config.externals ? [config.externals] : []);
    
    // Add all problematic packages to externals
    externals.push(
      '@azure/app-configuration',
      '@azure/identity',
      'oci-secrets',
      'oci-common',
      'oci-objectstorage',
      'aws-sdk',
      'google-auth-library',
      '@google-cloud/secret-manager',
      'oracledb' // Add oracledb as external
    );
    
    config.externals = externals;
    
    // Backup approach using resolve.alias
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    
    // Set aliases to false for problematic packages
    const problematicPackages = [
      '@azure/app-configuration',
      '@azure/identity',
      'oci-secrets',
      'oci-common',
      'oci-objectstorage',
      'aws-sdk',
      'google-auth-library',
      '@google-cloud/secret-manager'
    ];
    
    problematicPackages.forEach(pkg => {
      config.resolve.alias[pkg] = false;
    });
  }
  
  return config;
}

// Next.js configuration
const nextConfig: NextConfig = {
  // Webpack configuration for non-Turbopack builds
  webpack: configureWebpack,
  
  // Use serverExternalPackages for oracledb (works with Turbopack)
  // DO NOT use transpilePackages at the same time as it will cause conflicts
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
  
  // Other experimental features if needed
  experimental: {
    // Turbopack configuration if needed
    turbo: {
      // Any specific Turbopack configuration can go here
    },
  },
};

export default nextConfig;