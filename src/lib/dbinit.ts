// lib/dbInit.ts
import { initialize, closePool } from '../utils/orcaledb';

let initialized = false;

export async function initializeDB() {
  if (!initialized) {
    await initialize();
    initialized = true;
    
    // Set up closing the pool when the app is shutting down
    process.on('SIGINT', async () => {
      try {
        await closePool();
      } finally {
        process.exit(0);
      }
    });
  }
}