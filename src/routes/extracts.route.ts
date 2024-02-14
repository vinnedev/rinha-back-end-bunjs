import { Elysia } from "elysia";
import { TransactionService } from "../services/transaction.service";
import { ValidationException } from "../utils/errors";
import { validateID } from "../utils/validations";

interface IReceiveRequest {
  params: {
    id: Record<"id", string>;
  };
  set: any;
}

export const extractsRouter = new Elysia().get(
  "/clientes/:id/extrato",
  async ({ params: { id }, set }: IReceiveRequest) => {
    try {
      const validatedId = validateID(id);
      const transactionService = new TransactionService();
      const extract = await transactionService.extract(validatedId);

      if (!extract) {
        set.status = 404;
        return {
          error: "extract not found",
        };
      }

      set.status = 200;
      return extract;
    } catch (err) {
      if (err instanceof ValidationException) {
        set.status = err.statusCode;

        return {
          error: err.message,
        };
      }

      if (err) {
        set.status = 422;
        return {
          error: err,
        };
      }
    }
  }
);
