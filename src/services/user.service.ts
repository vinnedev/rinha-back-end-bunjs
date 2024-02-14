import { postgres } from "../database/postgres";
import { ICustomers } from "../interfaces";


class UserService {
  private _postgres = postgres;

  async findById(id: number) {
    if(id >= 6) return null    
    const conn = await this._postgres.connect();

    try {
      const { rows } = await conn.query({
        text: "SELECT id, customer_limit, balance FROM customers WHERE id=$1;",
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
      const { rows } = await conn.query("SELECT id, customer_limit, balance FROM customers;");
      return rows.length > 0 ? (rows as ICustomers[]) : null;
    } catch (err) {
      console.error("Erro durante a consulta:", err);
    } finally {
      conn.release();
    }
  }
}

export { UserService };
