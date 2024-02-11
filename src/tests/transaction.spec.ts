import { afterAll, describe, expect, test } from "bun:test";
import request from "supertest";
import { app } from "../server";

describe("Transaction test", () => {
  const url = `${app.server?.hostname}:${app.server?.port}`;

  afterAll(() => {
    app.stop();
  });

  test("should be error param id", async () => {
    const reqBody = {
      valor: 2000,
      tipo: "d",
      descricao: "debit",
    };

    const receiveBody = {
      error:
        'id must be a `number` type, but the final value was: `NaN` (cast from the value `"dsadas"`).',
    };

    const response = await request(url)
      .post("/clientes/dsadas/transacoes")
      .send(reqBody);

    expect(response.status).toBe(422);
    expect(response.body).toStrictEqual(receiveBody);
  });

  test("should be not found customer error", async () => {
    const reqBody = {
      valor: 2000,
      tipo: "d",
      descricao: "debit",
    };

    const receiveBody = {
      error: "customer not found - id: 6",
    };

    const response = await request(url)
      .post("/clientes/6/transacoes")
      .send(reqBody);

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual(receiveBody);
  });

  test("should be realize transaction", async () => {
    const reqBody = {
      valor: 2000,
      tipo: "d",
      descricao: "debit",
    };

    const receiveBody = {
      limite: 2000,
      saldo: 1900,
    };

    const response = await request(url)
      .post("/clientes/1/transacoes")
      .send(reqBody);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(receiveBody);
  });

  test("should be realize inconsistent transaction", async () => {
    const reqBody = {
      valor: 2000000000000,
      tipo: "d",
      descricao: "debit",
    };

    const receiveBody = {
      error: "insufficient funds",
    };

    const response = await request(url)
      .post("/clientes/1/transacoes")
      .send(reqBody);

    expect(response.status).toBe(422);
    expect(response.body).toStrictEqual(receiveBody);
  });
});
