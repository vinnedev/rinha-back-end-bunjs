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
}

export { UserService };
