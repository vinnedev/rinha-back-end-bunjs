import { Pool } from "pg";
import { env } from "../utils/env";

const connectionString = env.PG_HOST
  ? env.PG_HOST
  : `postgres://3rfx8swo:CRXjHv7qOGFFKyY@localhost:5432/rinhadebackend`;

export const postgres = new Pool({
  connectionString,
  max: 15,
  idleTimeoutMillis: 7000,
});

postgres.on("connect", () => {
  console.log("postgres connected");
});

postgres.on("error", (err) => {
  console.error(`Unhandled error: ${err}`);
  process.exit(-1);
});
