import { Elysia } from "elysia";
import * as yup from "yup";
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
        id: yup
          .number()
          .required("[id] is required")
          .integer("[id] should be integer")
          .positive("[id] should be positive"),
      });

      const data = await validationSchema
        .validate({
          id,
        })
        .catch((err) => {
          throw new ValidationException(err.message, 422);
        });

      set.status = 200;
      return "";
    } catch (err) {
      if (err instanceof ValidationException) {
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
);
