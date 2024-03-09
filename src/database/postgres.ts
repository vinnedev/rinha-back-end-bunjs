import { Pool } from "pg";
import { env } from "../utils/env";

const connectionString = env.PG_HOST
  ? env.PG_HOST
  : `postgres://3rfx8swo:CRXjHv7qOGFFKyY@localhost:5432/rinhadebackend`;

export const postgres = new Pool({
  connectionString,
  max: 25,
  idleTimeoutMillis: 30000,
});
