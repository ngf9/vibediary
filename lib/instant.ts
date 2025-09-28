import { init } from '@instantdb/react';
import schema from '@/instant.schema.portfolio';

// Initialize Instant DB with your app ID
const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID || 'beef7fbd-79bf-46cc-9a21-fead1908943b';

// Debug logging in production
if (typeof window !== 'undefined') {
  console.log('InstantDB App ID:', APP_ID);
  console.log('Environment:', process.env.NODE_ENV);
}

// Initialize and export the Instant DB instance with schema
export const db = init({ appId: APP_ID, schema });

// Export id function from @instantdb/react
export { id } from '@instantdb/react';

// Export useQuery and transact (tx) from db instance
export const { useQuery, transact } = db;
export const tx = db.tx;