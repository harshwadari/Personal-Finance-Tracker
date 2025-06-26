import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./utils/schema.jsx",
 
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_CgzHK7oVTWh1@ep-odd-bush-a8ki3qw6-pooler.eastus2.azure.neon.tech/personal-finance-tracker?sslmode=require",
  } 
});