import { config } from "dotenv";

config();

const dbUrl = process.env.DATABASE_URL;
console.log("Database URL:", dbUrl);
console.log(
  "URL starts with postgresql://?",
  dbUrl?.startsWith("postgresql://")
);
console.log("URL starts with postgres://?", dbUrl?.startsWith("postgres://"));
