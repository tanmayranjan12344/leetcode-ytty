// utils/oracledb.ts - Updated to fix NJS-138 error
import * as oracledb from 'oracledb';

// Initialize Oracle client with Thick mode for better compatibility
function initializeOracleClient() {
  try {
    // Check if we're on the server side
    if (typeof window !== 'undefined') {
      return;
    }

    // Initialize Oracle client in Thick mode for better database version support
    if (typeof oracledb.initOracleClient === 'function') {
      try {
        // Try to initialize with Thick mode
        oracledb.initOracleClient({
          // Uncomment and set the path if Oracle Instant Client is installed
          // libDir: '/opt/oracle/instantclient'
        });
        console.log('Oracle client initialized in Thick mode');
      } catch (err) {
        console.warn('Oracle client Thick mode initialization failed, using Thin mode:', err);
      }
    }
  } catch (err) {
    console.warn('Oracle client initialization warning:', err);
  }
}

// Call initialization immediately
initializeOracleClient();

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

// Get Oracle connection configuration
function getDbConfig() {
  validateEnvVars();
  
  return {
    user: process.env.ORACLE_USER!,
    password: process.env.ORACLE_PASSWORD!,
    connectString: process.env.ORACLE_CONNECTION_STRING!,
    // Connection pool configuration
    poolMin: 1,
    poolMax: 4,
    poolIncrement: 1,
    poolTimeout: 60,
    // Enhanced compatibility settings
    edition: '',
    events: false,
    externalAuth: false,
    homogeneous: true,
    poolPingInterval: 60,
    stmtCacheSize: 30
  };
}

// Connection pool singleton
let pool: oracledb.Pool | null = null;

/**
 * Initialize the Oracle connection pool
 */
export async function initialize(): Promise<void> {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations can only be performed on the server side');
  }
  
  if (!pool) {
    try {
      const dbConfig = getDbConfig();
      
      console.log('Connecting to Oracle DB:', {
        user: dbConfig.user,
        connectString: dbConfig.connectString,
        poolMin: dbConfig.poolMin,
        poolMax: dbConfig.poolMax,
      });
      
      pool = await oracledb.createPool(dbConfig);
      console.log('Oracle connection pool created successfully');
      
      // Test the connection
      await testConnection();
      
    } catch (err) {
      console.error('Error creating Oracle connection pool:', err);
      
      if (err instanceof Error && err.message.includes('NJS-138')) {
        console.error('\n🔧 ORACLE VERSION COMPATIBILITY ISSUE:');
        console.error('Your Oracle database version is not supported in Thin mode.');
        console.error('Solutions:');
        console.error('1. Install Oracle Instant Client for Thick mode support');
        console.error('2. Use a newer Oracle database version');
        console.error('3. Check your connection string format');
      }
      
      throw err;
    }
  }
}

/**
 * Test the Oracle connection
 */
async function testConnection(): Promise<void> {
  let connection: oracledb.Connection | undefined;
  
  try {
    if (!pool) {
      throw new Error('Connection pool not initialized');
    }
    
    connection = await pool.getConnection();
    const result = await connection.execute('SELECT 1 FROM DUAL');
    console.log('✅ Oracle connection test successful');
    
  } catch (err) {
    console.error('Oracle connection test failed:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing test connection:', err);
      }
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
    if (!pool) {
      await initialize();
    }
    
    connection = await pool!.getConnection();
    
    const defaultOptions: oracledb.ExecuteOptions = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true
    };
    
    const result = await connection.execute(sql, binds, { ...defaultOptions, ...options });
    
    return result.rows as T[];
  } catch (err) {
    console.error('Error executing Oracle query:', err);
    
    if (err instanceof Error) {
      if (err.message.includes('NJS-138')) {
        console.error('💡 Try installing Oracle Instant Client for better database version support');
      } else if (err.message.includes('ORA-')) {
        console.error('💡 This appears to be an Oracle database error - check your SQL and database state');
      }
    }
    
    throw err;
  } finally {
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