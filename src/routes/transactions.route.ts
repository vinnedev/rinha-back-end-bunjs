import { Elysia } from "elysia";
import * as yup from "yup";
import { ETipo, ITransactions, ITransactionsResponse } from "../interfaces";
import { UserService } from "../services/user.service";
import {
  CustomerNotFoundException,
  InconsistentTransactionException,
  ValidationException,
} from "../utils/errors";

interface IReceiveRequest {
  body: ITransactions;
  params: {
    id: Record<"id", string>;
  };
  set: any;
}

export const transactionsRouter = new Elysia()
  .post(
    "clientes/:id/transacoes",
    async ({ body, params: { id }, set }: IReceiveRequest) => {
      try {
        const validationSchema = yup.object({
          id: yup
            .number()
            .required("[id] is required")
            .integer("[id] should be integer")
            .positive("[id] should be positive"),
          valor: yup
            .number()
            .required("[valor] is required")
            .integer("[valor] should be integer")
            .positive("[valor] should be positive"),
          tipo: yup
            .mixed<ETipo>()
            .oneOf(Object.values(ETipo))
            .required("[tipo] is required")
            .nonNullable(),
          descricao: yup
            .string()
            .required("[descricao] is requred")
            .min(1, "[description] must have at least 1 character")
            .max(10, "[description] must have a maximum of 10 characters"),
        });

        const data = await validationSchema
          .validate({
            id,
            valor: body.valor,
            tipo: body.tipo,
            descricao: body.descricao,
          })
          .catch((err) => {
            throw new ValidationException(err.message, 422);
          });

        const userService = new UserService();
        await Promise.resolve(
          await userService.transaction({
            id: data.id,
            value: data.valor,
            type: data.tipo,
            description: data.descricao,
          })
        );

        const handleResponse: ITransactionsResponse = {
          limite: data.valor,
          saldo: data.valor - 100,
        };

        set.status = 200;
        return handleResponse;
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
          return {
            error: err,
          };
        }
      }
    }
  )
  .get("/clientes/:id/extrato", async ({ params: { id }, set }) => {
    console.log("id", id);
    set.status = 200;

    return {
      body: "success",
    };
  });
