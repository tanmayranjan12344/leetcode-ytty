// clean.next.config.js - Absolute minimal config for Oracle DB with Turbopack
// @ts-nocheck

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Only use serverExternalPackages for oracledb with Turbopack
  // This is the ONLY configuration needed to fix the conflict
  serverExternalPackages: ['oracledb'],
  
  // Webpack configuration for fallback (non-Turbopack) builds
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Add oracledb and problematic packages to externals
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        'oracledb',
        '@azure/app-configuration',
        '@azure/identity',
        'oci-secrets',
        'oci-common',
        'oci-objectstorage',
        'aws-sdk',
        'google-auth-library',
        '@google-cloud/secret-manager'
      ];
    }
    return config;
  },
};

module.exports = nextConfig;