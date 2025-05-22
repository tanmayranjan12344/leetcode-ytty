// next.config.js for Next.js 15 with Oracle DB and Turbopack support
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

module.exports = nextConfig;