import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const client = postgres(process.env.DATABASE_URL!);
export const database = drizzle(client);
