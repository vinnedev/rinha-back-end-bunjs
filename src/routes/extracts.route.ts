import { Elysia } from "elysia";
import * as yup from "yup";
import { TransactionService } from "../services/transaction.service";
import { ValidationException } from "../utils/errors";

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
      const validationSchema = yup.object({
        id: yup.number().required("[id] is required").integer("[id] should be integer").positive("[id] should be positive"),
      });

      const { id: validatedId } = await validationSchema.validate({ id });
      const transactionService = new TransactionService();
      const extract = await transactionService.extract(validatedId);

      set.status = 200;
      return extract;
    } catch (err) {
      if (err instanceof ValidationException) {
        set.status = err.statusCode;
        return { error: err.message };
      }

      set.status = 400;
      return { error: err };
    }
  }
);