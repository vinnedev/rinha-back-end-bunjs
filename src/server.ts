import { Elysia } from "elysia";
import { transactionsRouter } from "./routes/transactions.route";

export const app = new Elysia().use(transactionsRouter).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
