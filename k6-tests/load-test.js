import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 50 },  // Rampa inicial até 50 utilizadores
        { duration: '1m', target: 100 },  // Sobe para 100 utilizadores simultâneos
        { duration: '3m', target: 100 },  // Mantém 100 utilizadores em carga sustentada
        { duration: '30s', target: 0 },   // Desaceleração
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'], // 95% das requisições abaixo de 1 segundo
        http_req_failed: ['rate<0.01'],    // Menos de 1% de falhas permitidas
    },
};

const BASE_URL = __ENV.API_URL || 'http://192.168.0.2:8080';

export function setup() {
    const credentials = JSON.stringify({
        login: 'admin@email.com',
        senha: 'senha123SuperSegura',
    });

    const loginRes = http.post(`${BASE_URL}/auth/login`, credentials, {
        headers: { 'Content-Type': 'application/json' },
    });

    check(loginRes, {
        'login admin realizado com sucesso (200)': (r) => r.status === 200,
    });

    let token = '';
    try {
        token = loginRes.json('token') || loginRes.json('accessToken') || loginRes.body;
    } catch (e) {
        token = loginRes.body;
    }

    return { token };
}

export default function (data) {
    const rand = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    const uniq = `${__VU}_${__ITER}_${rand}`;
    const cpfUnico = `${String(__VU).padStart(3, '0')}${rand}`;

    const authHeaders = {
        headers: {
            Authorization: `Bearer ${data.token}`,
            'Content-Type': 'application/json',
        },
    };

    let adotanteId = null;
    let petId = null;

    group('01 - Cadastrar Adotante', () => {
        const payloadAdotante = JSON.stringify({
            nome: 'Joao Silva',
            cpf: cpfUnico,
            telefone: '84999999999',
            email: `joao_${uniq}@email.com`,
            endereco: {
                logradouro: 'Avenida Principal',
                numero: '100',
                cidade: 'Parnamirim',
            },
        });

        const res = http.post(`${BASE_URL}/api/v1/adotantes`, payloadAdotante, authHeaders);
        check(res, { 'adotante criado (201)': (r) => r.status === 201 });
        if (res.status === 201) adotanteId = res.json('id');
    });

    group('02 - Cadastrar Pet', () => {
        const payloadPet = JSON.stringify({
            nome: 'Rex',
            tipo: 'CACHORRO',
            sexo: 'MACHO',
            raca: 'SRD',
            dataNascimento: '2023-01-01',
            peso: 15.5,
            endereco: {
                logradouro: 'Avenida Principal',
                numero: '100',
                cidade: 'Parnamirim',
            },
        });

        const res = http.post(`${BASE_URL}/api/v1/pets`, payloadPet, authHeaders);
        check(res, { 'pet criado (201)': (r) => r.status === 201 });
        if (res.status === 201) petId = res.json('id');
    });

    group('03 - Listar Pets Disponiveis', () => {
        const res = http.get(`${BASE_URL}/api/v1/pets/disponiveis?page=0&size=10`, authHeaders);
        check(res, { 'listagem retornada (200)': (r) => r.status === 200 });
    });

    if (petId && adotanteId) {
        group('04 - Realizar Adocao', () => {
            const res = http.patch(
                `${BASE_URL}/api/v1/pets/${petId}/adotar?adotanteId=${adotanteId}`,
                null,
                authHeaders
            );
            check(res, { 'adocao concluida (200)': (r) => r.status === 200 });
        });
    }
    sleep(1);
}