import { Pool } from "pg";
import { env } from "../utils/env";

export const postgres = new Pool({
  connectionString: `postgres://${env.PG_USER}:${env.PG_PASS}:${env.PG_PORT}/${env.PG_DB}`,
  max: 15,
  idleTimeoutMillis: 7000,
});
