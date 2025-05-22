/**
 * Type declarations for environment variables
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Oracle Database configuration
      ORACLE_USER: string;
      ORACLE_PASSWORD: string;
      ORACLE_CONNECT_STRING: string;
      NODE_ORACLEDB_DRIVER_MODE?: 'thin' | 'thick';
      
      // Next.js environment
      NODE_ENV: 'development' | 'production' | 'test';
      
      // Add other environment variables as needed
    }
  }
}

// This export is needed to make this file a module
export {};