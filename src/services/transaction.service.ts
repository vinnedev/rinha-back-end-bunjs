import { postgres } from "../database/postgres";
import { ETipo, ITransactionsResponse } from "../interfaces";
import {
  CustomerNotFoundException,
  InconsistentTransactionException,
} from "../utils/errors";
import { UserService } from "./user.service";

export type HandleTransaction = {
  id: number;
  value: number;
  type: NonNullable<ETipo | undefined>;
  description: string;
};

export type HandleCreateTransaction = {
  customer_id: number;
  value: number;
  type: NonNullable<ETipo | undefined>;
  description: string;
  balance: number;
};

class TransactionService {
  private _postgres = postgres;
  private _userService = new UserService();

  async createTransaction({
    customer_id,
    value,
    type,
    description,
    balance,
  }: HandleCreateTransaction) {
    const conn = await this._postgres.connect();

    try {
      await conn.query("BEGIN");
      await conn.query(
        "INSERT INTO transactions (customer_id, value, type, description, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)",
        [customer_id, value, type, description]
      );

      await conn.query("UPDATE customers SET balance = $1 WHERE id = $2;", [
        balance,
        customer_id,
      ]);
      await conn.query("COMMIT");
    } catch (err) {
      await conn.query("ROLLBACK");
      console.error("Erro durante a inserção:", err);
    } finally {
      conn.release();
    }
  }

  async transaction({
    id,
    value,
    type,
    description,
  }: HandleTransaction): Promise<ITransactionsResponse> {
    const customer = await this._userService.findById(id);
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

    this.createTransaction({
      customer_id: id,
      value,
      type,
      description,
      balance: newBalance,
    });

    return {
      limite: customer.customer_limit!,
      saldo: newBalance,
    };
  }

  private formatExtract(data: any) {
    return {
      ...data,
      saldo: {
        ...data.saldo,
        data_extrato: new Date(data.saldo.data_extrato).toISOString(),
      },
      ultimas_transacoes: data.ultimas_transacoes.map((transacao: any) => ({
        ...transacao,
        realizada_em: new Date(transacao.realizada_em).toISOString(),
      })),
    };
  }

  async extract(customer_id: number) {
    const conn = await this._postgres.connect();

    try {
      const { rows } = await conn.query(
        `WITH last_transactions AS (
        SELECT
            t.customer_id,
            t.value,
            t.type,
            t.description,
            t.created_at
        FROM
            transactions t
        WHERE
            t.customer_id = $1
        ORDER BY
            t.created_at DESC
        LIMIT 10
      )
      SELECT json_build_object(
        'saldo', json_build_object(
            'total', COALESCE(c.balance, 0),
            'data_extrato', now(),
            'limite', c.customer_limit
        ),
        'ultimas_transacoes', COALESCE(json_agg(
            json_build_object(
                'valor', lt.value,
                'tipo', lt.type,
                'descricao', lt.description,
                'realizada_em', lt.created_at
            ) ORDER BY lt.created_at DESC
            ) FILTER (WHERE lt.value IS NOT NULL), '[]'::json)
      )
      FROM
        customers c
      LEFT JOIN
        last_transactions lt ON c.id = lt.customer_id
      WHERE
        c.id = $1
      GROUP BY
        c.id;`,
        [customer_id]
      );

      const data = rows[0].json_build_object;
      return this.formatExtract(data);
    } catch (err) {
      console.error("Erro durante a consulta:", err);
    } finally {
      conn.release();
    }
  }
}

export { TransactionService };
