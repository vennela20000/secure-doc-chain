const { Pool } = require('pg');
require('dotenv').config();

// A "pool" manages multiple reusable database connections instead of
// opening/closing a brand new connection for every single request.
// This matters for performance once multiple users are using the app
// at the same time (see Phase 41 - performance & multi-user design).
// Hosted Postgres providers (Render, Railway, Neon, Supabase) usually
// hand you one connection string instead of separate host/port/user/pass
// fields, so DATABASE_URL is supported here and takes priority when set.
// Local dev keeps using the discrete DB_* vars from .env as before.
const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
    }
  : {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    };

const pool = new Pool({
  ...connectionConfig,
  max: 10,                      // max simultaneous connections in the pool
  idleTimeoutMillis: 30000,     // close idle connections after 30s
  connectionTimeoutMillis: 5000 // fail fast if DB doesn't respond in 5s
});

// Log a one-time confirmation when the pool successfully opens its first connection
pool.on('connect', () => {
  console.log('[INFO] PostgreSQL pool connected');
});

pool.on('error', (err) => {
  console.error('[ERROR] Unexpected PostgreSQL pool error:', err.message);
});

module.exports = pool;