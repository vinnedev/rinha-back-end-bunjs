import { postgres } from "../database/postgres";
import { ETipo, ICustomers } from "../interfaces";

export type HandleTransaction = {
  id: number;
  value: number;
  type: NonNullable<ETipo | undefined>;
  description: string;
};

export type HandleUpdateBalance = {
  id: number;
  balance: number;
};

class UserService {
  private _postgres = postgres;

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

  async updateBalance({ id, balance }: HandleUpdateBalance) {
    const conn = await this._postgres.connect();

    try {
      await conn.query("BEGIN");
      await conn.query("UPDATE customers SET balance = $1 WHERE id = $2;", [
        balance,
        id,
      ]);
      await conn.query("COMMIT");
    } catch (err) {
      await conn.query("ROLLBACK");
      console.error("Erro durante o update:", err);
    } finally {
      conn.release();
    }
  }
}

export { UserService };
