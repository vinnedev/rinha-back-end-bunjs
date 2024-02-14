import { Elysia } from "elysia";
import { ITransactions } from "../interfaces";
import { TransactionService } from "../services/transaction.service";
import {
  CustomerNotFoundException,
  InconsistentTransactionException,
  ValidationException,
} from "../utils/errors";
import { validateDescricao, validateID, validateTipo, validateValor } from "../utils/validations";

interface IReceiveRequest {
  body: ITransactions;
  params: {
    id: Record<"id", string>;
  };
  set: any;
}

export const transactionsRouter = new Elysia().post(
  "clientes/:id/transacoes",
  async ({ body, params: { id }, set }: IReceiveRequest) => {
    try {
      const data = {
        id: validateID(id),
        valor: validateValor(body.valor),
        tipo: validateTipo(body.tipo),
        descricao: validateDescricao(body.descricao),
      }

      const transactionService = new TransactionService();
      const transaction = await transactionService.transaction({
        id: data.id,
        value: data.valor,
        type: data.tipo,
        description: data.descricao,
      });

      set.status = 200;
      return transaction;
    } catch (err) {
      if (err instanceof ValidationException) {
        set.status = err.statusCode;
        return {
          error: err.message,
        };
      }

      if (err instanceof InconsistentTransactionException) {
        set.status = err.statusCode;
        return {
          error: err.message,
        };
      }

      if (err instanceof CustomerNotFoundException) {
        set.status = err.statusCode;
        return {
          error: err.message,
        };
      }

      if (err) {
        set.status = 400;
        return err instanceof Error
          ? {
            error: err.message,
            stack: err.stack,
            cause: err.cause,
          }
          : console.log(err);
      }
    }
  }
);
