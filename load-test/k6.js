import { randomIntBetween, randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { check, group, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  vus: 10,
  duration: '30s',
  stages: [
    { target: 85000, name: 'ramp-up to 85000 users' },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should complete below 500ms
  },
};

function randomClienteId() {
  return randomIntBetween(1, 5);
}

function randomValorTransacao() {
  return randomIntBetween(1, 10000);
}

function randomDescricao() {
  return randomString(10);
}

function validarConsistenciaSaldoLimite(saldo, limite) {
  if (saldo === undefined || limite === undefined) {
    throw new Error('Saldo or Limite is undefined');
  }
  if (saldo < limite * -1) {
    throw new Error('Limite ultrapassado!');
  }
  return true;
}

export default function () {
  group('Débitos', () => {
    const clienteId = randomClienteId();
    const valor = randomValorTransacao();
    const descricao = randomDescricao();
    const payload = JSON.stringify({
      valor: valor,
      tipo: 'd',
      descricao: descricao,
    });

    const res = http.post(`http://localhost:9999/clientes/${clienteId}/transacoes`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    check(res, {
      'status is 200 or 422': (r) => r.status === 200 || r.status === 422,
    });

    if (res.status === 200) {
      try {
        const jsonResponse = res.json();
        if (!jsonResponse) {
          console.error('Response is not JSON:', res.body);
          return;
        }

        const saldo = parseInt(jsonResponse?.saldo, 10) ?? null;
        const limite = parseInt(jsonResponse?.limite, 10) ?? null;

        validarConsistenciaSaldoLimite(saldo, limite);
      } catch (e) {
        console.error('Error processing response:', e.message, 'Response body:', res.body);
      }
    }
  });

  group('Créditos', () => {
    const clienteId = randomClienteId();
    const valor = randomValorTransacao();
    const descricao = randomDescricao();
    const payload = JSON.stringify({
      valor: valor,
      tipo: 'c',
      descricao: descricao,
    });

    const res = http.post(`http://localhost:9999/clientes/${clienteId}/transacoes`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    check(res, {
      'status is 200': (r) => r.status === 200,
    });

    if (res.status === 200) {
      try {
        const jsonResponse = res.json();
        if (!jsonResponse) {
          console.error('Response is not JSON:', res.body);
          return;
        }

        const saldo = parseInt(jsonResponse?.saldo, 10) ?? null;
        const limite = parseInt(jsonResponse?.limite, 10) ?? null;

        validarConsistenciaSaldoLimite(saldo, limite);
      } catch (e) {
        console.error('Error processing response:', e.message, 'Response body:', res.body);
      }
    }
  });

  group('Extratos', () => {
    const clienteId = randomClienteId();
    const res = http.get(`http://localhost:9999/clientes/${clienteId}/extrato`);

    check(res, {
      'status is 200': (r) => r.status === 200,
    });

    if (res.status === 200) {
      try {
        const jsonResponse = res.json();
        if (!jsonResponse) {
          console.error('Response is not JSON:', res.body);
          return;
        }

        const saldo = parseInt(jsonResponse?.saldo?.total, 10) ?? null;
        const limite = parseInt(jsonResponse?.saldo?.limite, 10) ?? null;

        validarConsistenciaSaldoLimite(saldo, limite);
      } catch (e) {
        console.error('Error processing response:', e.message, 'Response body:', res.body);
      }
    }
  });

  sleep(1);
}
