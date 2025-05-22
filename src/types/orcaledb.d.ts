declare module 'oracledb' {
  // Constants
  export const OUT_FORMAT_OBJECT: number;
  export const BIND_OUT: number;
  export const NUMBER: number;

  // Interfaces
  export interface PoolAttributes {
    user?: string;
    password?: string;
    connectString?: string;
    poolMin?: number;
    poolMax?: number;
    poolIncrement?: number;
    poolTimeout?: number;
    stmtCacheSize?: number;
    // Add other attributes as needed
  }

  export interface ExecuteOptions {
    outFormat?: number;
    autoCommit?: boolean;
    maxRows?: number;
    fetchArraySize?: number;
    // Add other options as needed
  }

  export interface Result<T = any> {
    rows: T[];
    metaData?: Array<{ name: string }>;
    rowsAffected?: number;
    outBinds?: any;
  }

  export interface Connection {
    execute<T = any>(
      sql: string,
      bindParams?: any,
      options?: ExecuteOptions
    ): Promise<Result<T>>;
    close(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    // Add other methods as needed
  }

  export interface Pool {
    getConnection(): Promise<Connection>;
    close(drainTime?: number): Promise<void>;
    // Add other methods as needed
  }

  // Functions
  export function createPool(attributes: PoolAttributes): Promise<Pool>;
  export function getPool(poolAlias?: string): Pool;
  export function initOracleClient(options?: { libDir?: string }): void;

  // Add other functions as needed
}