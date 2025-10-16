import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("../../config.env") });

console.log("✅ Environment variables loaded from config.env");
