import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CepService {
  constructor(private http: HttpClient) {}

  buscarCep(cep: string) {
    const cepLimpo = cep.replace(/\D/g, '');
    return this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  }
}
