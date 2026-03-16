import dotenv from "dotenv";
dotenv.config();
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);
