// utils/oracledb.ts - Fixed with environment variable validation
import * as oracledb from 'oracledb';

// Safe initialization function
function safeInitOracleClient(options?: { libDir?: string }) {
  try {
    if (options && options.libDir && typeof oracledb.initOracleClient === 'function') {
      // Only call if libDir is specified
      return oracledb.initOracleClient(options);
    }
    // Otherwise do nothing
    return;
  } catch (err) {
    console.warn('Oracle client initialization skipped or failed:', err);
  }
}

// Validate environment variables
function validateEnvVars() {
  const requiredVars = [
    'ORACLE_USER',
    'ORACLE_PASSWORD',
    'ORACLE_CONNECTION_STRING'
  ];
  
  const missingVars = requiredVars.filter(varName => {
    const value = process.env[varName];
    return value === undefined || value === '';
  });
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Current environment variables:');
    console.error(`ORACLE_USER: ${process.env.ORACLE_USER ? '✓ Set' : '✗ Missing'}`);
    console.error(`ORACLE_PASSWORD: ${process.env.ORACLE_PASSWORD ? '✓ Set' : '✗ Missing'}`);
    console.error(`ORACLE_CONNECTION_STRING: ${process.env.ORACLE_CONNECTION_STRING ? '✓ Set' : '✗ Missing'}`);
    
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

// Get Oracle connection configuration with fallback values
function getDbConfig() {
  // Validate environment variables first
  validateEnvVars();
  
  // Return the configuration
  return {
    user: process.env.ORACLE_USER!,
    password: process.env.ORACLE_PASSWORD!,
    connectString: process.env.ORACLE_CONNECTION_STRING!,
    // Connection pool configuration
    poolMin: 2,
    poolMax: 5,
    poolIncrement: 1
  };
}

// Connection pool singleton
let pool: oracledb.Pool | null = null;

/**
 * Initialize the Oracle connection pool (if not already initialized)
 */
export async function initialize(): Promise<void> {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations can only be performed on the server side');
  }
  
  if (!pool) {
    try {
      // Safely initialize Oracle client if needed
      safeInitOracleClient();
      
      // Get validated database configuration
      const dbConfig = getDbConfig();
      
      console.log('Connecting to Oracle DB with config:', {
        user: dbConfig.user,
        connectString: dbConfig.connectString,
        // Don't log the password for security reasons
        poolMin: dbConfig.poolMin,
        poolMax: dbConfig.poolMax,
      });
      
      // Create a connection pool
      pool = await oracledb.createPool(dbConfig);
      console.log('Oracle connection pool created successfully');
    } catch (err) {
      console.error('Error creating Oracle connection pool:', err);
      throw err;
    }
  }
}

/**
 * Close the Oracle connection pool
 */
export async function closePool(): Promise<void> {
  try {
    if (pool) {
      await pool.close(0);
      pool = null;
      console.log('Oracle connection pool closed');
    }
  } catch (err) {
    console.error('Error closing Oracle connection pool:', err);
    throw err;
  }
}

/**
 * Execute a SQL statement with parameters
 */
export async function execute<T = any>(
  sql: string,
  binds: any = {},
  options: oracledb.ExecuteOptions = {}
): Promise<T[]> {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations can only be performed on the server side');
  }

  let connection: oracledb.Connection | undefined;
  
  try {
    // Initialize pool if not already initialized
    if (!pool) {
      await initialize();
    }
    
    // Get a connection from the pool
    connection = await pool!.getConnection();
    
    // Set default options
    const defaultOptions: oracledb.ExecuteOptions = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true
    };
    
    // Execute the query
    const result = await connection.execute(sql, binds, { ...defaultOptions, ...options });
    
    return result.rows as T[];
  } catch (err) {
    console.error('Error executing Oracle query:', err);
    throw err;
  } finally {
    // Release the connection back to the pool
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing Oracle connection:', err);
      }
    }
  }
}

/**
 * Get a single row from a query result
 */
export async function getRow<T = any>(
  sql: string,
  binds: any = {},
  options: oracledb.ExecuteOptions = {}
): Promise<T | null> {
  const rows = await execute<T>(sql, binds, options);
  return rows.length > 0 ? rows[0] : null;
}

// Export the oracledb module for advanced use cases
export { oracledb };