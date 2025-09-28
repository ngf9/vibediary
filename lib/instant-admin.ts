import { init } from '@instantdb/admin';
import schema from '@/instant.schema';

// Initialize the admin SDK for server-side usage
const adminToken = process.env.INSTANT_ADMIN_TOKEN!;
const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;

if (!adminToken) {
  throw new Error('INSTANT_ADMIN_TOKEN is not set in environment variables');
}

// Initialize and export the admin DB instance with schema
const adminDb = init({
    appId,
    adminToken,
    schema
  });

export { adminDb };

// Export the transaction helper
export const adminTx = adminDb.tx;