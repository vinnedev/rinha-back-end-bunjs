import { Pool } from "pg";
import { env } from "../utils/env";

export const postgres = new Pool({
  user: env.PG_USER,
  host: env.PG_HOST,
  database: env.PG_DB,
  password: env.PG_PASS,
  port: env.PG_PORT,
  max: 10,
  idleTimeoutMillis: 7000,
});
