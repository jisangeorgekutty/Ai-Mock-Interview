import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials:{
    url:'postgresql://ai_owner:Zpujac4IrMV8@ep-morning-art-a5nud72w.us-east-2.aws.neon.tech/ai-mock-interview?sslmode=require',
  }
});