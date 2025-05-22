// next.config.js - Final fix for Turbopack with Oracle DB
// @ts-nocheck

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Webpack configuration for non-Turbopack builds
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
        'oracledb' // Add oracledb as external
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
  
  // IMPORTANT: Do NOT use transpilePackages with oracledb when using Turbopack
  // This line should be REMOVED or commented out to avoid the conflict
  // transpilePackages: ['oracledb'], // <- REMOVE THIS LINE
  
  // Use serverExternalPackages for oracledb (works with Turbopack)
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
  
  // Experimental features for Next.js 15
  experimental: {
    // Other experimental features if needed
  },
};

module.exports = nextConfig;