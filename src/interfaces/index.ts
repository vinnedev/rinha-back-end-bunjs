export enum ETipo {
  "c" = "c",
  "d" = "d",
}

export interface ITransactions {
  valor: number;
  tipo: ETipo;
  descricao: string;
}

export interface ITransactionsResponse {
  limite: number;
  saldo: number;
}

export interface IExtractReponse {
  saldo: {
    total: number;
    data_extrato: Date;
    limite: number;
  };
  ultimas_transacoes: [
    {
      valor: number;
      tipo: ETipo;
      descricao: "string";
      realizada_em: Date;
    }
  ];
}

// Database Tables
export interface ICustomers {
  id: number;
  name: string;
  customer_limit: number;
  balance: number | null;
}

export interface ITransactions {
  id: number;
  customer_id: number;
  value: number;
  type: ETipo;
  description: string;
  created_at: Date;
}
