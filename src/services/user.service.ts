import { postgres } from "../database/postgres";
import { ETipo, ICustomers, ITransactionsResponse } from "../interfaces";
import {
  CustomerNotFoundException,
  InconsistentTransactionException,
} from "../utils/errors";

export type HandleTransaction = {
  id: number;
  value: number;
  type: NonNullable<ETipo | undefined>;
  description: string;
};

class UserService {
  private _postgres = postgres;

  async transaction({ id, value, type, description }: HandleTransaction) {
    const customer = await this.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(
        `customer not found - id: ${id}`,
        404
      );
    }

    const debitTransaction = type === "d";
    const inconsistentBalance =
      customer.balance! - value < -customer.customer_limit!;

    if (debitTransaction && inconsistentBalance) {
      throw new InconsistentTransactionException("insufficient funds");
    }

    const creditTransaction = type === "c";

    const newValue = creditTransaction ? value : -value;
    const newBalance = customer.balance! + newValue;

    const handleTransaction: ITransactionsResponse = {
      limite: customer.customer_limit!,
      saldo: newBalance,
    };

    return handleTransaction;
  }

  async findById(id: number) {
    const conn = await this._postgres.connect();

    try {
      const { rows } = await conn.query({
        text: "SELECT * FROM customers WHERE id=$1 LIMIT 1;",
        values: [id],
      });
      return rows.length > 0 ? (rows[0] as ICustomers) : null;
    } catch (err) {
      console.error("Erro durante a consulta:", err);
    } finally {
      conn.release();
    }
  }

  async findAll() {
    const conn = await this._postgres.connect();

    try {
      const { rows } = await conn.query("SELECT * FROM customers;");
      return rows.length > 0 ? (rows as ICustomers[]) : null;
    } catch (err) {
      console.error("Erro durante a consulta:", err);
    } finally {
      conn.release();
    }
  }
}

export { UserService };
