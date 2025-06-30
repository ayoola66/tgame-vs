import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, "..", ".env") });

const dbUrl = process.env.DATABASE_URL;
console.log("Database URL:", dbUrl);
console.log(
  "URL starts with postgresql://?",
  dbUrl?.startsWith("postgresql://")
);
console.log("URL starts with postgres://?", dbUrl?.startsWith("postgres://"));
