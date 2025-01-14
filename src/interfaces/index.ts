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

export type HandleTransaction = {
  id: number;
  value: number;
  type: NonNullable<ETipo | undefined>;
  description: string;
};

export type HandleCreateTransaction = {
  customer_id: number;
  version: number;
  value: number;
  type: NonNullable<ETipo | undefined>;
  description: string;
  balance: number;
};

export type HandleUpdateBalance = {
  id: number;
  balance: number;
};


// Database Tables
export interface ICustomers {
  id: number;
  name: string;
  customer_limit: number;
  balance: number | null;
  version: number;
}

export interface ITransactions {
  id: number;
  customer_id: number;
  value: number;
  type: ETipo;
  description: string;
  created_at: Date;
}
