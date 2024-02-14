import { Elysia } from "elysia";
import { extractsRouter } from "./routes/extracts.route";
import { transactionsRouter } from "./routes/transactions.route";

export const app = new Elysia()
  .use(transactionsRouter)
  .use(extractsRouter)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
 
