export const env = {
  PG_HOST: Bun.env.PG_HOST,
  PG_USER: Bun.env.PG_USER,
  PG_PASS: Bun.env.PG_PASS,
  PG_PORT: Bun.env.PG_PORT ? parseInt(Bun.env.PG_PORT) : 5432,
  PG_DB: Bun.env.PG_DB,
};
