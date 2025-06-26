import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'
const sql = neon('postgresql://neondb_owner:npg_CgzHK7oVTWh1@ep-odd-bush-a8ki3qw6-pooler.eastus2.azure.neon.tech/personal-finance-tracker?sslmode=require');
 export const db = drizzle(  sql ,{schema});
