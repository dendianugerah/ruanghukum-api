import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL as string;
const client = postgres(connectionString);
const db = drizzle(client);

export * from "@/drizzle/schema/index";
export default db;
